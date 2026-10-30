import React from 'react';
import { MapPin, Clock, Phone, Navigation, ShieldCheck, Calendar } from 'lucide-react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../../config/dealership';
import { ResponsiveModal } from '../ui/ResponsiveModal';

interface ShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowroomModal: React.FC<ShowroomModalProps> = ({ isOpen, onClose }) => {
  const handleBookVisit = () => {
    const waUrl = buildWhatsAppUrl(
      'Bonjour IPM Motors, je souhaite réserver une visite VIP du parc automobile de Cocody Riviera Bonoumin pour découvrir vos véhicules 0 km en exposition.'
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Parc Automobile Privé Cocody Riviera"
      title="Le prestige automobile au cœur d'Abidjan"
      subtitle={`${DEALERSHIP_CONFIG.address}, ${DEALERSHIP_CONFIG.neighborhood}, ${DEALERSHIP_CONFIG.city}`}
      icon={<MapPin className="w-5 h-5 text-[#E10600]" />}
      maxWidth="2xl"
      footer={
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={DEALERSHIP_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#E10600]" />
            <span>Itinéraire Google Maps</span>
          </a>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone}`}
              className="w-full sm:w-auto px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#E10600]" />
              <span>{DEALERSHIP_CONFIG.phoneDisplay}</span>
            </a>
            <button
              onClick={handleBookVisit}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E10600]/25 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Réserver une visite VIP</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Real photo of the IPM Motors Cocody Fleet */}
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video bg-zinc-900">
          <img
            src="/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg"
            alt="Flotte et Parc Automobile IPM Motors Cocody Riviera"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
            <div className="text-xs text-white/95 font-medium">
              Parc d'exposition officiel IPM Motors — Véhicules neufs 0 km prêts pour livraison
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E10600]">
              <Clock className="w-4 h-4" />
              <span>Horaires d'ouverture</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <strong>Lundi au Vendredi :</strong> 08h00 – 18h30<br />
              <strong>Samedi :</strong> 09h00 – 17h00<br />
              <strong>Dimanche :</strong> Sur rendez-vous VIP
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E10600]">
              <ShieldCheck className="w-4 h-4" />
              <span>Services exclusifs sur place</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              • Accueil personnalisé & conseiller dédié<br />
              • Salon VIP d'échange & configuration<br />
              • Inspection technique 360° du véhicule 0 km<br />
              • Gestion administrative & plaques express
            </p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
};
