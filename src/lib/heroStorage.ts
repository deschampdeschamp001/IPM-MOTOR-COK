export interface HeroSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  link: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
    badge: 'Parc Automobile Riviera Bonoumin • 0 KM',
    title: 'L’Excellence Automobile',
    highlight: 'à votre portée.',
    subtitle: 'Découvrez notre parc exclusif de véhicules neufs 0 km toutes marques, prêts pour livraison immédiate à Abidjan.',
    link: '/modeles'
  },
  {
    id: 'slide-2',
    image: '/assets/cars/car_mercedes_sedan_1793116467102.jpg',
    badge: 'Prestige Allemand • Classe S & AMG',
    title: 'Le Sommet du Raffinement',
    highlight: 'souverain.',
    subtitle: 'Berlines de maître et limousines d’exception. Finitions grand luxe et technologies d’avant-garde.',
    link: '/modeles?marque=Mercedes-Benz'
  },
  {
    id: 'slide-3',
    image: '/assets/cars/car_byd_seal_1793116465632.jpg',
    badge: '100% Électrique • Blade Battery',
    title: 'La Révolution Électrique',
    highlight: 'BYD Seal 530 ch.',
    subtitle: 'Autonomie WLTP 520 km, accélération 0-100 en 3.8s et borne de recharge offerte pour chaque commande.',
    link: '/modeles?type=Électrique'
  },
  {
    id: 'slide-4',
    image: '/assets/cars/car_toyota_4x4_1793116466608.jpg',
    badge: 'Maître Tout-Terrain • 4x4 V6 Twin-Turbo',
    title: 'Toyota Land Cruiser',
    highlight: 'LC300 VXR.',
    subtitle: 'Le roi incontesté des pistes et du prestige en Afrique de l’Ouest. 415 chevaux de puissance pure.',
    link: '/modeles?marque=Toyota'
  },
  {
    id: 'slide-5',
    image: '/assets/cars/car_jetour_suv_1793116466140.jpg',
    badge: 'Design Futuriste • SUV Nouvelle Vague',
    title: 'Jetour Dashing',
    highlight: 'Audace & Confort.',
    subtitle: 'Cockpit 540°, purificateur d’air CN95 et motorisation 1.6 Turbo nerveuse et efficiente.',
    link: '/modeles?marque=Jetour'
  },
  {
    id: 'slide-6',
    image: '/assets/cars/hero_dealership_car_1793116464643.jpg',
    badge: 'Service Clé en Main • Sur-Mesure',
    title: 'Votre Véhicule Neuf',
    highlight: 'sans compromis.',
    subtitle: 'Immatriculation express, carte grise, garantie constructeur intégrale et livraison VIP à domicile.',
    link: '/apres-vente'
  }
];

const STORAGE_KEY = 'ipm_hero_slides_config';
const EVENT_KEY = 'ipm_hero_slides_updated';

export const getHeroSlides = (): HeroSlide[] => {
  if (typeof window === 'undefined') return DEFAULT_HERO_SLIDES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_SLIDES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Erreur lecture hero slides:', err);
  }
  return DEFAULT_HERO_SLIDES;
};

export const saveHeroSlides = (slides: HeroSlide[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: slides }));
  } catch (err) {
    console.error('Erreur sauvegarde hero slides:', err);
  }
};

export const resetHeroSlides = (): HeroSlide[] => {
  saveHeroSlides(DEFAULT_HERO_SLIDES);
  return DEFAULT_HERO_SLIDES;
};

export const subscribeToHeroSlides = (callback: (slides: HeroSlide[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<HeroSlide[]>;
    callback(customEvent.detail || getHeroSlides());
  };
  window.addEventListener(EVENT_KEY, handler);
  return () => {
    window.removeEventListener(EVENT_KEY, handler);
  };
};
