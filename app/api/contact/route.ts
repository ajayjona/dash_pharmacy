import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      try {
        await resend.emails.send({
          from: 'Dash Pharmacy <noreply@dashpharmacy.com>',
          to: 'dashcarephampahm@gmail.com',
          replyTo: email,
          subject: `New Contact Request: ${subject || 'General Inquiry'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
              <h2 style="color: #016A40; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">New Contact Submission</h2>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
              <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError);
      }
    } else {
      console.log(`\n\n[MOCK EMAIL] Contact form submitted by ${firstName} ${lastName} (${email})\nSubject: ${subject}\nMessage: ${message}\n\n`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
