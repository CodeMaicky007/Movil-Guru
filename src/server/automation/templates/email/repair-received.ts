import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, detailsTable } from './_layout';
import { readRepairPayload, formatDate } from './_payload';

export function renderRepairReceived(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      Hemos recibido tu dispositivo. A partir de ahora podrás seguir el avance
      de tu reparación en tiempo real con tu código:
    </p>
    <p style="margin:0 0 22px 0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">
      ${r.code}
    </p>
    ${detailsTable([
      ['Dispositivo', r.device],
      ...(r.store_name ? [['Tienda', r.store_name] as [string, string]] : []),
      ...(r.scheduled_for
        ? [['Cita programada', formatDate(r.scheduled_for)] as [string, string]]
        : []),
    ])}
  `;

  return {
    subject: `Hemos recibido tu reparación · ${r.code}`,
    html: renderEmailLayout({
      preheader: `Tu reparación ${r.code} ya está en nuestras manos.`,
      headline: `Hola ${r.customer_name.split(' ')[0]}, ya tenemos tu dispositivo`,
      intro: 'Tu reparación está oficialmente abierta. Te avisaremos en cada paso del proceso.',
      bodyHtml: body,
      cta: { label: 'Seguir mi reparación', href: r.tracking_url },
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `Hemos recibido tu ${r.device}. Tu código de seguimiento es ${r.code}.\n` +
      `Sigue tu reparación en: ${r.tracking_url}\n\n` +
      `Movil Guru`,
  };
}
