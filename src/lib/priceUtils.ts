import { Vehicle } from '../types';

/**
 * Standardized vehicle price utilities for IPM MOTORS
 * Cocody Riviera Bonoumin, Abidjan - Côte d'Ivoire
 */

/**
 * Formats a numeric price into West African CFA Franc (FCFA) string
 * Example: 25000000 -> "25 000 000 FCFA"
 */
export function formatCurrencyFCFA(amount: number): string {
  if (isNaN(amount)) return 'Sur demande';
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

/**
 * Validates user-entered price
 * Distinguishes null/empty (on demand) from 0 or positive numbers.
 * Rejects negative numbers.
 */
export function validatePriceInput(input: any): {
  valid: boolean;
  value: number | null;
  error?: string;
} {
  if (input === undefined || input === null || String(input).trim() === '') {
    return { valid: true, value: null };
  }

  const cleaned = String(input).replace(/\s+/g, '').replace(/,/g, '.');
  const num = Number(cleaned);

  if (isNaN(num)) {
    return { valid: false, value: null, error: 'Montant numérique invalide' };
  }

  if (num < 0) {
    return { valid: false, value: null, error: 'Le prix ne peut pas être négatif' };
  }

  return { valid: true, value: num };
}

/**
 * Computes display information for a vehicle's price according to its configuration:
 * - numeric price
 * - commercial price_label
 * - display mode ('auto' | 'numeric' | 'label' | 'both' | 'on_demand')
 * - promo_price
 */
export function getVehiclePriceInfo(vehicle: Partial<Vehicle>): {
  displayPrice: string;
  hasNumericPrice: boolean;
  isPromo: boolean;
  rawPrice: number | null;
  promoPrice: number | null;
  displayMode: string;
} {
  const rawPrice = vehicle.price !== undefined && vehicle.price !== null && !isNaN(vehicle.price) ? vehicle.price : null;
  const promoPrice = vehicle.promo_price !== undefined && vehicle.promo_price !== null && !isNaN(vehicle.promo_price) ? vehicle.promo_price : null;
  const customLabel = vehicle.price_label?.trim();
  const mode = vehicle.price_display_mode || 'auto';

  // Mode: on_demand
  if (mode === 'on_demand') {
    return {
      displayPrice: customLabel || 'Sur demande',
      hasNumericPrice: false,
      isPromo: false,
      rawPrice: null,
      promoPrice: null,
      displayMode: mode,
    };
  }

  // Mode: label only
  if (mode === 'label') {
    return {
      displayPrice: customLabel || 'Sur demande',
      hasNumericPrice: rawPrice !== null && rawPrice > 0,
      isPromo: false,
      rawPrice,
      promoPrice,
      displayMode: mode,
    };
  }

  // Has promo price
  if (promoPrice !== null && promoPrice > 0 && rawPrice !== null && rawPrice > promoPrice) {
    return {
      displayPrice: formatCurrencyFCFA(promoPrice),
      hasNumericPrice: true,
      isPromo: true,
      rawPrice,
      promoPrice,
      displayMode: mode,
    };
  }

  // Mode: numeric only
  if (mode === 'numeric') {
    if (rawPrice !== null && rawPrice > 0) {
      return {
        displayPrice: formatCurrencyFCFA(rawPrice),
        hasNumericPrice: true,
        isPromo: false,
        rawPrice,
        promoPrice,
        displayMode: mode,
      };
    }
    return {
      displayPrice: 'Sur demande',
      hasNumericPrice: false,
      isPromo: false,
      rawPrice: null,
      promoPrice: null,
      displayMode: mode,
    };
  }

  // Mode: both (number + label if label differs from raw number)
  if (mode === 'both') {
    if (rawPrice !== null && rawPrice > 0) {
      const formatted = formatCurrencyFCFA(rawPrice);
      const display = customLabel && !customLabel.toLowerCase().includes('sur demande')
        ? `${formatted} • ${customLabel}`
        : formatted;
      return {
        displayPrice: display,
        hasNumericPrice: true,
        isPromo: false,
        rawPrice,
        promoPrice,
        displayMode: mode,
      };
    }
    return {
      displayPrice: customLabel || 'Sur demande',
      hasNumericPrice: false,
      isPromo: false,
      rawPrice: null,
      promoPrice: null,
      displayMode: mode,
    };
  }

  // Mode: auto (default)
  // If custom label is specified and explicitly not "Sur demande" while rawPrice is null, use label
  if (rawPrice !== null && rawPrice > 0) {
    return {
      displayPrice: formatCurrencyFCFA(rawPrice),
      hasNumericPrice: true,
      isPromo: false,
      rawPrice,
      promoPrice,
      displayMode: mode,
    };
  }

  if (customLabel && customLabel.length > 0) {
    return {
      displayPrice: customLabel,
      hasNumericPrice: false,
      isPromo: false,
      rawPrice: null,
      promoPrice: null,
      displayMode: mode,
    };
  }

  return {
    displayPrice: 'Sur demande',
    hasNumericPrice: false,
    isPromo: false,
    rawPrice: null,
    promoPrice: null,
    displayMode: mode,
  };
}
