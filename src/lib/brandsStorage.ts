import { Brand } from '../types';
import { DEFAULT_BRANDS, DEFAULT_BRAND_LOGOS } from '../data/defaultBrands';
import {
  isSupabaseConfigured,
  getBrandsFromDB,
  saveBrandToDB as supabaseSaveBrand,
  deleteBrandFromDB as supabaseDeleteBrand,
} from './supabase';

const BRANDS_STORAGE_KEY = 'ipm_custom_brands_v1';
const BRANDS_UPDATE_EVENT = 'ipm_brands_updated';

/**
 * Read cached brands from localStorage, falling back to DEFAULT_BRANDS
 */
export function getLocalStoredBrands(): Brand[] {
  try {
    const raw = localStorage.getItem(BRANDS_STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure any newly added default brands are present if missing
      const existingNames = new Set(parsed.map((b: Brand) => b.name.toLowerCase()));
      const merged = [...parsed];
      DEFAULT_BRANDS.forEach((def) => {
        if (!existingNames.has(def.name.toLowerCase())) {
          merged.push(def);
        }
      });
      return merged.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }
    return DEFAULT_BRANDS;
  } catch (err) {
    console.warn('Failed to parse stored brands:', err);
    return DEFAULT_BRANDS;
  }
}

/**
 * Save brands array to localStorage and notify all listeners
 */
export function saveLocalStoredBrands(brands: Brand[]): void {
  try {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
    // Dispatch event for any mounted components
    window.dispatchEvent(new CustomEvent(BRANDS_UPDATE_EVENT, { detail: brands }));
  } catch (err) {
    console.error('Failed to save brands to localStorage:', err);
  }
}

/**
 * Subscribe to brand updates (cross-component and cross-tab)
 */
export function subscribeToBrands(callback: (brands: Brand[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<Brand[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getLocalStoredBrands());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === BRANDS_STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch {
        callback(getLocalStoredBrands());
      }
    }
  };

  window.addEventListener(BRANDS_UPDATE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(BRANDS_UPDATE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Load brands: checks Supabase if configured, falls back to local storage
 */
export async function loadAllBrands(): Promise<Brand[]> {
  const localBrands = getLocalStoredBrands();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getBrandsFromDB();
      if (!error && data && data.length > 0) {
        // Merge Supabase brands with local to preserve order
        saveLocalStoredBrands(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase brands fetch failed, using local cache:', err);
    }
  }

  return localBrands;
}

/**
 * Save or update a brand in both localStorage and Supabase (if connected)
 */
export async function saveBrandRecord(brandData: Partial<Brand>): Promise<{ success: boolean; brand: Brand; error?: string }> {
  const currentBrands = getLocalStoredBrands();
  let updatedBrand: Brand;

  const targetId = brandData.id;
  const targetName = brandData.name?.trim() || '';

  const existingIndex = currentBrands.findIndex(
    (b) => (targetId && b.id === targetId) || (targetName && b.name.toLowerCase() === targetName.toLowerCase())
  );

  if (existingIndex >= 0) {
    // Update existing
    updatedBrand = {
      ...currentBrands[existingIndex],
      ...brandData,
      name: targetName || currentBrands[existingIndex].name,
      sort_order: brandData.sort_order ?? currentBrands[existingIndex].sort_order,
      is_active: brandData.is_active ?? currentBrands[existingIndex].is_active ?? true,
      logo_url: brandData.logo_url ?? currentBrands[existingIndex].logo_url,
    };
    currentBrands[existingIndex] = updatedBrand;
  } else {
    // Add new
    updatedBrand = {
      id: targetId || `brand-${Date.now()}`,
      name: targetName,
      logo_url: brandData.logo_url || DEFAULT_BRAND_LOGOS[targetName] || '',
      sort_order: brandData.sort_order ?? currentBrands.length + 1,
      is_active: brandData.is_active ?? true,
    };
    currentBrands.push(updatedBrand);
  }

  // Sort and persist locally first
  currentBrands.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  saveLocalStoredBrands(currentBrands);

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseSaveBrand(updatedBrand);
      if (error) {
        console.warn('Supabase sync warning for brand:', error.message);
        return { success: true, brand: updatedBrand, error: error.message };
      }
      if (data) {
        // If Supabase returned an updated record with server ID
        const finalBrands = currentBrands.map((b) => (b.id === updatedBrand.id ? { ...b, ...data } : b));
        saveLocalStoredBrands(finalBrands);
        return { success: true, brand: data };
      }
    } catch (err: any) {
      console.warn('Supabase save error:', err);
    }
  }

  return { success: true, brand: updatedBrand };
}

/**
 * Delete a brand by ID
 */
export async function deleteBrandRecord(id: string): Promise<boolean> {
  const currentBrands = getLocalStoredBrands().filter((b) => b.id !== id);
  saveLocalStoredBrands(currentBrands);

  if (isSupabaseConfigured()) {
    try {
      await supabaseDeleteBrand(id);
    } catch (err) {
      console.warn('Failed to delete brand from Supabase:', err);
    }
  }

  return true;
}

/**
 * Reset a brand to its default logo
 */
export function resetBrandToDefault(brandName: string): string | null {
  return DEFAULT_BRAND_LOGOS[brandName] || null;
}
