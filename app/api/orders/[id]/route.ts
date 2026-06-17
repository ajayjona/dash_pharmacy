import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        deliveryAddress: true,
        items: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { status, paymentStatus, action, productId, quantity } = body;

    if (action === 'ADD_ITEM') {
      if (!productId || !quantity) return NextResponse.json({ error: 'Missing product details' }, { status: 400 });
      
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

      const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

      const itemTotal = product.price * quantity;
      
      // Update order with new item and totals
      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: {
          subtotal: order.subtotal + itemTotal,
          total: order.total + itemTotal,
          items: {
            create: {
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: quantity,
              image: product.image
            }
          }
        },
        include: {
          customer: true,
          deliveryAddress: true,
          items: true,
        }
      });
      return NextResponse.json(updatedOrder);
    }

    const data: any = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
      include: {
        customer: true,
        deliveryAddress: true,
        items: true,
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
