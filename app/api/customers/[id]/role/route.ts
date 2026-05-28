import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { role } = await request.json();

    if (role !== 'ADMIN' && role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent downgrading the last admin
    if (role === 'CUSTOMER') {
      const adminCount = await prisma.customer.count({ where: { role: 'ADMIN' } });
      const user = await prisma.customer.findUnique({ where: { id: params.id } });
      
      if (user?.role === 'ADMIN' && adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot remove the last administrator' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.customer.update({
      where: { id: params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
