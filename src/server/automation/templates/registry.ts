import type { RenderedEmail } from '../domain/notification';
import { renderRepairReceived } from './email/repair-received';
import { renderRepairInDiagnosis } from './email/repair-in-diagnosis';
import { renderRepairInProgress } from './email/repair-in-progress';
import { renderRepairInQc } from './email/repair-in-qc';
import { renderRepairReady } from './email/repair-ready';
import { renderRepairCancelled } from './email/repair-cancelled';
import { renderSatisfactionSurvey } from './email/satisfaction-survey';
import { renderWelcome } from './email/welcome';

// Registro central de templates. Cada entrada es una función pura que recibe
// el payload de la notificación y devuelve el email renderizado.
// Para añadir un canal nuevo basta con extender este objeto.

type EmailRenderer = (payload: Record<string, unknown>) => RenderedEmail;

export const emailTemplates: Record<string, EmailRenderer> = {
  'repair-received':       renderRepairReceived,
  'repair-in-diagnosis':   renderRepairInDiagnosis,
  'repair-in-progress':    renderRepairInProgress,
  'repair-in-qc':          renderRepairInQc,
  'repair-ready':          renderRepairReady,
  'repair-cancelled':      renderRepairCancelled,
  'satisfaction-survey':   renderSatisfactionSurvey,
  'welcome':               renderWelcome,
};

export function renderEmailTemplate(
  template: string,
  payload: Record<string, unknown>,
): RenderedEmail {
  const renderer = emailTemplates[template];
  if (!renderer) throw new Error(`Unknown email template: ${template}`);
  return renderer(payload);
}
