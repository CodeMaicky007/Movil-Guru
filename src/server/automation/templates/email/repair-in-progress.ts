import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout, detailsTable } from './_layout';
import { readRepairPayload } from './_payload';

export function renderRepairInProgress(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      Nuestro equipo ya está trabajando en tu dispositivo con piezas originales y
      un protocolo de calidad probado. Cuando esté listo pasará por nuestro
      control final antes de avisarte para recogerlo.
    </p>
    ${detailsTable([
      ['Reparación', r.code],
      ['Dispositivo', r.device],
      ...(r.technician_name ? [['Técnico', r.technician_name] as [string, string]] : []),
    ])}
  `;

  return {
    subject: `Reparando tu ${r.device} · ${r.code}`,
    html: renderEmailLayout({
      preheader: 'Tu dispositivo ya está sobre la mesa de reparación.',
      headline: 'Manos a la obra',
      intro: 'Estamos reparando tu dispositivo en este momento.',
      bodyHtml: body,
      cta: { label: 'Ver progreso', href: r.tracking_url },
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `Estamos reparando tu ${r.device} (${r.code}).\n` +
      `Sigue el progreso: ${r.tracking_url}\n\n` +
      `Movil Guru`,
  };
}
