import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Link } from '../router/Router';
import { buildVehicleWhatsAppUrl } from '../config/dealership';
import { getVehiclePriceInfo } from '../lib/priceUtils';
import {
  Search,
  Heart,
  Share2,
  Fuel,
  Gauge,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.16 12.04 20.16C10.61 20.16 9.21 19.78 7.99 19.06L7.7 18.89L4.58 19.71L5.41 16.67L5.22 16.37C4.43 15.11 4.02 13.53 4.02 11.91C4.02 7.37 7.71 3.67 12.04 3.67ZM8.82 7.42C8.61 7.42 8.41 7.43 8.24 7.46C8.01 7.5 7.68 7.6 7.46 8.09C7.21 8.64 6.54 9.27 6.54 10.53C6.54 11.79 7.46 13.01 7.59 13.18C7.72 13.35 9.38 15.91 11.92 17.01C14.03 17.92 14.46 17.74 14.93 17.7C15.4 17.65 16.44 17.08 16.65 16.49C16.86 15.9 16.86 15.4 16.8 15.29C16.74 15.19 16.57 15.13 16.32 15C16.07 14.88 14.84 14.28 14.61 14.2C14.38 14.12 14.21 14.07 14.04 14.32C13.88 14.57 13.39 15.15 13.24 15.31C13.1 15.48 12.95 15.5 12.7 15.37C12.45 15.25 11.65 14.99 10.7 14.14C9.96 13.48 9.46 12.67 9.32 12.42C9.17 12.17 9.31 12.04 9.43 11.91C9.54 11.8 9.68 11.62 9.81 11.47C9.93 11.33 9.97 11.22 10.05 11.06C10.14 10.89 10.09 10.75 10.03 10.62C9.97 10.5 9.49 9.31 9.28 8.82C9.09 8.34 8.89 8.41 8.74 8.4C8.59 8.4 8.42 8.4 8.24 8.4L8.82 7.42Z"
    />
  </svg>
);

