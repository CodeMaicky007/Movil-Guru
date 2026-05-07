import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AutomationDispatcher, isAuthorizedCronRequest, createLogger } from '@/server/automation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const log = createLogger('cron:process-events');

export async function GET(req: Request) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const started = Date.now();
  const dispatcher = new AutomationDispatcher(createSupabaseAdminClient());

  try {
    const result = await dispatcher.tick(100);
    log.info('tick.done', { ...result, ms: Date.now() - started });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    log.error('tick.error', { error });
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
