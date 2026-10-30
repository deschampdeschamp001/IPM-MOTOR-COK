import { ExclusiveBannerConfig } from '../types';

export const DEFAULT_EXCLUSIVE_BANNER: ExclusiveBannerConfig = {
  title: 'Découvrez des offres exclusives !!',
  highlightText: 'exclusives',
  subtitle: 'Restez à jour avec les dernières nouvelles, mises à jour et exclusivités offres directement sur votre WhatsApp.',
  buttonText: 'REJOINDRE LA CHAÎNE',
  buttonUrl: 'https://whatsapp.com/channel/0029Va7zABCDEF',
  enabled: true,
};

const BANNER_STORAGE_KEY = 'ipm_exclusive_banner_config';
type BannerListener = (config: ExclusiveBannerConfig) => void;
const listeners: Set<BannerListener> = new Set();

export const getExclusiveBannerConfig = (): ExclusiveBannerConfig => {
  if (typeof window === 'undefined') return DEFAULT_EXCLUSIVE_BANNER;
  try {
    const raw = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!raw) return DEFAULT_EXCLUSIVE_BANNER;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_EXCLUSIVE_BANNER,
      ...parsed,
    };
  } catch (err) {
    console.error('Error reading exclusive banner config from localStorage:', err);
    return DEFAULT_EXCLUSIVE_BANNER;
  }
};

export const saveExclusiveBannerConfig = (config: ExclusiveBannerConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(config));
    listeners.forEach((fn) => {
      try {
        fn(config);
      } catch (e) {
        console.error('Error notifying banner listener:', e);
      }
    });
  } catch (err) {
    console.error('Error saving exclusive banner config to localStorage:', err);
  }
};

export const resetExclusiveBannerConfig = (): ExclusiveBannerConfig => {
  saveExclusiveBannerConfig(DEFAULT_EXCLUSIVE_BANNER);
  return DEFAULT_EXCLUSIVE_BANNER;
};

export const subscribeToExclusiveBanner = (listener: BannerListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
