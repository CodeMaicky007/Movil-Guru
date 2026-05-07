// Layout premium para todos los emails. HTML compatible con clientes mayoritarios
// (Gmail, Outlook, Apple Mail). Sin dependencias externas; estilos inline.

const BRAND = {
  accent: '#CCFF00',
  ink: '#0A0A0A',
  paper: '#FFFFFF',
  muted: '#6B7280',
  border: '#E5E7EB',
  surface: '#FAFAFA',
} as const;

export type EmailLayoutInput = {
  preheader: string;
  headline: string;
  intro?: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
};

export function renderEmailLayout(input: EmailLayoutInput): string {
  const { preheader, headline, intro, bodyHtml, cta, footerNote } = input;

  const ctaBlock = cta
    ? `
      <tr>
        <td align="left" style="padding: 8px 32px 32px 32px;">
          <a href="${escapeAttr(cta.href)}"
             style="display:inline-block;background:${BRAND.ink};color:${BRAND.accent};
                    text-decoration:none;font-weight:700;font-size:15px;letter-spacing:-0.01em;
                    padding:14px 22px;border-radius:999px;">
            ${escapeHtml(cta.label)}
          </a>
        </td>
      </tr>`
    : '';

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(headline)}</title>
    <style>
      @media (prefers-color-scheme: dark) {
        .mg-bg { background: #0A0A0A !important; }
        .mg-card { background: #111 !important; border-color: #222 !important; }
        .mg-ink { color: #FAFAFA !important; }
        .mg-muted { color: #9CA3AF !important; }
        .mg-divider { background: #222 !important; }
      }
    </style>
  </head>
  <body class="mg-bg" style="margin:0;padding:0;background:${BRAND.surface};
                              font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif;
                              color:${BRAND.ink};">
    <span style="display:none !important;visibility:hidden;opacity:0;color:transparent;
                 height:0;width:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(preheader)}
    </span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:${BRAND.surface};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:560px;">

            <tr>
              <td style="padding: 0 4px 20px 4px;" align="left">
                <span style="font-size:13px;font-weight:700;letter-spacing:0.18em;
                             text-transform:uppercase;color:${BRAND.muted};">
                  Movil&nbsp;Guru
                </span>
              </td>
            </tr>

            <tr>
              <td class="mg-card" style="background:${BRAND.paper};border:1px solid ${BRAND.border};
                                          border-radius:20px;overflow:hidden;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 36px 32px 8px 32px;">
                      <h1 class="mg-ink" style="margin:0;font-size:26px;line-height:1.15;
                                                 letter-spacing:-0.025em;font-weight:700;color:${BRAND.ink};">
                        ${escapeHtml(headline)}
                      </h1>
                    </td>
                  </tr>
                  ${
                    intro
                      ? `<tr>
                          <td style="padding: 16px 32px 0 32px;">
                            <p class="mg-muted" style="margin:0;font-size:15px;line-height:1.7;color:${BRAND.muted};">
                              ${escapeHtml(intro)}
                            </p>
                          </td>
                        </tr>`
                      : ''
                  }
                  <tr>
                    <td style="padding: 24px 32px 8px 32px;" class="mg-ink">
                      ${bodyHtml}
                    </td>
                  </tr>
                  ${ctaBlock}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 24px 8px 0 8px;" align="left">
                <p class="mg-muted" style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.muted};">
                  ${footerNote ? escapeHtml(footerNote) + '<br/>' : ''}
                  Recibes este correo porque tienes una reparación activa con Movil Guru.
                  Si no la has solicitado, contáctanos respondiendo a este mensaje.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function detailsTable(rows: Array<[string, string]>): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px solid ${BRAND.border};border-radius:14px;overflow:hidden;">
      ${rows
        .map(
          ([k, v], i) => `
        <tr>
          <td style="padding:14px 18px;background:${i % 2 === 0 ? BRAND.surface : BRAND.paper};
                     font-size:13px;color:${BRAND.muted};letter-spacing:0.02em;width:38%;">
            ${escapeHtml(k)}
          </td>
          <td style="padding:14px 18px;background:${i % 2 === 0 ? BRAND.surface : BRAND.paper};
                     font-size:14px;color:${BRAND.ink};font-weight:600;">
            ${escapeHtml(v)}
          </td>
        </tr>`
        )
        .join('')}
    </table>`;
}

export function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(s: string): string {
  return escapeHtml(s);
}
