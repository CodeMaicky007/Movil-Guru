import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, detailsTable } from './_layout';
import { readRepairPayload } from './_payload';

export function renderRepairInQc(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      La reparación está terminada y ahora pasa por nuestro control de calidad:
      verificamos pantalla, batería, sensores, conectividad y carga. En cuanto
      pase todas las pruebas te avisaremos para que vengas a recogerlo.
    </p>
    ${detailsTable([
      ['Reparación', r.code],
      ['Dispositivo', r.device],
    ])}
  `;

  return {
    subject: `Casi listo: control de calidad · ${r.code}`,
    html: renderEmailLayout({
      preheader: 'Tu dispositivo está pasando control de calidad.',
      headline: 'Última fase: control de calidad',
      intro: 'Verificamos que todo funciona perfectamente antes de devolvértelo.',
      bodyHtml: body,
      cta: { label: 'Ver estado', href: r.tracking_url },
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `Tu ${r.device} (${r.code}) está pasando el control de calidad final.\n` +
      `Estado: ${r.tracking_url}\n\n` +
      `Movil Guru`,
  };
}
