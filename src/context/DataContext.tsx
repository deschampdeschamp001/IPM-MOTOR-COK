import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Vehicle, Brand, NewsArticle, NewsletterSubscriber, Lead, ExclusiveBannerConfig } from '../types';
import { FALLBACK_VEHICLES } from '../data/mockVehicles';
import { getVehiclesFromDB, isSupabaseConfigured, getBrandsFromDB, getLeadsFromDB } from '../lib/supabase';
import { getLocalStoredBrands, loadAllBrands, subscribeToBrands } from '../lib/brandsStorage';
import { getLocalStoredNews, loadAllNews, subscribeToNews } from '../lib/newsStorage';
import { getAllSubscribers, getLocalSubscribers } from '../lib/newsletterStorage';
import {
  getExclusiveBannerConfig,
  saveExclusiveBannerConfig,
  subscribeToExclusiveBanner,
} from '../lib/bannerStorage';

interface DataContextType {
  vehicles: Vehicle[];
  brands: Brand[];
  newsArticles: NewsArticle[];
  subscribers: NewsletterSubscriber[];
  leads: Lead[];
  exclusiveBanner: ExclusiveBannerConfig;
  updateExclusiveBanner: (config: ExclusiveBannerConfig) => void;
  isLoading: boolean;
  isUsingFallback: boolean;
  refreshVehicles: () => Promise<void>;
  refreshBrands: () => Promise<void>;
  refreshNews: () => Promise<void>;
  refreshSubscribers: () => Promise<void>;
  refreshLeads: () => Promise<void>;
  getVehicleById: (id: string) => Vehicle | undefined;
  getBrandBySlug: (slug: string) => Brand | undefined;
  getArticleBySlug: (slug: string) => NewsArticle | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const cached = localStorage.getItem('ipm_cached_vehicles');
    if (cached !== null) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [brands, setBrands] = useState<Brand[]>(() => getLocalStoredBrands());
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() => getLocalStoredNews());
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => getLocalSubscribers());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [exclusiveBanner, setExclusiveBanner] = useState<ExclusiveBannerConfig>(() => getExclusiveBannerConfig());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(!isSupabaseConfigured());

  const updateExclusiveBanner = useCallback((config: ExclusiveBannerConfig) => {
    saveExclusiveBannerConfig(config);
    setExclusiveBanner(config);
  }, []);

  const refreshVehicles = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await getVehiclesFromDB();
        if (!error && data !== null) {
          setVehicles(data);
          localStorage.setItem('ipm_cached_vehicles', JSON.stringify(data));
          setIsUsingFallback(false);
          return;
        }
      }
    } catch {
      // fallback
    }
    // Fallback: check local storage
    const saved = localStorage.getItem('ipm_cached_vehicles');
    if (saved !== null) {
      try {
        setVehicles(JSON.parse(saved));
      } catch {
        setVehicles([]);
      }
    } else {
      setVehicles([]);
    }
    setIsUsingFallback(true);
  }, []);

  const refreshBrands = useCallback(async () => {
    const fresh = await loadAllBrands();
    if (fresh && fresh.length > 0) {
      setBrands(fresh);
    }
  }, []);

  const refreshNews = useCallback(async () => {
    const fresh = await loadAllNews();
    if (fresh && fresh.length > 0) {
      setNewsArticles(fresh);
    }
  }, []);

  const refreshSubscribers = useCallback(async () => {
    const fresh = await getAllSubscribers();
    setSubscribers(fresh);
  }, []);

  const refreshLeads = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const { data } = await getLeadsFromDB();
      if (data) setLeads(data);
    } else {
      const saved = localStorage.getItem('ipm_leads');
      if (saved) {
        try {
          setLeads(JSON.parse(saved));
        } catch {
          // fallback
        }
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setIsLoading(true);
      await Promise.allSettled([
        refreshVehicles(),
        refreshBrands(),
        refreshNews(),
        refreshSubscribers(),
        refreshLeads()
      ]);
      if (mounted) setIsLoading(false);
    };
    init();

    const unsubBrands = subscribeToBrands((updated) => setBrands(updated));
    const unsubNews = subscribeToNews((updated) => setNewsArticles(updated));
    const unsubBanner = subscribeToExclusiveBanner((updated) => setExclusiveBanner(updated));

    const onVehiclesUpdated = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setVehicles(e.detail);
      } else {
        refreshVehicles();
      }
    };
    window.addEventListener('ipm_vehicles_updated', onVehiclesUpdated);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ipm_cached_vehicles') {
        try {
          if (e.newValue) setVehicles(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      mounted = false;
      unsubBrands();
      unsubNews();
      unsubBanner();
      window.removeEventListener('ipm_vehicles_updated', onVehiclesUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, [refreshVehicles, refreshBrands, refreshNews, refreshSubscribers, refreshLeads]);

  const getVehicleById = useCallback((id: string) => {
    return vehicles.find(v => v.id === id);
  }, [vehicles]);

  const getBrandBySlug = useCallback((slug: string) => {
    const normalized = slug.toLowerCase().trim();
    return brands.find(b => (b.slug || b.name.toLowerCase().replace(/\s+/g, '-')) === normalized);
  }, [brands]);

  const getArticleBySlug = useCallback((slug: string) => {
    const normalized = slug.toLowerCase().trim();
    return newsArticles.find(a => (a.slug || a.id) === normalized);
  }, [newsArticles]);

  return (
    <DataContext.Provider
      value={{
        vehicles,
        brands,
        newsArticles,
        subscribers,
        leads,
        exclusiveBanner,
        updateExclusiveBanner,
        isLoading,
        isUsingFallback,
        refreshVehicles,
        refreshBrands,
        refreshNews,
        refreshSubscribers,
        refreshLeads,
        getVehicleById,
        getBrandBySlug,
        getArticleBySlug
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
};
