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
    const { status, paymentStatus, action, item } = body;

    if (action === 'ADD_ITEM' && item) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

      await prisma.orderItem.create({
        data: {
          orderId: params.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
        }
      });

      const orderToUpdate = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } });
      if (orderToUpdate) {
        const newSubtotal = orderToUpdate.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        const newTotal = newSubtotal + orderToUpdate.deliveryFee - orderToUpdate.discount;
        
        const updatedOrder = await prisma.order.update({
          where: { id: params.id },
          data: { subtotal: newSubtotal, total: newTotal },
          include: { customer: true, deliveryAddress: true, items: true }
        });
        return NextResponse.json(updatedOrder);
      }
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
