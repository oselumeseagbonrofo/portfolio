import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { validateContactForm } from '@/utils/validation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate the form data
    const validation = validateContactForm(body);
    if (!validation.isValid) {
      // Get the first error message
      const errorMsg = Object.values(validation.errors)[0];
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'New Outreach <onboarding@resend.dev>',
      to: ['mudi123@duck.com'],
      subject: `New message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #555;">Message:</h3>
          <p style="white-space: pre-wrap; color: #333;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
