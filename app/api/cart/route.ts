import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ items: [] });
    }

    const cart = await prisma.cart.findUnique({
      where: { customerId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    const mappedItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    return NextResponse.json({ items: mappedItems });
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body as { items: { productId: string; quantity: number }[] };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Upsert the cart
    const cart = await prisma.cart.upsert({
      where: { customerId: session.user.id },
      create: { customerId: session.user.id },
      update: {},
    });

    // We can do this in a transaction: delete existing items, insert new items.
    // Or we can just use deleteMany and createMany.
    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      }),
      prisma.cartItem.createMany({
        data: items.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    ]);

    // Fetch the updated cart to return complete product objects
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const mappedItems = updatedCart?.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })) || [];

    return NextResponse.json({ items: mappedItems });
  } catch (error) {
    console.error('Failed to sync cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
