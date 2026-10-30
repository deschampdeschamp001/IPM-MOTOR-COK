import React from 'react';
import { Brand } from '../types';
import { BrandTile } from './BrandTile';
import { useTheme } from '../context/ThemeContext';

interface BrandTickerProps {
  brands: Brand[];
  selectedBrand: string | null;
  onSelectBrand: (brandName: string) => void;
}

export const BrandTicker: React.FC<BrandTickerProps> = ({ brands, selectedBrand, onSelectBrand }) => {
  const { isDark } = useTheme();

  const handleTileClick = (brandName: string) => {
    // If already selected, second click removes filter
    if (selectedBrand?.toLowerCase() === brandName.toLowerCase()) {
      onSelectBrand('');
    } else {
      onSelectBrand(brandName);
    }

    // Scroll smoothly to catalogue
    const catalogEl = document.getElementById('catalogue');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="marques"
      className={`py-16 sm:py-20 border-y transition-colors duration-300 ${
        isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-[#F9FAFB] border-neutral-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-[#E10600]" />
              <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-[#E10600]">
                Toutes marques, un seul parc automobile
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Nos marques
            </h2>
          </div>

          {selectedBrand && (
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Filtre actif : <strong className="text-[#E10600]">{selectedBrand}</strong>
              </span>
              <button
                type="button"
                onClick={() => onSelectBrand('')}
                className="text-xs text-[#E10600] hover:underline font-semibold cursor-pointer"
              >
                (Tout voir)
              </button>
            </div>
          )}
        </div>

        {/* 6 Columns Desktop, 4 Tablet, 3 Mobile Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {brands.map((brand) => {
            const isActive = selectedBrand?.toLowerCase() === brand.name.toLowerCase();
            return (
              <BrandTile
                key={brand.id || brand.name}
                brand={brand}
                isActive={isActive}
                onSelect={handleTileClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
