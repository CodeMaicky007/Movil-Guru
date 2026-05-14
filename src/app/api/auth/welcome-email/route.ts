import { NextRequest, NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { renderWelcome } from '@/server/automation/templates/email/welcome';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'name and email required' }, { status: 400 });
    }

    const smtpLogin    = process.env.BREVO_SMTP_LOGIN;
    const smtpPassword = process.env.BREVO_SMTP_PASSWORD;
    const fromEmail    = process.env.BREVO_FROM_EMAIL ?? 'ac.miguelangel.vega@gmail.com';
    const fromName     = process.env.BREVO_FROM_NAME  ?? 'Movil Guru';

    if (!smtpLogin || !smtpPassword) {
      console.warn('[welcome-email] Brevo credentials not configured');
      return NextResponse.json({ ok: true, skipped: true });
    }

    const rendered = renderWelcome({ name, email });

    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user: smtpLogin, pass: smtpPassword },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    console.log('[welcome-email] sent:', info.messageId, '→', email);
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[welcome-email] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
