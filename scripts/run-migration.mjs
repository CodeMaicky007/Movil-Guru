// Ejecuta la migración SQL contra Supabase usando el endpoint rpc de PostgreSQL
// a través de la API REST con la service_role key.
// Uso: node scripts/run-migration.mjs

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

// Leer el SQL
const sqlPath = path.resolve(process.cwd(), 'supabase/migrations/0001_init.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log(`Ejecutando migración (${sql.length} chars) contra ${url}...`);

// Usar el endpoint de PostgreSQL directamente via la API REST de Supabase
// El endpoint /rest/v1/rpc no puede ejecutar DDL, así que usamos la Management API
// o el endpoint interno de pg. Pero la forma más directa es usar supabase-js.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

// Supabase JS no tiene un método directo para ejecutar SQL arbitrario.
// Usaremos fetch directo al endpoint de SQL de la Management API.
// Alternativamente, podemos dividir y ejecutar via rpc si hay una función.

// La mejor opción: usar el endpoint /pg de Supabase (si está disponible)
// o ejecutar directamente contra la base de datos.

// Intentemos con la API de management de Supabase
const projectRef = url.replace('https://', '').replace('.supabase.co', '');

// Método 1: Intentar via la API interna de query
const queryUrl = `${url}/rest/v1/rpc/`;
console.log(`Project ref: ${projectRef}`);

// Método 2: Crear una función RPC temporal para ejecutar SQL
// Primero, intentemos ejecutar directamente
try {
  // Usar el endpoint de pg-meta que Supabase expone internamente
  const response = await fetch(`${url}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'apikey': key,
    },
    body: JSON.stringify({ query: sql }),
  });
  
  if (response.ok) {
    const result = await response.json();
    console.log('✅ Migración ejecutada con éxito');
    console.log('Resultado:', JSON.stringify(result).substring(0, 200));
    process.exit(0);
  }
  
  // Si /pg/query no funciona, intentar con el pg REST endpoint
  console.log(`Respuesta /pg/query: ${response.status} ${response.statusText}`);
  const text = await response.text();
  console.log('Body:', text.substring(0, 200));
} catch (e) {
  console.log('Error con /pg/query:', e.message);
}

// Método 3: Ejecutar via SQL con un wrapper RPC
// Crear primero la función exec_sql
try {
  // Primero crear una función helper
  const createFnSql = `
    create or replace function public._exec_sql(query text)
    returns void language plpgsql security definer as $$
    begin execute query; end $$;
  `;
  
  const { error: fnError } = await supabase.rpc('query', { sql_query: createFnSql });
  if (fnError) {
    console.log('No se pudo crear función helper vía rpc:', fnError.message);
  }
} catch (e) {
  console.log('Método RPC no disponible:', e.message);
}

console.log('\n⚠️  No se pudo ejecutar la migración automáticamente.');
console.log('Por favor, ejecuta el SQL manualmente en el SQL Editor de Supabase:');
console.log('1. Ve a https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
console.log('2. Pega el contenido de supabase/migrations/0001_init.sql');
console.log('3. Haz clic en "Run"');
