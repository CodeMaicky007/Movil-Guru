type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL: Level =
  (process.env.AUTOMATION_LOG_LEVEL as Level | undefined) ??
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function emit(level: Level, scope: string, msg: string, ctx?: Record<string, unknown>) {
  if (LEVEL_RANK[level] < LEVEL_RANK[MIN_LEVEL]) return;
  const line = {
    t: new Date().toISOString(),
    lvl: level,
    scope,
    msg,
    ...(ctx ?? {}),
  };
  const out = JSON.stringify(line);
  if (level === 'error') console.error(out);
  else if (level === 'warn') console.warn(out);
  else console.log(out);
}

export type Logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => void;
  info:  (msg: string, ctx?: Record<string, unknown>) => void;
  warn:  (msg: string, ctx?: Record<string, unknown>) => void;
  error: (msg: string, ctx?: Record<string, unknown>) => void;
  child: (childScope: string) => Logger;
};

export function createLogger(scope: string): Logger {
  return {
    debug: (m, c) => emit('debug', scope, m, c),
    info:  (m, c) => emit('info',  scope, m, c),
    warn:  (m, c) => emit('warn',  scope, m, c),
    error: (m, c) => emit('error', scope, m, c),
    child: (childScope) => createLogger(`${scope}:${childScope}`),
  };
}
