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

    if (role === 'ADMIN' && process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const dashboardLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin`;
      
      try {
        await resend.emails.send({
          from: 'Dash Pharmacy <noreply@dashpharmacy.com>',
          to: updatedUser.email,
          subject: 'Admin Access Granted - Dash Pharmacy',
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
              <h2 style="color: #016A40; margin-bottom: 20px;">Your account was upgraded!</h2>
              <p>Hello ${updatedUser.name},</p>
              <p>Your Dash Pharmacy account has been successfully upgraded by a system administrator. You now have full <strong>ADMIN</strong> access.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardLink}" style="background-color: #016A40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">If you did not request this change, please contact support immediately.</p>
              <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Dash Pharmacy. All rights reserved.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send admin promotion email:', emailError);
      }
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
