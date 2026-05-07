import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, detailsTable } from './_layout';
import { readRepairPayload } from './_payload';

export function renderRepairCancelled(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      Te confirmamos que tu reparación ha sido cancelada. Si crees que es un error
      o quieres retomarla, simplemente responde a este correo o pásate por la
      tienda y la reabrimos al momento.
    </p>
    ${detailsTable([
      ['Reparación', r.code],
      ['Dispositivo', r.device],
      ...(r.store_name ? [['Tienda', r.store_name] as [string, string]] : []),
    ])}
  `;

  return {
    subject: `Reparación cancelada · ${r.code}`,
    html: renderEmailLayout({
      preheader: 'Tu reparación ha sido cancelada.',
      headline: 'Reparación cancelada',
      intro: 'Lamentamos no poder ayudarte esta vez.',
      bodyHtml: body,
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `Tu reparación ${r.code} ha sido cancelada.\n` +
      `Si necesitas retomarla, contáctanos.\n\n` +
      `Movil Guru`,
  };
}
