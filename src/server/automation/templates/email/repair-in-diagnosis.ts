import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, detailsTable } from './_layout';
import { readRepairPayload } from './_payload';

export function renderRepairInDiagnosis(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      Nuestro equipo está revisando tu dispositivo a fondo para identificar
      con precisión qué necesita. En cuanto tengamos el diagnóstico te lo enviamos
      junto al presupuesto, sin sorpresas.
    </p>
    ${detailsTable([
      ['Reparación', r.code],
      ['Dispositivo', r.device],
      ...(r.technician_name ? [['Técnico asignado', r.technician_name] as [string, string]] : []),
    ])}
  `;

  return {
    subject: `Estamos diagnosticando tu ${r.device} · ${r.code}`,
    html: renderEmailLayout({
      preheader: 'Estamos analizando tu dispositivo. Te avisaremos con el diagnóstico.',
      headline: 'Tu reparación está en diagnóstico',
      intro: 'Gracias por confiar en nosotros. Estamos en ello.',
      bodyHtml: body,
      cta: { label: 'Ver estado en directo', href: r.tracking_url },
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `Tu ${r.device} (${r.code}) está siendo diagnosticado por nuestro equipo.\n` +
      `Sigue tu reparación: ${r.tracking_url}\n\n` +
      `Movil Guru`,
  };
}
