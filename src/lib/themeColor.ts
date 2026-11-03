// Centralized Dominant Color Manager for IPM Motors
export const DOMINANT_COLOR_KEY = 'ipm_dominant_color';
export const DEFAULT_DOMINANT_COLOR = '#e10600';

export interface ColorPreset {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'red', name: 'Rouge IPM Motors', color: '#e10600', description: 'Teinte officielle sportive et prestigieuse' },
  { id: 'blue', name: 'Bleu Royal Prestige', color: '#1e40af', description: 'Élégance discrète et souveraine' },
  { id: 'amber', name: 'Or / Ambre Impérial', color: '#d97706', description: 'Chaleur luxueuse et distinction' },
  { id: 'emerald', name: 'Vert Émeraude Éco-Luxe', color: '#059669', description: 'Modernité écologique et raffinement' },
  { id: 'bordeaux', name: 'Bordeaux Grand Cru', color: '#991b1b', description: 'Luxe intemporel et statut' },
  { id: 'carbon', name: 'Noir Carbone Sport', color: '#18181b', description: 'Furtif, technique et minimaliste' },
  { id: 'purple', name: 'Violet Améthyste', color: '#7c3aed', description: 'Exclusivité et avant-garde' },
];

export function getDominantColor(): string {
  if (typeof window === 'undefined') return DEFAULT_DOMINANT_COLOR;
  const stored = localStorage.getItem(DOMINANT_COLOR_KEY);
  if (stored && /^#[0-9A-Fa-f]{6}$/.test(stored)) {
    return stored;
  }
  return DEFAULT_DOMINANT_COLOR;
}

export function applyDominantColor(color: string): void {
  if (typeof window === 'undefined') return;
  const validColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : DEFAULT_DOMINANT_COLOR;
  
  // 1. Set CSS root variables
  document.documentElement.style.setProperty('--accent', validColor);
  document.documentElement.style.setProperty('--color-primary', validColor);

  // 2. Inject or update the dynamic style override tag
  let styleEl = document.getElementById('ipm-dominant-color-override') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'ipm-dominant-color-override';
    document.head.appendChild(styleEl);
  }

  // Generate CSS rules to dynamically override all hardcoded red classes to the active dominant color
  styleEl.innerHTML = `
    :root {
      --accent: ${validColor} !important;
      --color-primary: ${validColor} !important;
    }
    .bg-\\[\\#e10600\\], .bg-\\[\\#E10600\\] {
      background-color: ${validColor} !important;
    }
    .text-\\[\\#e10600\\], .text-\\[\\#E10600\\] {
      color: ${validColor} !important;
    }
    .border-\\[\\#e10600\\], .border-\\[\\#E10600\\] {
      border-color: ${validColor} !important;
    }
    .ring-\\[\\#e10600\\], .ring-\\[\\#E10600\\] {
      --tw-ring-color: ${validColor} !important;
    }
    .hover\\:bg-\\[\\#c30500\\]:hover, .hover\\:bg-\\[\\#d00500\\]:hover, .hover\\:bg-\\[\\#b50500\\]:hover {
      filter: brightness(0.9) !important;
      background-color: ${validColor} !important;
    }
    .hover\\:text-\\[\\#c30500\\]:hover, .hover\\:text-\\[\\#e10600\\]:hover {
      color: ${validColor} !important;
    }
    .hover\\:border-\\[\\#e10600\\]:hover {
      border-color: ${validColor} !important;
    }
    .focus\\:border-\\[\\#E10600\\]:focus, .focus\\:border-\\[\\#e10600\\]:focus {
      border-color: ${validColor} !important;
    }
    .focus-within\\:ring-\\[\\#e10600\\]:focus-within {
      --tw-ring-color: ${validColor} !important;
    }
  `;

  localStorage.setItem(DOMINANT_COLOR_KEY, validColor);
  window.dispatchEvent(new CustomEvent('ipm_dominant_color_changed', { detail: validColor }));
}

export function subscribeToDominantColor(callback: (color: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (e: any) => {
    callback(e.detail || getDominantColor());
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === DOMINANT_COLOR_KEY && e.newValue) {
      callback(e.newValue);
    }
  };

  window.addEventListener('ipm_dominant_color_changed', handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener('ipm_dominant_color_changed', handler);
    window.removeEventListener('storage', storageHandler);
  };
}
