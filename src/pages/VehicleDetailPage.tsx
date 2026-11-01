import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../router/Router';
import { useData } from '../context/DataContext';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import { VehicleCard } from '../components/VehicleCard';
import { getVehiclePriceInfo } from '../lib/priceUtils';
import { InterestModal } from '../components/InterestModal';
import {
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  Users,
  CheckCircle2,
  Share2,
  ChevronRight,
  ArrowLeft,
  Truck,
  FileCheck
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.16 12.04 20.16C10.61 20.16 9.21 19.78 7.99 19.06L7.7 18.89L4.58 19.71L5.41 16.67L5.22 16.37C4.43 15.11 4.02 13.53 4.02 11.91C4.02 7.37 7.71 3.67 12.04 3.67ZM8.82 7.42C8.61 7.42 8.41 7.43 8.24 7.46C8.01 7.5 7.68 7.6 7.46 8.09C7.21 8.64 6.54 9.27 6.54 10.53C6.54 11.79 7.46 13.01 7.59 13.18C7.72 13.35 9.38 15.91 11.92 17.01C14.03 17.92 14.46 17.74 14.93 17.7C15.4 17.65 16.44 17.08 16.65 16.49C16.86 15.9 16.86 15.4 16.8 15.29C16.74 15.19 16.57 15.13 16.32 15C16.07 14.88 14.84 14.28 14.61 14.2C14.38 14.12 14.21 14.07 14.04 14.32C13.88 14.57 13.39 15.15 13.24 15.31C13.1 15.48 12.95 15.5 12.7 15.37C12.45 15.25 11.65 14.99 10.7 14.14C9.96 13.48 9.46 12.67 9.32 12.42C9.17 12.17 9.31 12.04 9.43 11.91C9.54 11.8 9.68 11.62 9.81 11.47C9.93 11.33 9.97 11.22 10.05 11.06C10.14 10.89 10.09 10.75 10.03 10.62C9.97 10.5 9.49 9.31 9.28 8.82C9.09 8.34 8.89 8.41 8.74 8.4C8.59 8.4 8.42 8.4 8.24 8.4L8.82 7.42Z"
    />
  </svg>
);

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams();
  const { getVehicleById, vehicles } = useData();

  const vehicle = getVehicleById(id || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (vehicle) {
      document.title = `${vehicle.brand} ${vehicle.model} 0 km | IPM Motors Abidjan`;
    }
  }, [vehicle]);

  if (!vehicle) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-heading font-light text-3xl mb-4">Véhicule introuvable</h1>
        <p className="text-sm text-[#6b6b72] mb-8 font-light">
          Ce véhicule n'est plus disponible ou l’identifiant est erroné.
        </p>
        <Link
          to="/modeles"
          className="px-6 py-3 bg-[#e10600] text-white text-xs font-semibold inline-flex items-center gap-2 rounded-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['/assets/cars/hero_dealership_car_1793116464643.jpg'];

  const currentImage = images[activeImageIndex] || images[0];

  const priceInfo = getVehiclePriceInfo(vehicle);
  const displayPrice = priceInfo.displayPrice;

  const waMessage = `Bonjour IPM Motors, je suis vivement intéressé par le modèle 0 km suivant :\n- Modèle : ${vehicle.brand} ${vehicle.model}\n- Année : ${vehicle.year}\n- Énergie : ${vehicle.fuel}\nMerci de me communiquer la disponibilité et les modalités d'acquisition.`;
  const waUrl = buildWhatsAppUrl(waMessage);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} 0 km`,
        text: `Découvrez ce véhicule neuf chez IPM Motors Abidjan`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Similar vehicles (same type or same brand)
  const similarVehicles = vehicles
    .filter(v => v.id !== vehicle.id && (v.type === vehicle.type || v.brand === vehicle.brand))
    .slice(0, 3);

  return (
    <div className="pt-20 sm:pt-24 pb-20 max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 w-full">
      {/* Fil d'Ariane épuré */}
      <nav className="flex items-center gap-2 text-[11px] text-[#6b6b72] mb-5 font-mono">
        <Link to="/" className="hover:text-[var(--fg)]">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/vehicules" className="hover:text-[var(--fg)]">Véhicules</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/vehicules?tab=modeles&marque=${encodeURIComponent(vehicle.brand)}`} className="hover:text-[var(--fg)]">
          {vehicle.brand}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--fg)] font-semibold truncate max-w-[180px]">{vehicle.model}</span>
      </nav>

      {/* Boutique en ligne — Grille Produit Minimaliste (Galerie à gauche, Achat à droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Colonne Gauche : Galerie Photos Produit Carrée (7 colonnes) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Photo Principale avec cadre carré propre style boutique */}
          <div className="relative aspect-[16/11] w-full rounded-none overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center p-4">
            <img
              src={currentImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-102"
              onError={(e) => {
                e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
              }}
            />

            {/* Badges statut carré */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#e10600] text-white rounded-none shadow-xs">
                0 KM D’ORIGINE
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-black/80 text-white rounded-none border border-white/20">
                100% NEUF
              </span>
            </div>

            {/* Bouton Partage */}
            <button
              onClick={handleShare}
              aria-label="Partager ce véhicule"
              className="absolute top-3 right-3 w-8 h-8 rounded-none bg-white/90 dark:bg-black/80 hover:bg-white text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {copied && (
              <div className="absolute bottom-3 right-3 bg-black text-white px-2.5 py-1 text-[11px] font-mono rounded-none">
                Lien copié !
              </div>
            )}
          </div>

          {/* Vignettes miniatures carrées */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[16/11] w-20 sm:w-24 rounded-none overflow-hidden border-2 transition-all shrink-0 bg-white dark:bg-zinc-900 p-1 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#e10600]' : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Garanties minimalistes */}
          <div className="p-5 sm:p-6 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141416] space-y-4">
            <h2 className="font-heading font-bold text-base text-zinc-950 dark:text-white uppercase tracking-wider">
              Présentation du véhicule
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light whitespace-pre-line">
              {vehicle.description || 'Véhicule 100% neuf 0 km sous garantie constructeur intégrale avec carnet officiel. Disponible immédiatement dans notre parc automobile privé de Cocody Riviera Bonoumin.'}
            </p>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px]">0 KM Sortie d'usine</h4>
                  <p className="text-[11px] text-zinc-500 font-light">Véhicule strictement jamais immatriculé ni utilisé.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px]">Garantie Constructeur</h4>
                  <p className="text-[11px] text-zinc-500 font-light">Valable avec carnet officiel tamponné en Côte d’Ivoire.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Fiche d'Achat & Actions Boutique (5 colonnes) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 p-6 sm:p-7 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141416] shadow-sm space-y-5">
            {/* Titre & Marque */}
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                {vehicle.brand}
              </span>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-zinc-950 dark:text-white leading-tight">
                {vehicle.model}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 font-mono">
                <span>{vehicle.type}</span>
                <span>•</span>
                <span>Année {vehicle.year}</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">En stock à Abidjan</span>
              </div>
            </div>

            {/* Cadre de Prix Boutique en Ligne */}
            <div className="p-4 rounded-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-semibold">
                Prix Parc Automobile Clé en main
              </span>
              <span className="font-heading font-bold text-2xl sm:text-3xl text-zinc-950 dark:text-white mt-1 block">
                {displayPrice}
              </span>
              <span className="text-[11px] text-zinc-500 block mt-1">
                Formalités ivoiriennes, dédouanement et TVA inclus
              </span>
            </div>

            {/* Matrice des Spécifications Techniques Carrée */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2.5">
                <Fuel className="w-4 h-4 text-[#e10600] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Carburant</span>
                  <span className="font-bold text-xs truncate block">{vehicle.fuel}</span>
                </div>
              </div>
              <div className="p-3 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-[#e10600] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Transmission</span>
                  <span className="font-bold text-xs truncate block">{vehicle.transmission}</span>
                </div>
              </div>
              <div className="p-3 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#e10600] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Millésime</span>
                  <span className="font-bold text-xs block">{vehicle.year}</span>
                </div>
              </div>
              <div className="p-3 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#e10600] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Capacité</span>
                  <span className="font-bold text-xs block">{vehicle.seats || 5} places</span>
                </div>
              </div>
            </div>

            {/* DEUX BOUTONS CÔTE À CÔTE CARRÉS : JE SUIS INTÉRESSÉ + WHATSAPP (SANS BOUTON D'APPEL) */}
            <div className="pt-2 flex flex-row items-center gap-2.5">
              {/* Bouton 1 : Je suis intéressé (Ouvre le popup formulaire) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex-1 py-3.5 px-4 bg-[#e10600] hover:bg-[#c30500] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none flex items-center justify-center transition-all shadow-md cursor-pointer truncate"
              >
                <span>Je suis intéressé</span>
              </button>

              {/* Bouton 2 : WhatsApp (Ouvre WhatsApp direct) */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Garanties IPM Motors */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e10600] shrink-0" />
                <span>Véhicule visible en parc à Cocody Riviera Bonoumin</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#e10600] shrink-0" />
                <span>Dédouanement et carte grise ivoirienne assurés</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#e10600] shrink-0" />
                <span>Livraison clé en main partout en Côte d’Ivoire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Véhicules similaires boutique */}
      {similarVehicles.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e10600] block mb-1">
                Autres disponibilités
              </span>
              <h3 className="font-heading font-light text-xl sm:text-2xl text-zinc-950 dark:text-white">
                Dans la même <span className="font-semibold">catégorie</span>
              </h3>
            </div>
            <Link to="/vehicules" className="text-xs text-[#e10600] font-semibold hover:underline">
              Tout le catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarVehicles.map(v => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      )}

      {/* Modal 'Je suis intéressé' */}
      <InterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={{
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          image: currentImage,
          price: displayPrice,
          fuel: vehicle.fuel
        }}
      />
    </div>
  );
};
