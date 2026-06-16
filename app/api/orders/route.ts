import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        deliveryAddress: true,
        items: true,
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, addressData, addressId, deliveryFee, subtotal, total, deliveryOption } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let finalAddressId = addressId;

    if (!finalAddressId) {
      // Create new address
      const address = await prisma.address.create({
        data: {
          name: session.user.name || 'Customer',
          phone: addressData.phone || 'Unknown',
          street: addressData.street || 'Unknown',
          district: addressData.district || 'Kampala',
          customerId: (session.user as any).id,
        }
      });
      finalAddressId = address.id;
    } else {
      // Verify existing address belongs to user
      const existingAddress = await prisma.address.findUnique({ where: { id: finalAddressId } });
      if (!existingAddress || existingAddress.customerId !== (session.user as any).id) {
        return NextResponse.json({ error: 'Invalid address' }, { status: 403 });
      }
    }

    const orderNumber = `DSH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: (session.user as any).id,
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        deliveryAddressId: finalAddressId,
        paymentMethod: 'pending',
        paymentStatus: 'pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          }))
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
