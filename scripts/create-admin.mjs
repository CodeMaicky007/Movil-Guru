// Bootstrapping del primer admin.
// Uso: node scripts/create-admin.mjs <email> <password> "<nombre completo>"
// Requiere SUPABASE_SERVICE_ROLE_KEY en el entorno (carga .env.local automáticamente).

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv() {
  const file = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

loadDotEnv();

const [, , email, password, ...nameParts] = process.argv;
const fullName = nameParts.join(' ').trim();

if (!email || !password) {
  console.error('Uso: node scripts/create-admin.mjs <email> <password> "<nombre completo>"');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { role: 'admin', full_name: fullName },
});

if (error) {
  console.error('Error creando usuario:', error.message);
  process.exit(1);
}

// El trigger handle_new_user crea el profile, pero por si acaso forzamos role admin.
await admin.from('profiles').update({ role: 'admin', full_name: fullName }).eq('id', data.user.id);

console.log('Admin creado:', data.user.email);
