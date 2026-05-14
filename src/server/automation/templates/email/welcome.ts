import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, escapeHtml } from './_layout';

export function renderWelcome(p: Record<string, unknown>): RenderedEmail {
  const name       = String(p.name ?? 'Cliente');
  const firstName  = name.split(' ')[0];
  const email      = String(p.email ?? '');
  const couponCode = 'GURU5OFF';

  const body = `
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;">
      Nos alegra tenerte aquí. Tu cuenta Movil Guru ya está activa y puedes
      usarla para seguir tus reparaciones, gestionar garantías y acceder a
      ofertas exclusivas.
    </p>

    <!-- Cupón destacado -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td style="background:#0A0A0A;border-radius:16px;padding:24px;text-align:center;">
          <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.2em;
                    text-transform:uppercase;color:#6B7280;">
            Tu cupón de bienvenida
          </p>
          <p style="margin:0 0 10px 0;font-size:32px;font-weight:700;letter-spacing:0.12em;
                    color:#CCFF00;font-family:monospace;">
            ${escapeHtml(couponCode)}
          </p>
          <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
            <strong style="color:#CCFF00;">5% de descuento</strong> en tu próximo servicio.<br/>
            Válido durante 30 días · No acumulable con otras ofertas.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px 0;font-size:13px;color:#6B7280;">
      Cuenta registrada con:
    </p>
    <p style="margin:0 0 20px 0;font-size:14px;font-weight:600;color:#0A0A0A;">
      ${escapeHtml(email)}
    </p>

    <p style="margin:0;font-size:14px;line-height:1.7;color:#6B7280;">
      Si tienes cualquier pregunta, responde a este correo y te ayudamos encantados.
    </p>
  `;

  return {
    subject: `Bienvenido a Movil Guru, ${firstName} 👋`,
    html: renderEmailLayout({
      preheader: `Tu cuenta está activa. Tienes un 5% de descuento esperándote.`,
      headline:  `Hola ${escapeHtml(firstName)}, bienvenido a Movil Guru`,
      intro:     'Tu cuenta está lista. Guarda este correo — tiene algo especial para ti.',
      bodyHtml:  body,
      cta:       { label: 'Iniciar sesión', href: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://movilguru.com'}/login` },
      footerNote: 'Recibiste este mensaje porque acabas de crear una cuenta en Movil Guru.',
    }),
    text:
      `Hola ${firstName},\n\n` +
      `Bienvenido a Movil Guru. Tu cuenta ya está activa.\n\n` +
      `Tu cupón de bienvenida: ${couponCode} (5% de descuento en tu próximo servicio, válido 30 días).\n\n` +
      `Inicia sesión en: ${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://movilguru.com'}/login\n\n` +
      `Movil Guru`,
  };
}
