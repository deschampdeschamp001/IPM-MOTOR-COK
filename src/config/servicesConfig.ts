/**
 * Configuration & gestion dynamique des sections Service Après-Vente & Garanties
 * Permet l'édition complète des textes, puces et images depuis l'espace admin.
 */

export interface ServiceSectionItem {
  id: string;
  badge: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  points: string[];
  image: string;
  locationBadge?: string;
  caption?: string;
  accentColor?: string;
  bgTheme?: 'white' | 'slate' | 'zinc';
}

export const DEFAULT_SERVICES_SECTIONS: ServiceSectionItem[] = [
  {
    id: 'garantie',
    badge: 'Engagement 01',
    title: 'Garantie Constructeur Officielle',
    titleHighlight: 'Constructeur Officielle',
    subtitle:
      'Tous nos véhicules 0 km bénéficient de la protection constructeur intégrale. Nous assurons l’activation immédiate de votre carnet d’entretien officiel dès la livraison des clés à Cocody Abidjan.',
    points: [
      'Couverture officielle de 3 à 8 ans selon la marque (jusqu’à 160 000 km pour batteries)',
      'Prise en charge intégrale par les réseaux et concessionnaires agréés',
      'Carnet d’entretien officiel tamponné et remis le jour de la livraison',
      'Traçabilité certifiée 0 km sortie d’usine garantie par PV de conformité',
    ],
    image: '/src/assets/images/ci_garantie_deal_1793449020315.jpg',
    locationBadge: 'Cocody Abidjan',
    caption: 'Garantie constructeur & remise du carnet d’origine',
    accentColor: '#e10600',
    bgTheme: 'white',
  },
  {
    id: 'ateliers',
    badge: 'Engagement 02',
    title: 'Ateliers Certifiés & Pièces 100% OEM',
    titleHighlight: 'Pièces 100% OEM',
    subtitle:
      'Pour prolonger la fiabilité et les performances de votre véhicule neuf, nous collaborons avec des centres techniques certifiés partenaires à Abidjan équipés des valises électroniques officielles.',
    points: [
      'Centres techniques certifiés partenaires à Abidjan (Cocody, Marcory, Zone 4)',
      'Valises électroniques de diagnostic multimarques de dernière génération',
      'Pièces détachées et filtres 100% d’origine constructeur (OEM)',
      'Techniciens formés aux normes tropicalisées et motorisations hybrides/électriques',
    ],
    image: '/src/assets/images/ci_workshop_tech_1793449044800.jpg',
    locationBadge: 'Diagnostic Expert & Pièces OEM',
    caption: 'Techniciens ivoiriens certifiés & valises de pointe',
    accentColor: '#1a44b8',
    bgTheme: 'slate',
  },
  {
    id: 'immatriculation',
    badge: 'Engagement 03',
    title: 'Immatriculation & Clés en Main',
    titleHighlight: 'Clés en Main',
    subtitle:
      'Toutes les formalités administratives ivoiriennes sont prises en charge avec rigueur et transparence pour que vous preniez le volant l’esprit serein.',
    points: [
      'Dédouanement complet et certifié auprès des douanes ivoiriennes',
      'Délivrance de la carte grise officielle à votre nom (Quipux / DGTTC)',
      'Fabrication et pose soignée des plaques d’immatriculation homologuées en Côte d’Ivoire',
      'Nettoyage esthétique et remise des clés en main à notre showroom Bonoumin',
    ],
    image: '/public/assets/aistudio/E_change_de_cle_s_et_plaque_ivoirienne_e24c6ee3.png',
    locationBadge: 'Guichet Unique Automobile',
    caption: 'Carte grise ivoirienne, plaques homologuées & clés remises en main propre',
    accentColor: '#059669',
    bgTheme: 'white',
  },
];

const STORAGE_KEY = 'ipm_services_sections_v2';
const EVENT_KEY = 'ipm_services_sections_updated';

export const getServicesSections = (): ServiceSectionItem[] => {
  if (typeof window === 'undefined') return DEFAULT_SERVICES_SECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SERVICES_SECTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Erreur lecture services sections:', err);
  }
  return DEFAULT_SERVICES_SECTIONS;
};

export const saveServicesSections = (sections: ServiceSectionItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: sections }));
  } catch (err) {
    console.error('Erreur sauvegarde services sections:', err);
  }
};

export const resetServicesSections = (): ServiceSectionItem[] => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: DEFAULT_SERVICES_SECTIONS }));
  }
  return DEFAULT_SERVICES_SECTIONS;
};

export const subscribeToServicesSections = (
  callback: (sections: ServiceSectionItem[]) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: any) => {
    callback(e.detail || getServicesSections());
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getServicesSections());
    }
  };

  window.addEventListener(EVENT_KEY, handleUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(EVENT_KEY, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
};
