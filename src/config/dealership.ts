import { DealershipConfig, Vehicle } from '../types';

export const DEALERSHIP_CONFIG: DealershipConfig = {
  name: 'IPM MOTORS',
  fullName: 'Ivoire Premium Motors',
  phone: '+2250701202021',
  phoneDisplay: '07 01 20 20 21',
  whatsapp: '2250701202021',
  email: 'ipmotors225@gmail.com',
  address: 'Cocody Riviera Bonoumin, près du feu tricolore de la pharmacie Saint Paul (ou de la mosquée Mont Arafat de Bonoumin)',
  neighborhood: 'Cocody Riviera Bonoumin',
  city: 'Abidjan',
  country: "Côte d'Ivoire",
  coordinates: {
    lat: 5.28394,
    lng: -3.97594,
  },
  googleMapsUrl: 'https://maps.app.goo.gl/YWfUdsTF3xF5McaE6',
};

export const POPULAR_BRANDS = [
  'BYD',
  'Nissan',
  'BMW',
  'Kia',
  'Jetour',
  'Toyota',
  'Mitsubishi',
  'Suzuki',
  'Mercedes-Benz',
  'Changan',
  'Geely',
  'Haval',
  'Land Rover'
];

export const VEHICLE_TYPES = ['Tous', 'SUV', 'Berline', 'Pick-up', 'Électrique', 'Citadine'] as const;

/**
 * Helper to build prefilled WhatsApp URLs for user inquiries
 */
export function buildWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = customPhone || DEALERSHIP_CONFIG.whatsapp;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to build rich prefilled WhatsApp message with vehicle specs, publication link, and sales intent
 */
export function buildVehicleWhatsAppUrl(vehicle: Vehicle, contextNote?: string): string {
  const priceDisplay = vehicle.price
    ? new Intl.NumberFormat('fr-FR').format(vehicle.price) + ' FCFA'
    : vehicle.price_label || 'Sur demande';

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ipmmotors.ci';
  const vehicleUrl = `${origin}/vehicule/${vehicle.id}`;

  const lines = [
    `Bonjour IPM MOTORS,`,
    ``,
    `Je suis très intéressé(e) par ce véhicule 0 km disponible dans votre concession :`,
    `• Marque : ${vehicle.brand}`,
    `• Modèle : ${vehicle.model}`,
    vehicle.year ? `• Année : ${vehicle.year}` : '',
    vehicle.type ? `• Catégorie : ${vehicle.type}` : '',
    vehicle.fuel ? `• Motorisation : ${vehicle.fuel}` : '',
    vehicle.transmission ? `• Boîte : ${vehicle.transmission}` : '',
    `• Prix : ${priceDisplay}`,
    contextNote ? `• Note : ${contextNote}` : '',
    ``,
    `🔗 Lien de la publication : ${vehicleUrl}`,
    ``,
    `Pouvez-vous me confirmer sa disponibilité immédiate et les formalités d'acquisition ?`
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join('\n'));
}
