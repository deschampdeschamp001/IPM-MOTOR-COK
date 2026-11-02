import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Vehicle, Lead, Brand } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid URL and key are provided
export const isSupabaseConfigured = (): boolean => {
  if (!rawUrl || !rawAnonKey) return false;
  if (rawUrl.includes('your-project') || rawAnonKey.includes('your-anon-key')) return false;
  try {
    const url = new URL(rawUrl);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
};

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  clientInstance = createClient(rawUrl, rawAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const supabase = clientInstance;

/**
 * Fetch all available vehicles from Supabase
 * Sorted by is_featured DESC, created_at DESC
 */
export async function getVehiclesFromDB(): Promise<{ data: Vehicle[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_available', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Vehicle[], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur de connexion') };
  }
}

/**
 * Admin: Fetch all vehicles including hidden ones
 */
export async function getAllVehiclesForAdmin(): Promise<{ data: Vehicle[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Vehicle[], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur') };
  }
}

/**
 * Helper to remove undefined keys and sanitize payloads before Supabase requests
 */
function sanitizeVehiclePayload(vehicleData: Partial<Vehicle>): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const [key, value] of Object.entries(vehicleData)) {
    if (value !== undefined) {
      payload[key] = value;
    }
  }
  return payload;
}

/**
 * Admin: Add or update vehicle with automatic schema cache recovery
 * Handles cases where columns like 'brand_slug' or 'is_exclusive' have not yet been
 * refreshed in Supabase PostgREST schema cache.
 */
export async function saveVehicleToDB(vehicleData: Partial<Vehicle>): Promise<{ data: Vehicle | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  let payload = sanitizeVehiclePayload(vehicleData);
  const isUpdate = Boolean(payload.id);
  const vehicleId = payload.id;

  // Max 3 retry attempts to strip columns missing from PostgREST schema cache
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (isUpdate) {
        const updateData = { ...payload };
        delete updateData.id; // Do not update the primary key

        const { data, error } = await supabase
          .from('vehicles')
          .update(updateData)
          .eq('id', vehicleId)
          .select()
          .single();

        if (error) throw error;
        return { data: data as Vehicle, error: null };
      } else {
        const { data, error } = await supabase
          .from('vehicles')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        return { data: data as Vehicle, error: null };
      }
    } catch (err: any) {
      const errorMsg = String(err?.message || '');
      // Match missing column from schema cache: "Could not find the 'xyz' column of 'vehicles' in the schema cache"
      const match = errorMsg.match(/Could not find the '([a-zA-Z0-9_]+)' column of 'vehicles' in the schema cache/i);
      if (match && match[1]) {
        const missingCol = match[1];
        console.warn(
          `[Supabase] Colonne '${missingCol}' absente du cache schéma de Supabase. Retrait automatique et nouvelle tentative. Exécutez supabase/migrations_additive_v2.sql pour l'ajouter de façon définitive.`
        );
        delete payload[missingCol];
        continue; // Retry without the missing column
      }

      // If it's another error or retries exhausted
      return { data: null, error: new Error(err.message || 'Erreur de sauvegarde') };
    }
  }

  return { data: null, error: new Error('Échec de la sauvegarde après plusieurs tentatives') };
}

/**
 * Admin: Delete vehicle
 */
export async function deleteVehicleFromDB(id: string): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase non configuré') };
  }

  try {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: new Error(err.message || 'Erreur de suppression') };
  }
}

/**
 * Admin: Delete all vehicles (clear catalogue completely)
 */
export async function deleteAllVehiclesFromDB(): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase non configuré') };
  }

  try {
    const { error } = await supabase.from('vehicles').delete().not('id', 'is', null);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: new Error(err.message || 'Erreur de suppression globale') };
  }
}

/**
 * Admin: Toggle visibility
 */
export async function toggleVehicleVisibility(id: string, is_available: boolean): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase non configuré') };
  }

  try {
    const { error } = await supabase.from('vehicles').update({ is_available }).eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: new Error(err.message) };
  }
}

/**
 * Public: Save a contact request / lead
 */
export async function recordLeadInDB(leadData: Omit<Lead, 'id' | 'created_at'>): Promise<{ data: Lead | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;
    return { data: data as Lead, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur d’enregistrement') };
  }
}

/**
 * Admin: Fetch all leads
 */
export async function getLeadsFromDB(): Promise<{ data: Lead[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Lead[], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur') };
  }
}

/**
 * Public: Fetch active brands sorted by sort_order
 */
export async function getBrandsFromDB(): Promise<{ data: Brand[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Brand[], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur de connexion') };
  }
}

/**
 * Admin: Fetch all brands (including inactive)
 */
export async function getAllBrandsForAdmin(): Promise<{ data: Brand[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { data: data as Brand[], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur') };
  }
}

/**
 * Admin: Save or update brand
 */
export async function saveBrandToDB(brandData: Partial<Brand>): Promise<{ data: Brand | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase non configuré') };
  }

  try {
    const brandName = brandData.name?.trim();

    // 1. If valid UUID id or existing record
    if (brandData.id && !brandData.id.startsWith('brand-')) {
      const { data, error } = await supabase
        .from('brands')
        .update({
          name: brandName,
          logo_url: brandData.logo_url,
          sort_order: brandData.sort_order,
          is_active: brandData.is_active,
        })
        .eq('id', brandData.id)
        .select()
        .single();

      if (!error && data) {
        return { data: data as Brand, error: null };
      }
    }

    // 2. Check if a brand with the same name already exists in Supabase
    if (brandName) {
      const { data: existingBrand } = await supabase
        .from('brands')
        .select('id')
        .ilike('name', brandName)
        .maybeSingle();

      if (existingBrand?.id) {
        const { data: updated, error: updateError } = await supabase
          .from('brands')
          .update({
            name: brandName,
            logo_url: brandData.logo_url,
            sort_order: brandData.sort_order,
            is_active: brandData.is_active,
          })
          .eq('id', existingBrand.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return { data: updated as Brand, error: null };
      }
    }

    // 3. Brand does not exist yet: insert new
    const payload: any = {
      name: brandName || 'Marque',
      logo_url: brandData.logo_url || '',
      sort_order: brandData.sort_order || 1,
      is_active: brandData.is_active ?? true,
    };

    const { data, error } = await supabase
      .from('brands')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as Brand, error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message || 'Erreur de sauvegarde') };
  }
}

/**
 * Admin: Delete brand
 */
export async function deleteBrandFromDB(id: string): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase non configuré') };
  }

  try {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: new Error(err.message || 'Erreur de suppression') };
  }
}

/**
 * Admin: Upload image to vehicle-images bucket
 */
export async function uploadVehicleImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase non configuré') };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `catalog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: new Error(err.message || 'Erreur de téléversement') };
  }
}

/**
 * Admin: Upload brand logo to brand-logos bucket
 */
export async function uploadBrandLogo(file: File): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase non configuré') };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('brand-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('brand-logos')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: new Error(err.message || 'Erreur de téléversement du logo') };
  }
}
