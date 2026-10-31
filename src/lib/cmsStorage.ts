import savDealImg from '../assets/images/ci_garantie_deal_1793449020315.jpg';
import savWorkshopImg from '../assets/images/ci_workshop_tech_1793449044800.jpg';
import savKeysImg from '../assets/images/ci_immat_handover_1793449069146.jpg';

export interface SAVEngagement {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  bullets: string[];
  image: string;
  locationLabel: string;
  sublabel: string;
}

export interface SAVPageConfig {
  headerKicker: string;
  headerTitle: string;
  headerHighlight: string;
  headerDescription: string;
  engagements: SAVEngagement[];
}

export interface PrivilegeBannerConfig {
  kicker: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
}

export interface AboutPageConfig {
  kicker: string;
  title: string;
  highlight: string;
  description: string;
  quote: string;
  subdescription: string;
  image: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface SiteCMSData {
  sav: SAVPageConfig;
  privilegeBanner: PrivilegeBannerConfig;
  about: AboutPageConfig;
}

const CMS_STORAGE_KEY = 'ipm_site_cms_data_v1';

export const DEFAULT_CMS_DATA: SiteCMSData = {
  sav: {
    headerKicker: 'Transparence & Sérénité',
    headerTitle: 'Service Après-Vente &',
    headerHighlight: 'Garantie',
    headerDescription: 'Chez IPM MOTORS, l’acquisition d’un véhicule 0 km s’accompagne d’un suivi rigoureux. Nous assurons la garantie constructeur, l\'entretien certifié et les démarches administratives à Abidjan.',
    engagements: [
      {
        id: 'eng-1',
        badge: 'Engagement 01',
        title: 'Garantie',
        highlight: 'Constructeur Officielle',
        description: 'Tous nos véhicules 0 km bénéficient de la protection constructeur intégrale. Nous assurons l’activation immédiate de votre carnet d’entretien officiel dès la livraison des clés à Cocody Abidjan.',
        bullets: [
          'Couverture officielle de 3 à 8 ans selon la marque (jusqu’à 160 000 km pour batteries)',
          'Prise en charge intégrale par les réseaux et concessionnaires agréés',
          'Carnet d’entretien officiel tamponné et remis le jour de la livraison',
          'Traçabilité certifiée 0 km sortie d’usine garantie par PV de conformité',
        ],
        image: savDealImg,
        locationLabel: 'Cocody Abidjan',
        sublabel: 'Garantie constructeur & remise du carnet d’origine',
      },
      {
        id: 'eng-2',
        badge: 'Engagement 02',
        title: 'Ateliers Certifiés &',
        highlight: 'Pièces 100% OEM',
        description: 'Pour prolonger la fiabilité et les performances de votre véhicule neuf, nous collaborons avec des centres techniques certifiés partenaires à Abidjan équipés des valises électroniques officielles.',
        bullets: [
          'Centres techniques certifiés partenaires à Abidjan (Cocody, Marcory, Zone 4)',
          'Valises électroniques de diagnostic multimarques de dernière génération',
          'Pièces détachées et filtres 100% d’origine constructeur (OEM)',
          'Techniciens formés aux normes tropicalisées et motorisations hybrides/électriques',
        ],
        image: savWorkshopImg,
        locationLabel: 'Diagnostic Expert & Pièces OEM',
        sublabel: 'Techniciens ivoiriens certifiés & valises de pointe',
      },
      {
        id: 'eng-3',
        badge: 'Engagement 03',
        title: 'Immatriculation &',
        highlight: 'Clés en Main',
        description: 'Toutes les formalités administratives ivoiriennes sont prises en charge avec rigueur et transparence pour que vous preniez le volant l’esprit serein.',
        bullets: [
          'Dédouanement complet et certifié auprès des douanes ivoiriennes',
          'Délivrance de la carte grise officielle à votre nom (Quipux / DGTTC)',
          'Fabrication et pose soignée des plaques d’immatriculation homologuées en Côte d’Ivoire',
          'Nettoyage esthétique et remise des clés en main à notre showroom Bonoumin',
        ],
        image: savKeysImg,
        locationLabel: 'Guichet Unique Automobile',
        sublabel: 'Carte grise ivoirienne, plaques homologuées & clés remises en main propre',
      },
    ],
  },
  privilegeBanner: {
    kicker: 'Accueil Privilège & Conseils Personnalisés',
    title: 'Une équipe dédiée à votre projet automobile',
    description: 'Prenez rendez-vous dès aujourd’hui pour une présentation exclusive ou un essai privé de nos modèles 0 km à Cocody Riviera Bonoumin.',
    buttonText: 'Prendre rendez-vous',
    image: '/public/assets/aistudio/Capture_d_e_cran_2026-10-29_a__18.34.08_75055a70.png',
    link: '/contact',
  },
  about: {
    kicker: 'Notre Histoire & Notre Vision',
    title: 'L’Excellence Automobile',
    highlight: 'à Abidjan',
    description: 'Bienvenue chez IPM MOTORS, votre partenaire de confiance pour l’achat de véhicules neufs 0 km en Côte d’Ivoire. Nous mettons notre expertise et notre passion au service de vos exigences.',
    quote: '« Avec IPM MOTORS, donnez une nouvelle dimension prestigieuse à vos déplacements. »',
    subdescription: 'Que vous recherchiez un SUV d’exception, une berline élégante ou un pick-up baroudeur, nous vous accompagnons à chaque étape.',
    image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
    stat1Value: '100%',
    stat1Label: 'Véhicules Neufs 0 KM',
    stat2Value: '3 à 8 ans',
    stat2Label: 'Garantie Constructeur',
    stat3Value: 'Cocody',
    stat3Label: 'Riviera Bonoumin',
  },
};

export function getCMSData(): SiteCMSData {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CMS_DATA));
      return DEFAULT_CMS_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      sav: { ...DEFAULT_CMS_DATA.sav, ...(parsed.sav || {}) },
      privilegeBanner: { ...DEFAULT_CMS_DATA.privilegeBanner, ...(parsed.privilegeBanner || {}) },
      about: { ...DEFAULT_CMS_DATA.about, ...(parsed.about || {}) },
    };
  } catch {
    return DEFAULT_CMS_DATA;
  }
}

export function saveCMSData(data: Partial<SiteCMSData>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCMSData();
    const updated: SiteCMSData = {
      ...current,
      ...data,
      sav: { ...current.sav, ...(data.sav || {}) },
      privilegeBanner: { ...current.privilegeBanner, ...(data.privilegeBanner || {}) },
      about: { ...current.about, ...(data.about || {}) },
    };
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ipm:cms-updated', { detail: updated }));
  } catch {
    // ignore
  }
}

export function subscribeToCMS(cb: (data: SiteCMSData) => void): () => void {
  const handler = (e: any) => {
    cb(e.detail || getCMSData());
  };
  window.addEventListener('ipm:cms-updated', handler);
  return () => window.removeEventListener('ipm:cms-updated', handler);
}
