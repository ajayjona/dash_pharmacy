import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const address = await prisma.address.findUnique({ where: { id: params.id } });
    if (!address || address.customerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: {
        phone: body.phone,
        street: body.street,
        district: body.district,
      }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Failed to update address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const address = await prisma.address.findUnique({ where: { id: params.id } });
    if (!address || address.customerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 403 });
    }

    await prisma.address.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
