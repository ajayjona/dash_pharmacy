import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role - if this is the very first user ever created, make them an ADMIN
    const userCount = await prisma.customer.count();
    const role = userCount === 0 ? 'ADMIN' : 'CUSTOMER';

    // Create the user (Customer)
    const newUser = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || '', // Phone might be optional in the UI, fallback to empty string if schema allows it
        password: hashedPassword,
        role,
      },
    });

    // Don't send back the password hash
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Failed to register user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
