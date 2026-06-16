import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { action } = await request.json(); // 'revoke' or 'resend'

    const invitation = await prisma.adminInvitation.findUnique({
      where: { id: params.id }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (action === 'revoke') {
      const updated = await prisma.adminInvitation.update({
        where: { id: params.id },
        data: { expiresAt: new Date(Date.now() - 1000) } // expire immediately
      });
      return NextResponse.json(updated);
    } 
    
    if (action === 'resend') {
      const newToken = crypto.randomBytes(32).toString('hex');
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const updated = await prisma.adminInvitation.update({
        where: { id: params.id },
        data: { token: newToken, expiresAt: newExpiresAt, used: false }
      });

      const inviteLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/auth/register?token=${newToken}`;

      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        try {
          await resend.emails.send({
            from: 'Dash Pharmacy <noreply@dashpharmacy.com>',
            to: invitation.email,
            subject: 'Admin Invitation (Reminder) - Dash Pharmacy',
            html: `
              <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
                <h2 style="color: #016A40; margin-bottom: 20px;">You've been invited!</h2>
                <p>Hello,</p>
                <p>This is a reminder that you have been invited to join the Dash Pharmacy admin team.</p>
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
          console.error('Failed to resend invite email:', emailError);
        }
      } else {
        console.log(`\n\n[MOCK EMAIL] Resent Admin Invite Link for ${invitation.email}:\n${inviteLink}\n\n`);
      }

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Failed to update invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
