import { NewsArticle } from '../types';
import { DEFAULT_NEWS_ARTICLES } from '../data/defaultNews';
import { supabase, isSupabaseConfigured } from './supabase';

const NEWS_STORAGE_KEY = 'ipm_custom_news_v1';
const NEWS_UPDATE_EVENT = 'ipm_news_updated';

/**
 * Retrieve news from localStorage, falling back to default seed articles
 */
export function getLocalStoredNews(): NewsArticle[] {
  try {
    const raw = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!raw) return DEFAULT_NEWS_ARTICLES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_NEWS_ARTICLES;
  } catch (err) {
    console.warn('Failed to parse cached news:', err);
    return DEFAULT_NEWS_ARTICLES;
  }
}

/**
 * Persist news articles array to localStorage and notify listeners
 */
export function saveLocalStoredNews(newsList: NewsArticle[]): void {
  try {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(newsList));
    window.dispatchEvent(new CustomEvent(NEWS_UPDATE_EVENT, { detail: newsList }));
  } catch (err) {
    console.error('Failed to save news to localStorage:', err);
  }
}

/**
 * Subscribe to news updates across components
 */
export function subscribeToNews(callback: (news: NewsArticle[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<NewsArticle[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getLocalStoredNews());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === NEWS_STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch {
        callback(getLocalStoredNews());
      }
    }
  };

  window.addEventListener(NEWS_UPDATE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(NEWS_UPDATE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Load all news: Supabase table 'articles' / 'news' if configured, otherwise local storage
 */
export async function loadAllNews(): Promise<NewsArticle[]> {
  const localNews = getLocalStoredNews();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        saveLocalStoredNews(data);
        return data;
      }
    } catch {
      // Fallback cleanly to local news
    }
  }

  return localNews;
}

/**
 * Save or update a news article
 */
export async function saveNewsRecord(articleData: Partial<NewsArticle>): Promise<{ success: boolean; article: NewsArticle; error?: string }> {
  const currentNews = getLocalStoredNews();
  let updatedArticle: NewsArticle;

  const targetId = articleData.id;
  const existingIndex = currentNews.findIndex((a) => a.id === targetId);

  if (existingIndex >= 0) {
    updatedArticle = {
      ...currentNews[existingIndex],
      ...articleData,
      title: articleData.title || currentNews[existingIndex].title,
      excerpt: articleData.excerpt || currentNews[existingIndex].excerpt,
      content: articleData.content || currentNews[existingIndex].content,
      cover_image: articleData.cover_image || currentNews[existingIndex].cover_image,
      category: articleData.category || currentNews[existingIndex].category,
      published_at: articleData.published_at || currentNews[existingIndex].published_at,
      is_published: articleData.is_published ?? true,
      is_featured: articleData.is_featured ?? false,
    };
    currentNews[existingIndex] = updatedArticle;
  } else {
    updatedArticle = {
      id: targetId || `news-${Date.now()}`,
      title: articleData.title || 'Nouvelle actualité IPM Motors',
      slug: (articleData.title || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      cover_image: articleData.cover_image || '/src/assets/images/hero_dealership_car_1793116464643.jpg',
      category: articleData.category || 'Nouveautés 0 km',
      brand_tag: articleData.brand_tag || 'IPM Motors',
      author: articleData.author || 'Équipe IPM Motors',
      published_at: articleData.published_at || new Date().toISOString().split('T')[0],
      read_time: articleData.read_time || '3 min',
      is_featured: articleData.is_featured ?? false,
      is_published: articleData.is_published ?? true,
    };
    currentNews.unshift(updatedArticle);
  }

  saveLocalStoredNews(currentNews);

  // Sync with Supabase if table exists
  if (isSupabaseConfigured() && supabase) {
    try {
      if (updatedArticle.id && !updatedArticle.id.startsWith('news-')) {
        await supabase.from('news').update(updatedArticle).eq('id', updatedArticle.id);
      } else {
        const { id, ...toInsert } = updatedArticle;
        await supabase.from('news').insert([toInsert]);
      }
    } catch {
      // Local copy saved successfully
    }
  }

  return { success: true, article: updatedArticle };
}

/**
 * Delete a news article
 */
export async function deleteNewsRecord(id: string): Promise<boolean> {
  const filtered = getLocalStoredNews().filter((a) => a.id !== id);
  saveLocalStoredNews(filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('news').delete().eq('id', id);
    } catch {
      // Local deletion completed
    }
  }

  return true;
}
