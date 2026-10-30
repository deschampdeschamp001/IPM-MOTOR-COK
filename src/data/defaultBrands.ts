import { Brand } from '../types';

/**
 * Clean SVG vector logos for the 13 supported brands
 * Encoded as optimized SVG Data URIs for instant, reliable rendering with zero broken images.
 */
export const DEFAULT_BRAND_LOGOS: Record<string, string> = {
  BYD: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" fill="none"><rect width="160" height="60" rx="10" fill="transparent"/><ellipse cx="80" cy="30" rx="74" ry="26" stroke="%23111111" stroke-width="4"/><text x="80" y="38" font-family="Arial,sans-serif" font-weight="900" font-size="28" letter-spacing="4" fill="%23E10600" text-anchor="middle">BYD</text></svg>`,

  Nissan: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70" fill="none"><circle cx="80" cy="35" r="30" stroke="%23111111" stroke-width="4"/><rect x="20" y="24" width="120" height="22" rx="3" fill="%23111111"/><text x="80" y="40" font-family="Arial,sans-serif" font-weight="800" font-size="14" letter-spacing="3" fill="%23FFFFFF" text-anchor="middle">NISSAN</text></svg>`,

  BMW: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36" fill="%23111111" stroke="%23999999" stroke-width="2"/><circle cx="40" cy="40" r="26" fill="%23FFFFFF"/><path d="M40 14 A26 26 0 0 1 66 40 L40 40 Z" fill="%230066B1"/><path d="M40 40 L14 40 A26 26 0 0 1 40 14 Z" fill="%23FFFFFF"/><path d="M40 40 L40 66 A26 26 0 0 1 14 40 Z" fill="%230066B1"/><path d="M40 40 L66 40 A26 26 0 0 1 40 66 Z" fill="%23FFFFFF"/><circle cx="40" cy="40" r="26" fill="none" stroke="%23111111" stroke-width="2"/><text x="40" y="11" font-family="Arial,sans-serif" font-weight="900" font-size="8" fill="%23FFFFFF" text-anchor="middle">B M W</text></svg>`,

  Kia: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 60"><text x="70" y="42" font-family="Arial,sans-serif" font-weight="900" font-size="38" letter-spacing="2" fill="%23111111" text-anchor="middle">KIA</text></svg>`,

  Jetour: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><path d="M15 15 L35 15 L25 35 L45 35" stroke="%23E10600" stroke-width="3" fill="none"/><text x="90" y="34" font-family="Arial,sans-serif" font-weight="900" font-size="20" letter-spacing="4" fill="%23111111" text-anchor="middle">JETOUR</text></svg>`,

  Toyota: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><ellipse cx="60" cy="40" rx="55" ry="36" fill="none" stroke="%23E10600" stroke-width="6"/><ellipse cx="60" cy="38" rx="20" ry="24" fill="none" stroke="%23E10600" stroke-width="6"/><ellipse cx="60" cy="24" rx="34" ry="12" fill="none" stroke="%23E10600" stroke-width="6"/></svg>`,

  Mitsubishi: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><polygon points="50,5 65,32 50,60 35,32" fill="%23E10600"/><polygon points="50,60 78,60 92,85 64,85" fill="%23E10600"/><polygon points="50,60 22,60 8,85 36,85" fill="%23E10600"/></svg>`,

  Suzuki: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><path d="M20 15 L70 15 L30 50 L75 50 L65 75 L15 75 L55 40 L10 40 Z" fill="%23E10600"/></svg>`,

  'Mercedes-Benz': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><circle cx="45" cy="45" r="40" fill="none" stroke="%23111111" stroke-width="4"/><line x1="45" y1="5" x2="45" y2="45" stroke="%23111111" stroke-width="4"/><line x1="45" y1="45" x2="10" y2="65" stroke="%23111111" stroke-width="4"/><line x1="45" y1="45" x2="80" y2="65" stroke="%23111111" stroke-width="4"/></svg>`,

  Changan: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60"><circle cx="40" cy="30" r="22" stroke="%23005BBB" stroke-width="4" fill="none"/><path d="M30 25 L40 37 L50 25" stroke="%23005BBB" stroke-width="4" fill="none" stroke-linecap="round"/><text x="105" y="37" font-family="Arial,sans-serif" font-weight="900" font-size="16" letter-spacing="2" fill="%23111111" text-anchor="middle">CHANGAN</text></svg>`,

  Geely: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60"><rect x="15" y="12" width="40" height="36" rx="4" fill="%23004F9E"/><path d="M15 24 L55 24 M15 36 L55 36 M35 12 L35 48" stroke="%23FFFFFF" stroke-width="2"/><text x="105" y="37" font-family="Arial,sans-serif" font-weight="900" font-size="18" letter-spacing="3" fill="%23111111" text-anchor="middle">GEELY</text></svg>`,

  Haval: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 50"><text x="75" y="36" font-family="Impact,Arial,sans-serif" font-weight="900" font-size="28" letter-spacing="4" fill="%23E10600" text-anchor="middle">HAVAL</text></svg>`,

  'Land Rover': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80"><ellipse cx="80" cy="40" rx="76" ry="36" fill="%23005A2B" stroke="%23D4AF37" stroke-width="3"/><text x="80" y="34" font-family="Arial,sans-serif" font-weight="900" font-size="14" letter-spacing="2" fill="%23FFFFFF" text-anchor="middle">LAND</text><text x="80" y="52" font-family="Arial,sans-serif" font-weight="900" font-size="14" letter-spacing="2" fill="%23FFFFFF" text-anchor="middle">ROVER</text></svg>`,
};

