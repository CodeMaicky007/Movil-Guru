import { type ChatCompletionTool } from 'groq-sdk/resources/chat/completions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { triggerAutomationInline } from '@/server/automation';

export const TOOL_DEFINITIONS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'buscar_servicios',
      description: 'Busca servicios de reparación disponibles. Úsala cuando el usuario pregunte por precios, tipos de reparación o qué servicios hay disponibles.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Término de búsqueda, por ejemplo "pantalla iPhone" o "batería Samsung"',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'consultar_disponibilidad',
      description: 'Consulta los huecos disponibles para reservar una cita. Úsala cuando el usuario quiera pedir cita o saber cuándo puede venir.',
      parameters: {
        type: 'object',
        properties: {
          fecha: {
            type: 'string',
            description: 'Fecha en formato YYYY-MM-DD, por ejemplo "2026-05-10"',
          },
        },
        required: ['fecha'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crear_reserva',
      description: 'Crea una nueva reserva para el usuario. Solo disponible si el usuario está logueado. Requiere nombre del cliente, dispositivo y fecha/hora.',
      parameters: {
        type: 'object',
        properties: {
          customer_name: { type: 'string', description: 'Nombre completo del cliente' },
          phone: { type: 'string', description: 'Teléfono de contacto' },
          device: { type: 'string', description: 'Dispositivo a reparar, ej: "iPhone 15 Pro"' },
          service_id: { type: 'string', description: 'ID del servicio de la tool buscar_servicios' },
          scheduled_for: { type: 'string', description: 'Fecha y hora en formato ISO, ej: "2026-05-10T10:00:00"' },
          notes: { type: 'string', description: 'Notas adicionales opcionales' },
        },
        required: ['customer_name', 'device'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'buscar_productos',
      description: 'Busca productos en la tienda online de movil.guru (fundas, cargadores, cristales, etc.).',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Término de búsqueda, por ejemplo "funda iPhone 15" o "cargador rápido"',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'ver_mis_reservas',
      description: 'Muestra las reservas del usuario logueado. Solo disponible si el usuario está logueado.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navegar_a',
      description: 'Devuelve una URL interna del sitio para que el usuario pueda navegar a ella. Úsala cuando el usuario quiera ir a una sección específica.',
      parameters: {
        type: 'object',
        properties: {
          ruta: {
            type: 'string',
            description: 'Ruta interna, por ejemplo "/tienda", "/tiendas", "/contacto", "/faq", "/guia", "/marcas", "/reparacion"',
          },
          label: {
            type: 'string',
            description: 'Texto descriptivo del enlace para mostrar al usuario',
          },
        },
        required: ['ruta', 'label'],
      },
    },
  },
];

export type ToolInput = Record<string, unknown>;

export async function executeTool(
  name: string,
  input: ToolInput,
  userId: string | null,
): Promise<string> {
  // navegar_a never needs Supabase
  if (name === 'navegar_a') {
    return JSON.stringify({ ruta: input.ruta, label: input.label });
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return 'Servicio de datos temporalmente no disponible.';
  }

  switch (name) {
    case 'buscar_servicios': {
      const query = typeof input.query === 'string' ? input.query : '';
      if (!query) return 'Indica un término de búsqueda.';
      const { data, error } = await supabase
        .from('services')
        .select('id, nombre, descripcion, precio_base, duracion_min')
        .ilike('nombre', `%${query}%`)
        .eq('activo', true)
        .limit(5);
      if (error) return `Error buscando servicios: ${error.message}`;
      if (!data || data.length === 0) return 'No encontré servicios que coincidan con esa búsqueda.';
      return JSON.stringify(data);
    }

    case 'consultar_disponibilidad': {
      const fecha = typeof input.fecha === 'string' ? input.fecha : '';
      if (!fecha) return 'Indica una fecha para consultar disponibilidad.';
      const inicio = `${fecha}T00:00:00`;
      const fin = `${fecha}T23:59:59`;
      const { data, error } = await supabase
        .from('reservations')
        .select('scheduled_for')
        .gte('scheduled_for', inicio)
        .lte('scheduled_for', fin)
        .in('status', ['recibido', 'diagnostico', 'reparando', 'control']);
      if (error) return `Error consultando disponibilidad: ${error.message}`;
      const ocupadas = (data ?? []).map((r) => r.scheduled_for);
      const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];
      const libres = horas.filter((h) => !ocupadas.some((o) => o?.includes(h)));
      if (libres.length === 0) return `El ${fecha} está completo. Prueba con otro día.`;
      return `Horas disponibles el ${fecha}: ${libres.join(', ')}`;
    }

    case 'crear_reserva': {
      if (!userId) return JSON.stringify({ error: 'requiere_login', mensaje: 'Necesitas iniciar sesión para crear una reserva.' });
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          customer_name: input.customer_name,
          phone: input.phone ?? null,
          email: userData?.user?.email ?? null,
          device: input.device,
          service_id: input.service_id ?? null,
          scheduled_for: input.scheduled_for ?? null,
          notes: input.notes ?? null,
          status: 'recibido',
          price: 0,
        })
        .select('id, code, scheduled_for, status')
        .single();
      if (error) return `Error creando la reserva: ${error.message}`;

      // Dispara la confirmación al cliente sin esperar al cron diario.
      await triggerAutomationInline();

      return JSON.stringify({ ok: true, reserva: data });
    }

    case 'buscar_productos': {
      const query = typeof input.query === 'string' ? input.query : '';
      if (!query) return 'Indica un término de búsqueda.';
      const { data, error } = await supabase
        .from('products')
        .select('id, nombre, descripcion, precio, categoria, imagen_url')
        .ilike('nombre', `%${query}%`)
        .limit(5);
      if (error) return `Error buscando productos: ${error.message}`;
      if (!data || data.length === 0) return 'No encontré productos que coincidan con esa búsqueda.';
      return JSON.stringify(data);
    }

    case 'ver_mis_reservas': {
      if (!userId) return JSON.stringify({ error: 'requiere_login', mensaje: 'Necesitas iniciar sesión para ver tus reservas.' });
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;
      if (!userEmail) return 'No se pudo obtener tu información de usuario.';
      const { data, error } = await supabase
        .from('reservations')
        .select('id, code, device, scheduled_for, status, services(nombre)')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) return `Error consultando reservas: ${error.message}`;
      if (!data || data.length === 0) return 'No tienes reservas registradas.';
      return JSON.stringify(data);
    }

    default:
      return `Tool desconocida: ${name}`;
  }
}
