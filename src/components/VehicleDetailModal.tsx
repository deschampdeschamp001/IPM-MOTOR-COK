import React, { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, Calendar, Gauge, Fuel, Users, Cpu, Layers } from 'lucide-react';
import { Vehicle } from '../types';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import { useTheme } from '../context/ThemeContext';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isDark } = useTheme();

  // Reset image index when vehicle changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [vehicle]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (vehicle) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [vehicle, onClose]);

  if (!vehicle) return null;

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['/src/assets/images/hero_dealership_car_1793116464643.jpg'];

  const currentImage = images[selectedImageIndex] || images[0];

  const displayPrice = vehicle.price
    ? new Intl.NumberFormat('fr-FR').format(vehicle.price) + ' FCFA'
    : vehicle.price_label || 'Sur demande';

  const whatsAppMessage = `Bonjour IPM Motors, je souhaite demander un devis pour le véhicule ${vehicle.brand} ${vehicle.model} (${vehicle.year}) disponible dans votre parc automobile à Abidjan.`;
  const whatsAppUrl = buildWhatsAppUrl(whatsAppMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Modal Container: Fullscreen on mobile (h-full), large rounded card on desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-3xl sm:rounded-2xl flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] overflow-hidden shadow-2xl transition-colors ${
          isDark
            ? 'bg-[#111111] text-white border sm:border-neutral-800'
            : 'bg-white text-neutral-900 border sm:border-neutral-200'
        }`}
      >
        {/* Close Button (accessible >= 44x44px touch target) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche véhicule"
          className="absolute top-3 right-3 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/60 hover:bg-[#E10600] text-white rounded-full transition-colors backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6 pb-28 sm:pb-8">
          {/* Main Photo (16:10 ratio) */}
          <div className="space-y-3">
            <div className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <img
                src={currentImage}
                alt={`${vehicle.brand} ${vehicle.model} neuf 0 km`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#E10600] text-white rounded-md shadow-sm">
                  Neuf · 0 km
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails (scrollable on mobile) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 sm:w-20 aspect-[16/10] rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#E10600] scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Aperçu ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="border-b pb-5 dark:border-neutral-800 border-neutral-100">
            <h2 id="vehicle-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {vehicle.brand} {vehicle.model}
            </h2>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-xs uppercase font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Tarif :
              </span>
              <span className="text-xl sm:text-2xl font-bold tabular-nums text-[#E10600]">
                {displayPrice}
              </span>
            </div>
          </div>

          {/* 2-Column Characteristics Grid (Icon + Grey Label + Value) */}
          <div>
            <h3 className={`text-xs uppercase tracking-wider font-semibold mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Caractéristiques
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Année */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <Calendar className="w-5 h-5 text-[#E10600] shrink-0" />
                <div className="overflow-hidden">
                  <div className={`text-[11px] font-medium leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Année</div>
                  <div className="text-sm font-bold tabular-nums mt-1 truncate">{vehicle.year}</div>
                </div>
              </div>

              {/* Boîte */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <Gauge className="w-5 h-5 text-[#E10600] shrink-0" />
                <div className="overflow-hidden">
                  <div className={`text-[11px] font-medium leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Boîte</div>
                  <div className="text-sm font-bold mt-1 truncate">{vehicle.transmission}</div>
                </div>
              </div>

              {/* Carburant */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <Fuel className="w-5 h-5 text-[#E10600] shrink-0" />
                <div className="overflow-hidden">
                  <div className={`text-[11px] font-medium leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Carburant</div>
                  <div className="text-sm font-bold mt-1 truncate">{vehicle.fuel}</div>
                </div>
              </div>

              {/* Moteur */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <Cpu className="w-5 h-5 text-[#E10600] shrink-0" />
                <div className="overflow-hidden">
                  <div className={`text-[11px] font-medium leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Moteur</div>
                  <div className="text-sm font-bold mt-1 truncate">{vehicle.engine || 'D’origine'}</div>
                </div>
              </div>

              {/* Places */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <Users className="w-5 h-5 text-[#E10600] shrink-0" />
                <div className="overflow-hidden">
                  <div className={`text-[11px] font-medium leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Places</div>
                  <div className="text-sm font-bold mt-1 truncate">{vehicle.seats ? `${vehicle.seats} places` : '5 places'}</div>
                </div>
              </div>

              {/* Type */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <Layers className="w-5 h-5 text-[#E10600] shrink-0" />
                <div className="overflow-hidden">
                  <div className={`text-[11px] font-medium leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Type</div>
                  <div className="text-sm font-bold mt-1 truncate">{vehicle.type}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description courte */}
          {vehicle.description && (
            <div>
              <h3 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Description
              </h3>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {vehicle.description}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons: ALWAYS visible on mobile (fixed bottom bar on mobile) */}
        <div
          className={`sticky bottom-0 left-0 right-0 p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-end gap-3 z-10 transition-colors ${
            isDark
              ? 'bg-[#111111]/95 backdrop-blur-md border-neutral-800'
              : 'bg-white/95 backdrop-blur-md border-neutral-200 shadow-lg'
          }`}
        >
          <a
            href={`tel:${DEALERSHIP_CONFIG.phone}`}
            className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'border-neutral-700 hover:border-white text-white hover:bg-neutral-800'
                : 'border-neutral-300 hover:border-black text-black hover:bg-neutral-50'
            }`}
          >
            <Phone className="w-4 h-4 text-[#E10600]" />
            <span>Appeler</span>
          </a>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shadow-[#E10600]/20 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Demander un devis sur WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
