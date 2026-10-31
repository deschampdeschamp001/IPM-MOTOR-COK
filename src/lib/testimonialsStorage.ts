import clientManImg from '../assets/images/client_delivery_man_1793375416666.jpg';
import clientCoupleImg from '../assets/images/client_delivery_couple_1793375435524.jpg';
import clientKeysImg from '../assets/images/client_holding_keys_1793375456332.jpg';

export interface TestimonialItem {
  id: string;
  name: string;
  date: string;
  comment: string;
  image: string;
  avatarText?: string;
  rating?: number;
}

const STORAGE_KEY = 'ipm_testimonials_data_v1';

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Alain',
    date: 'il y a 6 jours',
    comment: 'Le service client a traité ma demande avec un véritable professionnalisme. Mon véhicule 0 km a été préparé et livré clé en main.',
    image: clientManImg,
    avatarText: 'A',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Monsieur Idrissa',
    date: 'il y a 6 jours',
    comment: 'Je tire mon chapeau à l’équipe qui vient de changer nos habitudes en matière de transactions automobiles pour le mieux !',
    image: clientCoupleImg,
    avatarText: 'MI',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Mme Blédou',
    date: 'il y a 6 jours',
    comment: 'L’entreprise a reçu de nombreux avis positifs. Je suis très satisfaite du travail accompli et du dynamisme de l’équipe.',
    image: clientKeysImg,
    avatarText: 'MB',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Koffi Emmanuel',
    date: 'il y a 2 semaines',
    comment: 'Garantie constructeur confirmée et démarches de carte grise effectuées sans délai. Service impeccable à Bonoumin.',
    image: clientManImg,
    avatarText: 'KE',
    rating: 5,
  },
];

export function getTestimonials(): TestimonialItem[] {
  if (typeof window === 'undefined') return DEFAULT_TESTIMONIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TESTIMONIALS;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export function saveTestimonials(items: TestimonialItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('ipm:testimonials-updated', { detail: items }));
  } catch {
    // ignore
  }
}

export function addOrUpdateTestimonial(item: TestimonialItem): void {
  const current = getTestimonials();
  const index = current.findIndex(t => t.id === item.id);
  let updated: TestimonialItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  saveTestimonials(updated);
}

export function deleteTestimonial(id: string): void {
  const current = getTestimonials();
  const updated = current.filter(t => t.id !== id);
  saveTestimonials(updated);
}

export function resetTestimonialsToDefault(): TestimonialItem[] {
  saveTestimonials(DEFAULT_TESTIMONIALS);
  return DEFAULT_TESTIMONIALS;
}

export function subscribeToTestimonials(cb: (items: TestimonialItem[]) => void): () => void {
  const handler = (e: any) => {
    cb(e.detail || getTestimonials());
  };
  window.addEventListener('ipm:testimonials-updated', handler);
  return () => window.removeEventListener('ipm:testimonials-updated', handler);
}
