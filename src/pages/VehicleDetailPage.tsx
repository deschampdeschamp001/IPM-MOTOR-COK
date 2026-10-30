import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../router/Router';
import { useData } from '../context/DataContext';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import { VehicleCard } from '../components/VehicleCard';
import { getVehiclePriceInfo } from '../lib/priceUtils';
import {
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  Users,
  MessageCircle,
  Phone,
  FileText,
  CheckCircle2,
  Share2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams();
  const { getVehicleById, vehicles } = useData();

  const vehicle = getVehicleById(id || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

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
          className="pill-btn px-6 py-3 bg-[#e10600] text-white text-xs font-semibold inline-flex items-center gap-2"
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

  const waMessage = `Bonjour IPM Motors, je suis intéressé par le véhicule 100% neuf 0 km suivant :\n- Marque & Modèle : ${vehicle.brand} ${vehicle.model}\n- Année : ${vehicle.year}\n- Énergie : ${vehicle.fuel}\nMerci de me communiquer les conditions et disponibilités.`;
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
    <div className="pt-24 sm:pt-32 pb-24 max-w-[1550px] mx-auto px-8 sm:px-14 md:px-18 lg:px-24 xl:px-32 2xl:px-44">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6b6b72] mb-6 font-mono">
        <Link to="/" className="hover:text-[var(--fg)]">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/modeles" className="hover:text-[var(--fg)]">Modèles</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/modeles?marque=${encodeURIComponent(vehicle.brand)}`} className="hover:text-[var(--fg)]">
          {vehicle.brand}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--fg)] font-semibold truncate max-w-[180px]">{vehicle.model}</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Column: Gallery & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Photo */}
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-zinc-950 border border-[var(--border)] shadow-xl">
            <img
              src={currentImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
              }}
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                0 KM D’ORIGINE • 100% NEUF
              </span>
            </div>
            <button
              onClick={handleShare}
              aria-label="Partager ce véhicule"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                Lien copié dans le presse-papier !
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[16/10] w-24 sm:w-28 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#e10600] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Description */}
          <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] space-y-4">
            <h2 className="font-heading font-medium text-xl">Description & Présentation</h2>
            <p className="text-sm sm:text-base text-[#6b6b72] leading-relaxed font-light whitespace-pre-line">
              {vehicle.description || 'Véhicule neuf 0 km sous garantie constructeur intégrale. Prêt pour livraison immédiate dans notre parc automobile de Cocody Riviera Bonoumin.'}
            </p>

            <div className="pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">0 Kilomètre garanti</h4>
                  <p className="text-xs text-[#6b6b72] font-light">Véhicule sorti d'usine sans aucun kilométrage d'usage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Garantie Constructeur</h4>
                  <p className="text-xs text-[#6b6b72] font-light">Valide chez les concessionnaires agréés avec carnet certifié.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Action Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl space-y-6">
            <div>
              <span className="eyebrow block mb-1">{vehicle.brand}</span>
              <h1 className="font-heading font-light text-2xl sm:text-3xl leading-tight">
                {vehicle.model}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#6b6b72]">
                <span>{vehicle.type}</span>
                <span>•</span>
                <span>Année {vehicle.year}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[10px] uppercase tracking-wider text-[#6b6b72] block font-semibold">
                Prix Parc Automobile IPM Motors
              </span>
              <span className="font-heading font-semibold text-2xl sm:text-3xl text-[var(--fg)] mt-1 block">
                {displayPrice}
              </span>
              <span className="text-[11px] text-[#6b6b72] block mt-1">
                TVA, dédouanement et formalités ivoiriennes inclus
              </span>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center gap-3">
                <Fuel className="w-4 h-4 text-[#e10600]" />
                <div>
                  <span className="text-[10px] text-[#6b6b72] block">Carburant</span>
                  <span className="font-semibold text-xs truncate max-w-[120px] block">{vehicle.fuel}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center gap-3">
                <Gauge className="w-4 h-4 text-[#e10600]" />
                <div>
                  <span className="text-[10px] text-[#6b6b72] block">Boîte</span>
                  <span className="font-semibold text-xs truncate max-w-[120px] block">{vehicle.transmission}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#e10600]" />
                <div>
                  <span className="text-[10px] text-[#6b6b72] block">Année</span>
                  <span className="font-semibold text-xs block">{vehicle.year}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center gap-3">
                <Users className="w-4 h-4 text-[#e10600]" />
                <div>
                  <span className="text-[10px] text-[#6b6b72] block">Places</span>
                  <span className="font-semibold text-xs block">{vehicle.seats || 5} places</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn w-full py-4 bg-[#e10600] hover:bg-[#c30500] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#e10600]/25 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Demander un devis sur WhatsApp</span>
              </a>

              <Link
                to={`/contact?vehicule=${encodeURIComponent(`${vehicle.brand} ${vehicle.model}`)}`}
                className="pill-btn w-full py-3.5 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--fg)] text-xs font-semibold flex items-center justify-center gap-2 border border-[var(--border)] transition-all"
              >
                <FileText className="w-4 h-4 text-[#6b6b72]" />
                <span>Formulaire de devis express</span>
              </Link>

              <a
                href={`tel:${DEALERSHIP_CONFIG.phone}`}
                className="w-full py-2.5 text-center text-xs font-medium text-[#6b6b72] hover:text-[#0b0b0c] dark:hover:text-white flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#e10600]" />
                <span>Ou appelez au {DEALERSHIP_CONFIG.phoneDisplay}</span>
              </a>
            </div>

            {/* Showroom location guarantee */}
            <div className="pt-4 border-t border-[var(--border)] text-[11px] text-[#6b6b72] flex items-center gap-2 font-light">
              <ShieldCheck className="w-4 h-4 text-[#e10600] shrink-0" />
              <span>Visible et disponible à Cocody Riviera Bonoumin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vehicles Carousel / Grid */}
      {similarVehicles.length > 0 && (
        <div className="mt-24 pt-16 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="eyebrow block mb-1">Suggestions</span>
              <h3 className="font-heading font-light text-2xl sm:text-3xl">
                Vous aimerez <span className="font-semibold">aussi</span>
              </h3>
            </div>
            <Link to="/modeles" className="text-xs text-[#e10600] font-semibold hover:underline">
              Voir tout le catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map(v => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
