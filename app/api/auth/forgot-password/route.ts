import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email }
    });

    if (!customer) {
      // Don't leak whether an email exists or not
      return NextResponse.json({ message: 'If the email exists, a reset link will be sent.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.customer.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    });

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    // If we have a Resend API key, send a real email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Dash Pharmacy <noreply@dashpharmacy.com>', 
        to: email,
        subject: 'Password Reset Request - Dash Pharmacy',
        html: `
          <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
            <h2 style="color: #016A40; margin-bottom: 20px;">Password Reset</h2>
            <p>Hello ${customer.name},</p>
            <p>We received a request to reset your password for your Dash Pharmacy account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #016A40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Dash Pharmacy. All rights reserved.</p>
          </div>
        `,
      });
      console.log(`[RESEND] Password reset email sent to ${email}`);
    } else {
      // Fallback for local development when no API key is present
      console.log(`\n\n[MOCK EMAIL] Password Reset Link for ${email}:\n${resetLink}\n\n`);
      console.log('⚠️ Note: To send real emails, add RESEND_API_KEY to your .env file.');
    }

    return NextResponse.json({ message: 'If the email exists, a reset link will be sent.', _devLink: !process.env.RESEND_API_KEY ? resetLink : undefined });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
