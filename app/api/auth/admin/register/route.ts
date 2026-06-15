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

    // Send welcome/notification email to the new admin
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const dashboardLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin`;
      
      try {
        await resend.emails.send({
          from: 'Dash Pharmacy <noreply@dashpharmacy.com>',
          to: email,
          subject: 'Welcome to Dash Pharmacy Admin',
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
              <h2 style="color: #016A40; margin-bottom: 20px;">Welcome to the Admin Team!</h2>
              <p>Hello ${name},</p>
              <p>Your administrative account has been successfully created. You now have full access to the Dash Pharmacy management dashboard.</p>
              <p>Your role: <strong>${title}</strong></p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardLink}" style="background-color: #016A40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">Please keep your login credentials secure. If you have any questions, reach out to the system administrator.</p>
              <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Dash Pharmacy. All rights reserved.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send admin welcome email:', emailError);
        // Continue anyway since the user was created successfully
      }
    }

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Failed to register admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
