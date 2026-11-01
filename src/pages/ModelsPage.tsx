import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useSearchParams, Link } from '../router/Router';
import { VehicleCard } from '../components/VehicleCard';
import { X, RotateCcw, SlidersHorizontal, Search } from 'lucide-react';
import { POPULAR_BRANDS } from '../config/dealership';

export const ModelsPage: React.FC = () => {
  const { vehicles, brands } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'year-desc'>('default');

  // Search parameters support (single or multi-select comma separated)
  const searchQuery = searchParams.get('q') || '';
  const selectedTypeParam = searchParams.get('type') || '';
  const selectedMarqueParam = searchParams.get('marque') || '';
  const selectedEnergieParam = searchParams.get('energie') || '';

  const selectedTypes = useMemo(() => {
    return selectedTypeParam ? selectedTypeParam.split(',').filter(Boolean) : [];
  }, [selectedTypeParam]);

  const selectedMarques = useMemo(() => {
    return selectedMarqueParam ? selectedMarqueParam.split(',').filter(Boolean) : [];
  }, [selectedMarqueParam]);

  const selectedEnergies = useMemo(() => {
    return selectedEnergieParam ? selectedEnergieParam.split(',').filter(Boolean) : [];
  }, [selectedEnergieParam]);

  // Set document title
  useEffect(() => {
    document.title = 'Catalogue Véhicules Neufs 0 km | IPM Motors Abidjan';
  }, []);

  // Map brand names to logos defined in admin / brands context
  const brandLogoMap = useMemo(() => {
    const map: Record<string, string> = {};
    brands.forEach((b) => {
      if (b.logo_url) {
        map[b.name.toLowerCase()] = b.logo_url;
      }
    });
    return map;
  }, [brands]);

  // All brand list: union of POPULAR_BRANDS and brands defined in DB/admin
  const allBrandNames = useMemo(() => {
    const brandSet = new Set<string>();
    POPULAR_BRANDS.forEach((b) => brandSet.add(b));
    brands.forEach((b) => brandSet.add(b.name));
    return Array.from(brandSet);
  }, [brands]);

  const vehicleTypesList = ['SUV', 'Berline', 'Pick-up', 'Électrique', 'Citadine', 'Coupé'];
  const availableEnergies = ['100% Électrique', 'Hybride', 'Essence', 'Diesel'];

  // Toggle multi-select functions
  const toggleType = (t: string) => {
    const current = new URLSearchParams(searchParams);
    let next: string[];
    if (selectedTypes.includes(t)) {
      next = selectedTypes.filter((item) => item !== t);
    } else {
      next = [...selectedTypes, t];
    }
    if (next.length > 0) {
      current.set('type', next.join(','));
    } else {
      current.delete('type');
    }
    setSearchParams(current);
  };

  const toggleMarque = (brand: string) => {
    const current = new URLSearchParams(searchParams);
    let next: string[];
    if (selectedMarques.includes(brand)) {
      next = selectedMarques.filter((item) => item !== brand);
    } else {
      next = [...selectedMarques, brand];
    }
    if (next.length > 0) {
      current.set('marque', next.join(','));
    } else {
      current.delete('marque');
    }
    setSearchParams(current);
  };

  const toggleEnergie = (eng: string) => {
    const current = new URLSearchParams(searchParams);
    let next: string[];
    if (selectedEnergies.includes(eng)) {
      next = selectedEnergies.filter((item) => item !== eng);
    } else {
      next = [...selectedEnergies, eng];
    }
    if (next.length > 0) {
      current.set('energie', next.join(','));
    } else {
      current.delete('energie');
    }
    setSearchParams(current);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setBrandSearch('');
  };

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (!v.is_available) return false;

        // Global search query (e.g. from hero search bar)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchModel = v.model.toLowerCase().includes(q);
          const matchBrand = v.brand.toLowerCase().includes(q);
          const matchType = v.type.toLowerCase().includes(q);
          const matchFuel = (v.fuel || '').toLowerCase().includes(q);
          if (!matchModel && !matchBrand && !matchType && !matchFuel) return false;
        }

        // Multi-select Types
        if (selectedTypes.length > 0) {
          const vType = v.type.toLowerCase();
          const matches = selectedTypes.some((t) => t.toLowerCase() === vType);
          if (!matches) return false;
        }

        // Multi-select Marques
        if (selectedMarques.length > 0) {
          const vBrand = v.brand.toLowerCase();
          const matches = selectedMarques.some((m) => m.toLowerCase() === vBrand);
          if (!matches) return false;
        }

        // Multi-select Energies
        if (selectedEnergies.length > 0) {
          const vFuel = (v.fuel || '').toLowerCase();
          const matches = selectedEnergies.some((e) => vFuel.includes(e.toLowerCase()));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return (a.price || 999999999) - (b.price || 999999999);
        }
        if (sortBy === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'year-desc') {
          return (b.year || 0) - (a.year || 0);
        }
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      });
  }, [vehicles, searchQuery, selectedTypes, selectedMarques, selectedEnergies, sortBy]);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    selectedTypes.length +
    selectedMarques.length +
    selectedEnergies.length;

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return allBrandNames;
    return allBrandNames.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));
  }, [allBrandNames, brandSearch]);

  return (
    <div className="pt-4 sm:pt-6 min-h-screen flex flex-col max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pb-16">
      {/* Barre supérieure compacte fixe avec TITRE CENTRÉ */}
      <div className="shrink-0 py-3 sm:py-4 border-b border-[var(--border)] mb-6 flex flex-col gap-3">
        {/* Titre et compteur PARFAITEMENT CENTRÉS */}
        <div className="text-center">
          <h1 className="font-heading font-semibold text-xl sm:text-2xl text-[var(--fg)] tracking-tight">
            Modèles Neufs <span className="text-[#e10600]">0 km</span>
          </h1>
          <p className="text-xs text-[#6b6b72] font-mono mt-0.5">
            <strong className="text-[var(--fg)] font-semibold">{filteredVehicles.length}</strong> véhicule{filteredVehicles.length > 1 ? 's' : ''} disponible{filteredVehicles.length > 1 ? 's' : ''} en parc automobile
          </p>
        </div>

        {/* Ligne d'actions responsive : Filtres à gauche, Tri à droite */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Gauche : Bouton Filtre Mobile & Effacer */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-1.5 bg-[var(--card)] text-xs font-semibold flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-2xs hover:border-[#e10600] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#e10600]" />
              <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs text-[#e10600] hover:underline font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Effacer ({activeFiltersCount})</span>
              </button>
            )}

            <span className="text-xs text-[#6b6b72] hidden lg:inline">
              Catalogue Parc Automobile
            </span>
          </div>

          {/* Droite : Sélecteur de Tri */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6b6b72] hidden sm:inline">Trier :</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-none bg-[var(--surface)] text-[var(--fg)] text-xs font-medium focus:outline-none border border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              <option value="default">Recommandés</option>
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
              <option value="year-desc">Année : plus récente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteneur principal split-view moderne avec défilement fluide et naturel */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
        {/* Colonne gauche Desktop : Panneau Filtres compact et fixe */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:w-72 xl:w-76 lg:shrink-0 space-y-2.5 lg:pr-1">

          {/* Bloc 1 : MARQUES (Recherche rapide + liste marques élégante et compacte) */}
          <div className="p-3 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-heading font-bold text-[11px] uppercase tracking-wider text-zinc-900">
                Marques
              </h3>
              {selectedMarques.length > 0 && (
                <button
                  onClick={() => {
                    const current = new URLSearchParams(searchParams);
                    current.delete('marque');
                    setSearchParams(current);
                  }}
                  className="text-[10px] text-[#e10600] font-semibold hover:underline"
                >
                  Effacer ({selectedMarques.length})
                </button>
              )}
            </div>

            {/* Barre de recherche marque rapide */}
            <div className="relative mb-1.5">
              <input
                type="text"
                placeholder="Filtrer une marque..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#e10600]"
              />
              <Search className="w-3 h-3 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>

            {/* Liste scrollable fluide et compacte uniquement pour les marques */}
            <div className="space-y-0.5 max-h-32 overflow-y-auto overscroll-contain scroll-smooth pr-1 [scrollbar-width:thin] [scrollbar-color:#d4d4d8_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400">
              {filteredBrands.map((brandName) => {
                const count = vehicles.filter((v) => v.brand.toLowerCase() === brandName.toLowerCase()).length;
                const isChecked = selectedMarques.includes(brandName);
                const logoUrl = brandLogoMap[brandName.toLowerCase()];

                return (
                  <label
                    key={brandName}
                    className={`w-full px-2 py-1 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer select-none ${
                      isChecked ? 'bg-[#e10600]/10 text-[#e10600] font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMarque(brandName)}
                        className="rounded border-zinc-300 text-[#e10600] focus:ring-[#e10600] w-3.5 h-3.5 cursor-pointer accent-[#e10600] shrink-0"
                      />

                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brandName}
                          className="w-3.5 h-3.5 object-contain shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[7px] font-bold text-zinc-600 shrink-0">
                          {brandName.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <span className="truncate text-xs">{brandName}</span>
                    </div>

                    <span className="text-zinc-400 font-mono text-[10px] shrink-0 ml-1">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bloc 2 : TYPE DE VÉHICULE (Format compact et net) */}
          <div className="p-3 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-heading font-bold text-[11px] uppercase tracking-wider text-zinc-900">
                Type de véhicule
              </h3>
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => {
                    const current = new URLSearchParams(searchParams);
                    current.delete('type');
                    setSearchParams(current);
                  }}
                  className="text-[10px] text-[#e10600] font-semibold hover:underline"
                >
                  Effacer ({selectedTypes.length})
                </button>
              )}
            </div>

            <div className="space-y-0.5">
              {vehicleTypesList.map((t) => {
                const count = vehicles.filter((v) => v.type.toLowerCase() === t.toLowerCase()).length;
                const isChecked = selectedTypes.includes(t);
                return (
                  <label
                    key={t}
                    className={`w-full px-2 py-1 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer select-none ${
                      isChecked ? 'bg-[#e10600]/10 text-[#e10600] font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleType(t)}
                        className="rounded border-zinc-300 text-[#e10600] focus:ring-[#e10600] w-3.5 h-3.5 cursor-pointer accent-[#e10600]"
                      />
                      <span className="text-xs">{t}</span>
                    </div>
                    <span className="text-zinc-400 font-mono text-[10px]">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bloc 3 : MOTORISATION / ÉNERGIE (Format compact et net) */}
          <div className="p-3 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-heading font-bold text-[11px] uppercase tracking-wider text-zinc-900">
                Motorisation / Énergie
              </h3>
              {selectedEnergies.length > 0 && (
                <button
                  onClick={() => {
                    const current = new URLSearchParams(searchParams);
                    current.delete('energie');
                    setSearchParams(current);
                  }}
                  className="text-[10px] text-[#e10600] font-semibold hover:underline"
                >
                  Effacer ({selectedEnergies.length})
                </button>
              )}
            </div>

            <div className="space-y-0.5">
              {availableEnergies.map((eng) => {
                const isChecked = selectedEnergies.includes(eng);
                const count = vehicles.filter((v) => (v.fuel || '').toLowerCase().includes(eng.toLowerCase())).length;

                return (
                  <label
                    key={eng}
                    className={`w-full px-2 py-1 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer select-none ${
                      isChecked ? 'bg-[#e10600]/10 text-[#e10600] font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleEnergie(eng)}
                        className="rounded border-zinc-300 text-[#e10600] focus:ring-[#e10600] w-3.5 h-3.5 cursor-pointer accent-[#e10600]"
                      />
                      <span className="text-xs">{eng}</span>
                    </div>
                    <span className="text-zinc-400 font-mono text-[10px]">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Modal Bottom Sheet pour filtres mobile/tablette (Au-dessus de la barre de dock, boutons carrés côte à côte) */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden">
            <div className="bg-white dark:bg-[#121214] rounded-t-2xl max-h-[85vh] flex flex-col p-5 pb-24 overflow-y-auto shadow-2xl">
              <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
                <span className="font-heading font-bold text-sm text-zinc-950 dark:text-white uppercase tracking-wider">
                  Filtres du Catalogue
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filtres compacts mobile */}
              <div className="space-y-4 py-2">
                {/* Marques */}
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white mb-2">
                    Marques
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {allBrandNames.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 text-xs py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMarques.includes(brand)}
                          onChange={() => toggleMarque(brand)}
                          className="rounded-none text-[#e10600] accent-[#e10600] w-3.5 h-3.5"
                        />
                        <span className="truncate">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Carrosserie */}
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white mb-2">
                    Type de carrosserie
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {vehicleTypesList.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-xs py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="rounded-none text-[#e10600] accent-[#e10600] w-3.5 h-3.5"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Motorisation */}
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white mb-2">
                    Motorisation
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableEnergies.map((eng) => (
                      <label key={eng} className="flex items-center gap-2 text-xs py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEnergies.includes(eng)}
                          onChange={() => toggleEnergie(eng)}
                          className="rounded-none text-[#e10600] accent-[#e10600] w-3.5 h-3.5"
                        />
                        <span>{eng}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Boutons actions mobile côte à côte carrés Image 4 (parfaitement au-dessus de la barre de navigation) */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="py-3 px-5 rounded-none border border-zinc-300 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-[#e10600] hover:bg-[#c30500] text-white rounded-none text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  Voir les modèles ({filteredVehicles.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Colonne droite : Catalogue des véhicules avec défilement naturel de la page */}
        <main className="flex-1 lg:pl-1 lg:pr-2">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[var(--card)] dark:bg-[#141417] border-0">
              <h3 className="font-heading font-medium text-lg mb-2">
                Aucun modèle ne correspond à ces critères
              </h3>
              <p className="text-xs text-[#6b6b72] max-w-md mx-auto mb-6 font-light">
                Vous recherchez une motorisation ou une finition spécifique ? Nous importons votre véhicule d’usine 0 km selon votre cahier des charges.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="pill-btn px-6 py-2.5 bg-[var(--surface)] text-[var(--fg)] text-xs font-semibold"
                >
                  Effacer les filtres
                </button>
                <Link
                  to="/contact"
                  className="pill-btn px-6 py-2.5 bg-[#e10600] text-white text-xs font-semibold"
                >
                  Commander sur-mesure
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
