import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, name, email, phone, password, title, image } = await request.json();

    if (!token || !name || !email || !password || !title || !image) {
      return NextResponse.json({ error: 'Missing mandatory administrative profile fields or token' }, { status: 400 });
    }

    const newUser = await prisma.$transaction(async (tx) => {
      const invitation = await tx.adminInvitation.findUnique({
        where: { token }
      });

      if (!invitation) {
        throw new Error('Invalid invitation token');
      }

      if (invitation.used) {
        throw new Error('This invitation has already been used');
      }

      if (invitation.expiresAt < new Date()) {
        throw new Error('This invitation has expired');
      }

      if (invitation.email.toLowerCase() !== email.toLowerCase()) {
        throw new Error('Email does not match the invitation');
      }

      const existingUser = await tx.customer.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await tx.customer.create({
        data: {
          name,
          email,
          phone: phone || '',
          password: hashedPassword,
          role: 'ADMIN', // Hardcoded safely server-side because the token dictates ADMIN creation
          title,
          image
        },
      });

      // Mark invitation as used
      await tx.adminInvitation.update({
        where: { id: invitation.id },
        data: { used: true }
      });

      return createdUser;
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
      }
    }

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Failed to register admin:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('token') || message.includes('invitation') || message.includes('exists') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
