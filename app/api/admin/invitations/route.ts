import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ensure this matches your authOptions export path

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const invitations = await prisma.adminInvitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Failed to fetch invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existingUser = await prisma.customer.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Upsert invitation (in case they already have an unused/expired one)
    const invitation = await prisma.adminInvitation.upsert({
      where: { email },
      update: {
        token,
        expiresAt,
        used: false,
        createdBy: (session.user as any).id
      },
      create: {
        email,
        token,
        expiresAt,
        createdBy: (session.user as any).id
      }
    });

    const inviteLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/auth/register?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      try {
        await resend.emails.send({
          from: 'Dash Pharmacy <noreply@dashpharmacy.com>',
          to: email,
          subject: 'Admin Invitation - Dash Pharmacy',
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
              <h2 style="color: #016A40; margin-bottom: 20px;">You've been invited!</h2>
              <p>Hello,</p>
              <p>You have been invited to join the Dash Pharmacy admin team by ${session.user?.name || 'an administrator'}.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" style="background-color: #016A40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Accept Invitation & Setup Profile
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">This link will expire in 7 days.</p>
              <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Dash Pharmacy. All rights reserved.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send invite email:', emailError);
      }
    } else {
      console.log(`\n\n[MOCK EMAIL] Admin Invite Link for ${email}:\n${inviteLink}\n\n`);
    }

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Failed to create invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
