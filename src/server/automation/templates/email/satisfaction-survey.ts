import type { RenderedEmail } from '../../domain/notification';
import { renderEmailLayout } from './_layout';
import { readRepairPayload } from './_payload';

export function renderSatisfactionSurvey(p: Record<string, unknown>): RenderedEmail {
  const r = readRepairPayload(p);

  const body = `
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
      Esperamos que tu ${escapeForBody(r.device)} esté funcionando perfectamente
      después de pasar por nuestras manos. Si tienes 30 segundos, nos encantaría
      saber cómo fue tu experiencia.
    </p>
    <p style="margin:0 0 8px 0;font-size:13px;color:#6B7280;letter-spacing:0.02em;">
      Tu opinión nos ayuda a mejorar y a otros clientes a decidir.
    </p>
  `;

  const reviewUrl = `${r.tracking_url.replace(/\/track.*$/, '')}/opiniones`;

  return {
    subject: `¿Cómo fue tu reparación, ${r.customer_name.split(' ')[0]}?`,
    html: renderEmailLayout({
      preheader: '30 segundos para contarnos cómo fue tu experiencia.',
      headline: '¿Cómo fue tu experiencia?',
      intro: 'Nos importa lo que piensas.',
      bodyHtml: body,
      cta: { label: 'Dejar una reseña', href: reviewUrl },
      footerNote:
        'Tu reparación tiene garantía. Si algo no va como debería, respóndenos a este correo y lo solucionamos.',
    }),
    text:
      `Hola ${r.customer_name},\n\n` +
      `¿Cómo fue tu experiencia con la reparación ${r.code}?\n` +
      `Déjanos una reseña: ${reviewUrl}\n\n` +
      `Movil Guru`,
  };
}

function escapeForBody(s: string): string {
  return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