export const DEFAULT_BRANDS: Brand[] = [
  { id: 'brand-byd', name: 'BYD', slug: 'byd', logo_url: DEFAULT_BRAND_LOGOS.BYD, sort_order: 1, is_active: true, country: 'Chine', description: 'Leader mondial de la mobilité électrique et des technologies de batterie Blade ultra-sécurisées.' },
  { id: 'brand-nissan', name: 'Nissan', slug: 'nissan', logo_url: DEFAULT_BRAND_LOGOS.Nissan, sort_order: 2, is_active: true, country: 'Japon', description: 'Pionnier japonais réputé pour sa robustesse tout-terrain et la sportivité de sa gamme Nismo.' },
  { id: 'brand-bmw', name: 'BMW', slug: 'bmw', logo_url: DEFAULT_BRAND_LOGOS.BMW, sort_order: 3, is_active: true, country: 'Allemagne', description: 'Le plaisir de conduire poussé à son paroxysme : berlines souveraines et SUV de haute précision.' },
  { id: 'brand-kia', name: 'Kia', slug: 'kia', logo_url: DEFAULT_BRAND_LOGOS.Kia, sort_order: 4, is_active: true, country: 'Corée du Sud', description: 'L’audace du design coréen allié à une fiabilité éprouvée et un équipement technologique complet.' },
  { id: 'brand-jetour', name: 'Jetour', slug: 'jetour', logo_url: DEFAULT_BRAND_LOGOS.Jetour, sort_order: 5, is_active: true, country: 'Chine', description: 'SUV nouvelle génération combinant style audacieux, habitabilité généreuse et connectivité avancée.' },
  { id: 'brand-toyota', name: 'Toyota', slug: 'toyota', logo_url: DEFAULT_BRAND_LOGOS.Toyota, sort_order: 6, is_active: true, country: 'Japon', description: 'La référence mondiale absolue en fiabilité tout-terrain, hybridation et valeur de revente en Afrique.' },
  { id: 'brand-mitsubishi', name: 'Mitsubishi', slug: 'mitsubishi', logo_url: DEFAULT_BRAND_LOGOS.Mitsubishi, sort_order: 7, is_active: true, country: 'Japon', description: 'L’héritage rallye Dakar au service de pick-up infatigables et de SUV robustes.' },
  { id: 'brand-suzuki', name: 'Suzuki', slug: 'suzuki', logo_url: DEFAULT_BRAND_LOGOS.Suzuki, sort_order: 8, is_active: true, country: 'Japon', description: 'L’agilité urbaine, l’efficacité énergétique et la longévité mécanique pour vos trajets quotidiens.' },
  { id: 'brand-mercedes', name: 'Mercedes-Benz', slug: 'mercedes-benz', logo_url: DEFAULT_BRAND_LOGOS['Mercedes-Benz'], sort_order: 9, is_active: true, country: 'Allemagne', description: 'Le sommet absolu du prestige automobile mondial. Confort princier, raffinement et haute technologie.' },
  { id: 'brand-changan', name: 'Changan', slug: 'changan', logo_url: DEFAULT_BRAND_LOGOS.Changan, sort_order: 10, is_active: true, country: 'Chine', description: 'Technologies Blue Core et finitions soignées pour une expérience de conduite contemporaine.' },
  { id: 'brand-geely', name: 'Geely', slug: 'geely', logo_url: DEFAULT_BRAND_LOGOS.Geely, sort_order: 11, is_active: true, country: 'Chine', description: 'Design européen, plateformes modulaires de pointe et normes de sécurité internationales.' },
  { id: 'brand-haval', name: 'Haval', slug: 'haval', logo_url: DEFAULT_BRAND_LOGOS.Haval, sort_order: 12, is_active: true, country: 'Chine', description: 'Spécialiste mondial des SUV alliant robustesse, motorisations turbo et équipements d’avant-garde.' },
  { id: 'brand-landrover', name: 'Land Rover', slug: 'land-rover', logo_url: DEFAULT_BRAND_LOGOS['Land Rover'], sort_order: 13, is_active: true, country: 'Royaume-Uni', description: 'Le luxe aristocratique britannique couplé aux capacités tout-terrain les plus renommées de la planète.' },
];
