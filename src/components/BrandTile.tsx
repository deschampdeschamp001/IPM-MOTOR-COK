import React, { useState, useEffect } from 'react';
import { Brand } from '../types';
import { DEFAULT_BRAND_LOGOS } from '../data/defaultBrands';

interface BrandTileProps {
  brand: Brand;
  isActive: boolean;
  onSelect: (brandName: string) => void;
}

export const BrandTile: React.FC<BrandTileProps> = ({ brand, isActive, onSelect }) => {
  const fallbackLogo = DEFAULT_BRAND_LOGOS[brand.name] || null;
  const initialLogo = brand.logo_url || fallbackLogo;

  const [currentLogoSrc, setCurrentLogoSrc] = useState<string | null>(initialLogo);
  const [hasFailedCustom, setHasFailedCustom] = useState(false);

  // When brand prop or logo_url changes, reset to new logo source
  useEffect(() => {
    const freshSrc = brand.logo_url || DEFAULT_BRAND_LOGOS[brand.name] || null;
    setCurrentLogoSrc(freshSrc);
    setHasFailedCustom(false);
  }, [brand.logo_url, brand.name]);

  const handleImageError = () => {
    // If custom logo failed, fall back to default vector SVG logo
    if (!hasFailedCustom && fallbackLogo && currentLogoSrc !== fallbackLogo) {
      setHasFailedCustom(true);
      setCurrentLogoSrc(fallbackLogo);
    } else {
      // Both custom and fallback failed or unavailable: switch to text wordmark
      setCurrentLogoSrc(null);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(brand.name)}
      aria-label={`Filtrer par ${brand.name}`}
      aria-pressed={isActive}
      className={`group relative aspect-square w-full bg-white rounded-[12px] p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:ring-offset-2 ${
        isActive
          ? 'border-2 border-[#E10600] shadow-md shadow-[#E10600]/15'
          : 'border border-neutral-200 hover:border-[#E10600] shadow-sm hover:shadow'
      }`}
    >
      {/* Centered Logo Container */}
      <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-1">
        {currentLogoSrc ? (
          <img
            key={currentLogoSrc}
            src={currentLogoSrc}
            alt={`Logo ${brand.name}`}
            loading="lazy"
            onError={handleImageError}
            className={`max-h-10 sm:max-h-12 max-w-[85%] object-contain transition-all duration-200 ${
              isActive
                ? 'grayscale-0 opacity-100 scale-105'
                : 'grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'
            }`}
          />
        ) : (
          /* Text fallback if image is missing or broken: stylized logo wordmark */
          <span
            className={`text-sm sm:text-base font-extrabold tracking-wider uppercase transition-colors text-center ${
              isActive ? 'text-[#E10600]' : 'text-neutral-700 group-hover:text-[#E10600]'
            }`}
          >
            {brand.name}
          </span>
        )}
      </div>

      {/* Brand Name Text below logo */}
      <span
        className={`text-[10px] sm:text-xs font-semibold tracking-tight text-center line-clamp-1 transition-colors ${
          isActive
            ? 'text-[#E10600] font-bold'
            : 'text-neutral-700 group-hover:text-black'
        }`}
      >
        {brand.name}
      </span>
    </button>
  );
};
