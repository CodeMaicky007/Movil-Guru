import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, detailsTable } from './_layout';
import { readRepairPayload, formatPrice } from './_payload';

export function renderRepairReady(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      Buenas noticias: tu dispositivo ha pasado todos nuestros controles y
      <strong>está listo para recoger</strong>. Te esperamos cuando te venga bien
      en horario de tienda.
    </p>
    ${detailsTable([
      ['Código', r.code],
      ['Dispositivo', r.device],
      ...(r.store_name ? [['Recoger en', r.store_name] as [string, string]] : []),
      ...(r.price != null ? [['Importe', formatPrice(r.price)] as [string, string]] : []),
    ])}
    <p style="margin:18px 0 0 0;font-size:13px;line-height:1.6;color:#6B7280;">
      Recuerda traer un documento identificativo para retirar la reparación.
      Tu garantía empieza el día que recoges el dispositivo.
    </p>
  `;

  return {
    subject: `Tu ${r.device} ya está listo · ${r.code}`,
    html: renderEmailLayout({
      preheader: 'Listo para recoger. Te esperamos en tienda.',
      headline: 'Tu dispositivo está listo',
      intro: 'Reparación terminada y verificada.',
      bodyHtml: body,
      cta: { label: 'Ver detalles de recogida', href: r.tracking_url },
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `Tu ${r.device} (${r.code}) está listo para recoger` +
      `${r.store_name ? ` en ${r.store_name}` : ''}.\n` +
      `Detalles: ${r.tracking_url}\n\n` +
      `Movil Guru`,
  };
}
