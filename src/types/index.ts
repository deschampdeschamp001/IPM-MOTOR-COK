export type VehicleType = 'SUV' | 'Berline' | 'Pick-up' | 'Utilitaire' | '4x4' | 'Électrique' | 'Citadine' | 'Coupé' | string;

export interface Vehicle {
  id: string;
  brand: string;
  brand_slug?: string;
  model: string;
  year: number;
  type: VehicleType;
  fuel: string;
  transmission: string;
  engine?: string;
  seats?: number;
  price?: number | null;
  price_label?: string | null;
  price_display_mode?: 'auto' | 'numeric' | 'label' | 'both' | 'on_demand';
  promo_price?: number | null;
  description?: string;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  is_offer?: boolean;
  is_exclusive?: boolean;
  offer_badge?: string;
  offer_highlights?: string[];
  created_at?: string;
}

export interface ExclusiveBannerConfig {
  title: string;
  highlightText?: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  enabled: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string | null;
  sort_order: number;
  is_active: boolean;
  country?: string;
  description?: string;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  vehicle_id?: string | null;
  message: string;
  created_at?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  brand_tag?: string;
  author?: string;
  published_at: string;
  read_time?: string;
  is_featured?: boolean;
  is_published: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source?: string;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'garantie' | 'entretien' | 'demarches';
}

export interface DealershipConfig {
  name: string;
  fullName: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  neighborhood: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
}
