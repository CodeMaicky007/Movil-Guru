// Autorización para endpoints internos de automatización.
// Vercel Cron envía `Authorization: Bearer ${CRON_SECRET}` automáticamente.
// Para invocaciones manuales (debug, retry desde el panel), aceptamos
// también la cabecera `x-internal-key` con el mismo valor.

export function isAuthorizedCronRequest(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Sin secreto configurado: sólo permitimos en desarrollo.
    return process.env.NODE_ENV !== 'production';
  }
  const auth = req.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;
  if (req.headers.get('x-internal-key') === secret) return true;
  return false;
}
