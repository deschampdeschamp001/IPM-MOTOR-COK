import { NewsletterSubscriber } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'ipm_newsletter_subscribers';

export const getLocalSubscribers = (): NewsletterSubscriber[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: NewsletterSubscriber[] = [
        { id: 'sub-1', email: 'directeur@groupe-ivoire.ci', source: 'Site web', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'sub-2', email: 'amadou.k@holding.ci', source: 'Site web', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'sub-3', email: 'f.kouassi@finance.ci', source: 'Site web', created_at: new Date(Date.now() - 86400000).toISOString() },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { success: false, message: 'Adresse e-mail invalide.' };
  }

  // 1. Try Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: trimmed, source: 'Site web' }]);

      if (error) {
        if (error.code === '23505') {
          return { success: true, message: 'Vous êtes déjà inscrit à nos actualités exclusives.' };
        }
        // Fallback to local storage if table doesn't exist
      } else {
        return { success: true, message: 'Inscription confirmée. Merci pour votre confiance !' };
      }
    } catch {
      // Continue to local storage fallback
    }
  }

  // 2. Local storage fallback
  const current = getLocalSubscribers();
  const exists = current.some(s => s.email.toLowerCase() === trimmed);
  if (exists) {
    return { success: true, message: 'Vous êtes déjà inscrit à nos actualités exclusives.' };
  }

  const newSub: NewsletterSubscriber = {
    id: `sub-${Date.now()}`,
    email: trimmed,
    source: 'Site web',
    created_at: new Date().toISOString()
  };

  const updated = [newSub, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { success: true, message: 'Inscription confirmée. Merci pour votre confiance !' };
}

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as NewsletterSubscriber[];
      }
    } catch {
      // fallback
    }
  }

  return getLocalSubscribers();
}
