import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, name, email, title, image, currentPassword, newPassword } = await request.json();

    if (type === 'profile') {
      await prisma.customer.update({
        where: { email: session.user.email },
        data: { name, title, image }
      });
      return NextResponse.json({ success: true });
    }

    if (type === 'security') {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to update credentials' }, { status: 400 });
      }

      const user = await prisma.customer.findUnique({
        where: { email: session.user.email },
      });

      if (!user || !user.password) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }

      const updateData: any = { email };
      
      if (newPassword && newPassword.length >= 6) {
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      await prisma.customer.update({
        where: { email: session.user.email },
        data: updateData
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update credentials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
