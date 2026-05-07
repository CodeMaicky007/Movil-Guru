import type { SupabaseClient } from '@supabase/supabase-js';

// Cache pequeño en memoria por invocación de cron. Cargar tienda y técnico
// para enriquecer notificaciones sin pegarle a la BD por cada evento.

export class StoreContext {
  private storeCache = new Map<string, string | null>();
  private techCache  = new Map<string, string | null>();

  constructor(private readonly db: SupabaseClient) {}

  async storeName(storeId: string | null): Promise<string | null> {
    if (!storeId) return null;
    if (this.storeCache.has(storeId)) return this.storeCache.get(storeId) ?? null;
    const { data } = await this.db.from('tiendas').select('nombre').eq('id', storeId).maybeSingle();
    const name = (data as { nombre?: string } | null)?.nombre ?? null;
    this.storeCache.set(storeId, name);
    return name;
  }

  async technicianName(techId: string | null): Promise<string | null> {
    if (!techId) return null;
    if (this.techCache.has(techId)) return this.techCache.get(techId) ?? null;
    const { data } = await this.db.from('profiles').select('full_name').eq('id', techId).maybeSingle();
    const name = (data as { full_name?: string } | null)?.full_name ?? null;
    this.techCache.set(techId, name);
    return name;
  }
}
