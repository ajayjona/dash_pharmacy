import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, title, image } = await request.json();

    if (!name || !email || !password || !title || !image) {
      return NextResponse.json({ error: 'Missing mandatory administrative profile fields' }, { status: 400 });
    }

    const existingUser = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // To ensure security, an admin account can only be created via this endpoint if there are currently NO admins.
    // OR if we wanted to allow multiple admins, we'd add an invite code logic. For MVP, we'll assign ADMIN.
    // Since this is a dedicated admin setup route, we assign ADMIN role.
    const adminCount = await prisma.customer.count({ where: { role: 'ADMIN' } });
    if (adminCount >= 5) {
      return NextResponse.json({ error: 'Maximum number of administrators reached. Setup restricted.' }, { status: 403 });
    }

    const newUser = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || '',
        password: hashedPassword,
        role: 'ADMIN',
        title,
        image
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Failed to register admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
