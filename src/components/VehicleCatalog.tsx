import React, { useState, useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { VEHICLE_TYPES } from '../config/dealership';
import { useTheme } from '../context/ThemeContext';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  isFallback: boolean;
  selectedBrand: string | null;
  onSelectBrand: (brand: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  vehicles,
  isLoading,
  isFallback,
  selectedBrand,
  onSelectBrand,
  onSelectVehicle,
}) => {
  const [selectedType, setSelectedType] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const { isDark } = useTheme();

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Filter by Type
      if (selectedType !== 'Tous' && v.type !== selectedType) {
        return false;
      }
      // Filter by Brand
      if (selectedBrand && v.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const brandMatch = v.brand.toLowerCase().includes(query);
        const modelMatch = v.model.toLowerCase().includes(query);
        const fuelMatch = v.fuel.toLowerCase().includes(query);
        if (!brandMatch && !modelMatch && !fuelMatch) return false;
      }
      return true;
    });
  }, [vehicles, selectedType, selectedBrand, searchQuery]);

  const handleResetFilters = () => {
    setSelectedType('Tous');
    onSelectBrand('');
    setSearchQuery('');
    setVisibleCount(9);
  };

  const displayedVehicles = filteredVehicles.slice(0, visibleCount);
  const hasMore = filteredVehicles.length > visibleCount;

  return (
    <section
      id="catalogue"
      className={`py-16 sm:py-24 transition-colors duration-300 ${
        isDark ? 'bg-[#0E0E0E] text-white' : 'bg-[#FFFFFF] text-[#0A0A0A]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-[2px] bg-[#E10600]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-[#E10600]">
              Disponibilité immédiate
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Nos véhicules
            </h2>

            {/* Discrete vehicle counter */}
            <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Tiny grey mention only when demo fallback data is used */}
          {isFallback && (
            <p className="text-xs text-neutral-400 mt-1 font-light">
              Exemples de démonstration
            </p>
          )}
        </div>

        {/* Clean Filter Bar (Single row on desktop, stacked on mobile) */}
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          {/* Left: Search input */}
          <div className="relative w-full md:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher marque, modèle..."
              aria-label="Rechercher un véhicule"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#E10600] ${
                isDark
                  ? 'bg-[#181818] border border-neutral-800 text-white placeholder-neutral-500 focus:border-[#E10600]'
                  : 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-[#E10600]'
              }`}
            />
          </div>

          {/* Right: Type pills (Horizontal scroll on mobile, flex wrap on desktop) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
            {VEHICLE_TYPES.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    setVisibleCount(9);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-white text-black shadow-sm'
                        : 'bg-black text-white shadow-sm'
                      : isDark
                      ? 'border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
                      : 'border border-neutral-300 text-neutral-700 hover:border-black hover:text-black'
                  }`}
                >
                  {type}
                </button>
              );
            })}

            {/* Reset pills if filtered */}
            {(selectedType !== 'Tous' || selectedBrand || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-neutral-400 hover:text-[#E10600] transition-colors rounded-full cursor-pointer ml-1"
                title="Réinitialiser les filtres"
                aria-label="Réinitialiser les filtres"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className={`rounded-xl overflow-hidden border animate-pulse ${
                  isDark ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
                }`}
              >
                <div className={`aspect-[16/10] ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                <div className="p-6 space-y-3">
                  <div className={`h-3 rounded w-1/4 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                  <div className={`h-6 rounded w-3/4 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                  <div className={`h-4 rounded w-1/2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                  <div className={`h-5 rounded w-1/3 pt-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredVehicles.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold mb-2">Aucun véhicule pour le moment</h3>
            <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Aucun modèle ne correspond à vos critères de recherche actuels.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors bg-[#E10600] text-white hover:bg-[#B00500] cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Grid of Vehicles: 1 col < 640px, 2 col 640-1024px, 3 col > 1024px */}
        {!isLoading && filteredVehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 duration-300"
                style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  onSelect={onSelectVehicle}
                />
              </div>
            ))}
          </div>
        )}

        {/* "Voir plus" button if more than 9 vehicles */}
        {!isLoading && hasMore && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className={`px-8 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'border-neutral-700 hover:border-white text-white hover:bg-neutral-900'
                  : 'border-neutral-300 hover:border-black text-black hover:bg-neutral-50'
              }`}
            >
              Voir plus ({filteredVehicles.length - visibleCount} restants)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