const renderBannerTitle = (title: string, highlight?: string) => {
  if (!highlight || !title.toLowerCase().includes(highlight.toLowerCase())) {
    return <span>{title}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = title.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-[#f6b704] font-extrabold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export const OffersPage: React.FC = () => {
  const { vehicles, brands, exclusiveBanner } = useData();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'exclusive' | 'electric' | 'suv' | 'sedan'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = 'Nos Offres Privilège 0 km | IPM Motors Abidjan';
  }, []);

  const toggleFavorite = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  const handleShare = (vehicle: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ipmmotors.ci';
    const url = `${origin}/vehicule/${vehicle.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} 0 km`,
        text: `Découvrez cette offre exclusive chez IPM Motors`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const getBrandLogo = (brandName: string) => {
    const found = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
    return found?.logo_url || null;
  };

  const exclusiveCount = vehicles.filter((v) => (v.is_offer || v.is_featured) && v.is_exclusive).length;

  const offerVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const isOfferEligible = v.is_offer || v.is_featured;
      if (!isOfferEligible) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBrand = v.brand.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesFuel = (v.fuel || '').toLowerCase().includes(q);
        if (!matchesBrand && !matchesModel && !matchesFuel) return false;
      }

      // Filter tabs
      if (selectedFilter === 'exclusive') {
        return Boolean(v.is_exclusive);
      }
      if (selectedFilter === 'electric') {
        return (v.fuel || '').toLowerCase().includes('électrique') || (v.fuel || '').toLowerCase().includes('hybride');
      }
      if (selectedFilter === 'suv') {
        return v.type.toLowerCase().includes('suv') || v.type.toLowerCase().includes('pick-up');
      }
      if (selectedFilter === 'sedan') {
        return v.type.toLowerCase().includes('berline') || v.type.toLowerCase().includes('citadine');
      }
      return true;
    });
  }, [vehicles, selectedFilter, searchQuery]);

  // Two rows of 3 columns = first 6 vehicles
  const firstBatch = offerVehicles.slice(0, 6);
  const secondBatch = offerVehicles.slice(6);

  // Render a vehicle card conforming strictly to Image 3 (Auto24 dealership style)
  const renderOfferCard = (vehicle: any) => {
    const mainImg = vehicle.images?.[0] || '/assets/cars/hero_dealership_car_1793116464643.jpg';
    const brandLogo = getBrandLogo(vehicle.brand);
    const waUrl = buildVehicleWhatsAppUrl(
      vehicle,
      `Offre Spéciale Parc Automobile (${vehicle.offer_badge || 'Avantages 0 km'})`
    );

    const priceInfo = getVehiclePriceInfo(vehicle);
    const priceText = priceInfo.displayPrice;

    const isFav = favorites[vehicle.id];

    return (
      <div
        key={vehicle.id}
        className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg hover:border-zinc-300 transition-all duration-300 group"
      >
        <div>
          {/* 1. PHOTO DU VÉHICULE AVEC BADGES PURS */}
          <Link
            to={`/vehicule/${vehicle.id}`}
            className="block relative aspect-[16/10] bg-zinc-100 overflow-hidden"
          >
            <img
              src={mainImg}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
              }}
            />

            {/* Pastille discrète de logo de marque en bas à droite */}
            <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-zinc-100 flex items-center justify-center p-1.5 z-10">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={vehicle.brand}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-[9px] font-bold text-zinc-800 uppercase font-mono">
                  {vehicle.brand.slice(0, 2)}
                </span>
              )}
            </div>

            {/* Badges 0 KM et VIP en haut à gauche */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-950/85 text-white backdrop-blur-xs shadow-xs">
                0 km Neuf
              </span>
              {vehicle.is_exclusive && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#f6b704] text-zinc-950 shadow-xs">
                  Privilège
                </span>
              )}
            </div>
          </Link>

          {/* 2. DÉTAILS TEXTUELS DU VÉHICULE */}
          <div className="p-4 sm:p-5">
            {/* Titre : Marque Modèle Année */}
            <Link to={`/vehicule/${vehicle.id}`}>
              <h3 className="font-heading text-sm sm:text-base font-bold text-zinc-900 truncate mb-1 hover:text-[#e10600] transition-colors leading-snug">
                {vehicle.brand} {vehicle.model} {vehicle.year || ''}
              </h3>
            </Link>

            {/* Ligne Prix & Actions Favoris */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-black text-lg sm:text-xl text-zinc-950 tracking-tight">
                {priceText}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <button
                  type="button"
                  onClick={(e) => handleShare(vehicle, e)}
                  title="Partager cette offre"
                  className="p-1 rounded-full hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(vehicle.id, e)}
                  title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  className={`p-1 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer ${
                    isFav ? 'text-red-500 fill-red-500' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Spécifications techniques minimalistes */}
            <div className="flex items-center justify-between py-2 border-t border-zinc-100 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1 truncate">
                <Gauge className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{vehicle.transmission || 'Automatique'}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1 truncate">
                <Fuel className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{vehicle.fuel || 'Essence'}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1 shrink-0 font-medium text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Garantie 0 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Boutons d'action : Fiche technique + WhatsApp */}
        <div className="px-4 pb-4 pt-1 flex items-center gap-2">
          <Link
            to={`/vehicule/${vehicle.id}`}
            className="flex-1 py-2 rounded-xl border border-zinc-200 text-center text-xs font-semibold text-zinc-700 hover:text-black hover:border-zinc-300 hover:bg-zinc-50 transition-all"
          >
            Fiche technique
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    );
  };

  // The slim WhatsApp Banner component
  const renderThinExclusiveBanner = () => {
    if (exclusiveBanner?.enabled === false) return null;
    return (
      <div className="my-8 rounded-xl bg-[#032b17] border border-[#064223] py-3.5 px-5 sm:px-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight">
              {renderBannerTitle(
                exclusiveBanner?.title || 'Découvrez des offres exclusives !!',
                exclusiveBanner?.highlightText || 'exclusives'
              )}
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-100/80 font-light mt-0.5">
              {exclusiveBanner?.subtitle ||
                'Restez à jour avec les dernières nouvelles, mises à jour et exclusivités offres directement sur votre WhatsApp.'}
            </p>
          </div>
        </div>

        <a
          href={exclusiveBanner?.buttonUrl || 'https://whatsapp.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-100 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-md hover:scale-102 transition-all duration-200"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0 text-[#25D366]" />
          <span>{exclusiveBanner?.buttonText || 'REJOINDRE LA CHAÎNE'}</span>
        </a>
      </div>
    );
  };

  return (
    <div className="pt-24 sm:pt-30 pb-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-[1550px] mx-auto w-full">
      {/* 1. Header épuré sans texte superflu */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e10600]/10 border border-[#e10600]/25 text-[#e10600] text-xs font-bold tracking-wider uppercase mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Conditions Privilège IPM Motors</span>
        </div>
        <h1 className="font-heading font-light text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-[var(--fg)]">
          Nos Offres <span className="font-semibold text-[#e10600]">du Moment</span>
        </h1>
      </div>

      {/* 2. Filtres & Barre de recherche TOUT SUR LA MÊME LIGNE (Fond blanc, Style Image 2) */}
      <div className="mb-7 pb-4 border-b border-zinc-200 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
        {/* Carré de recherche compact sur la même ligne (Image 2) */}
        <div className="relative shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une offre..."
            className="w-40 sm:w-48 h-8.5 pl-8 pr-3 text-xs rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#e10600] transition-colors shadow-xs"
          />
        </div>

        {/* Boutons de filtres simplifiés et plus petits sur la même ligne (Image 2) */}
        {[
          { id: 'all', label: `Toutes les offres (${vehicles.filter(v => v.is_offer || v.is_featured).length})` },
          { id: 'exclusive', label: `Offres Exclusives VIP (${exclusiveCount})`, isSpecial: true },
          { id: 'electric', label: 'Électriques & Hybrides' },
          { id: 'suv', label: 'SUV & Baroudeurs' },
          { id: 'sedan', label: 'Berlines de Prestige' },
        ].map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`h-8.5 px-3.5 text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs ${
                isActive
                  ? 'bg-[#e10600] text-white'
                  : tab.isSpecial
                  ? 'bg-[#f6b704]/10 text-[#d97706] border border-[#f6b704]/40 hover:border-[#f6b704]'
                  : 'bg-white text-zinc-800 hover:text-black border border-zinc-200'
              }`}
            >
              {tab.isSpecial && <Sparkles className="w-3 h-3 text-[#f6b704]" />}
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Compteur discret à droite sur la même ligne */}
        <span className="text-xs font-mono text-zinc-500 shrink-0 ml-auto pl-2 whitespace-nowrap">
          <strong className="text-[var(--fg)] font-semibold">{offerVehicles.length}</strong> modèles disponibles
        </span>
      </div>

      {/* 3. Première tranche de véhicules (2 premières rangées = 6 véhicules style Image 3) */}
      {firstBatch.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {firstBatch.map((vehicle) => renderOfferCard(vehicle))}
        </div>
      ) : (
        <div className="py-12 text-center rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <p className="text-xs sm:text-sm text-zinc-500 font-light">
            Aucun modèle ne correspond à vos filtres actuels.
          </p>
        </div>
      )}

      {/* 4. SECTION OFFRES EXCLUSIVES WHATSAPP ENTRE LES OFFRES TRÈS MINCE */}
      {firstBatch.length > 0 && renderThinExclusiveBanner()}

      {/* 5. Deuxième tranche de véhicules (suite des offres) */}
      {secondBatch.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {secondBatch.map((vehicle) => renderOfferCard(vehicle))}
        </div>
      )}

      {/* 6. Section de commande sur-mesure épurée */}
      <div className="mt-14 p-6 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-1.5">
            Service Privilège IPM Motors
          </span>
          <h3 className="font-heading font-light text-xl sm:text-2xl text-[var(--fg)]">
            Vous recherchez une configuration ou finition particulière ?
          </h3>
          <p className="text-xs sm:text-sm text-[#6b6b72] mt-2 font-light leading-relaxed">
            Nous commandons directement auprès des constructeurs avec formalités de fret aérien/maritime, dédouanement et immatriculation ivoirienne clé en main.
          </p>
        </div>

        <Link
          to="/contact"
          className="pill-btn shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          <span>Consulter un conseiller VIP</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
