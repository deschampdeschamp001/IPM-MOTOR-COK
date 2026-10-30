import React, { useState } from 'react';
import { ArrowRight, SlidersHorizontal, MapPin, MessageSquare, Car } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CustomOrderModal } from './modals/CustomOrderModal';
import { ShowroomModal } from './modals/ShowroomModal';
import { VIPContactModal } from './modals/VIPContactModal';

interface QuickServicesSectionProps {
  onExploreStock?: () => void;
}

export const QuickServicesSection: React.FC<QuickServicesSectionProps> = ({ onExploreStock }) => {
  const { isDark } = useTheme();

  // Modals state
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleStockClick = () => {
    if (onExploreStock) {
      onExploreStock();
    } else {
      const el = document.getElementById('catalogue');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const blocks = [
    {
      id: 'stock',
      kicker: 'COLLECTION 0 KM',
      title: 'VÉHICULES EN STOCK',
      subtitle: 'Disponibilité immédiate au parc automobile de Cocody.',
      cta: 'DÉCOUVRIR LE STOCK',
      image: '/src/assets/images/hero_dealership_car_1793116464643.jpg',
      onClick: handleStockClick,
    },
    {
      id: 'custom',
      kicker: 'ATELIER & IMPORT',
      title: 'COMMANDE SUR-MESURE',
      subtitle: 'Configurez la marque, le modèle et les options de vos rêves.',
      cta: 'CONFIGURER',
      image: '/src/assets/images/car_byd_seal_1793116465632.jpg',
      onClick: () => setIsCustomOrderOpen(true),
    },
    {
      id: 'showroom',
      kicker: 'ESPACE PRIVILÈGE',
      title: 'NOTRE PARC AUTOMOBILE',
      subtitle: 'Riviera Bonoumin : un cadre d’exception pour vous accueillir.',
      cta: 'VISITER',
      image: '/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
      onClick: () => setIsShowroomOpen(true),
    },
    {
      id: 'contact',
      kicker: 'SERVICE CLIENTÈLE',
      title: 'CONSEIL & DEVIS EXPRESS',
      subtitle: 'Un conseiller privé à votre écoute en direct.',
      cta: 'CONTACTER',
      image: '/src/assets/images/car_mercedes_sedan_1793116467102.jpg',
      onClick: () => setIsContactOpen(true),
    },
  ];

  return (
    <>
      <section
        id="services-rapides"
        className={`py-8 sm:py-10 border-b transition-colors duration-300 ${
          isDark ? 'bg-[#0A0A0A] border-[#1F1F1F]' : 'bg-[#F4F4F5] border-neutral-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header discret et compact */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#E10600]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-[#E10600]">
                Expérience & Services IPM Motors
              </span>
            </div>
            <span className={`text-[11px] hidden sm:block ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Cliquez sur un univers pour ouvrir l'espace dédié
            </span>
          </div>

          {/* 4 Bloc Editorial Grid - Inspired by Luxury Automotive (Ferrari style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {blocks.map((block) => (
              <button
                key={block.id}
                type="button"
                onClick={block.onClick}
                aria-label={`Accéder à : ${block.title}`}
                className="group relative h-48 sm:h-56 lg:h-60 w-full rounded-xl overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] border border-white/10 shadow-md cursor-pointer transition-transform duration-300 active:scale-[0.99]"
              >
                {/* Background Image: Default Grayscale -> Hover Full Color & 4% Zoom */}
                <div className="absolute inset-0 overflow-hidden bg-black">
                  <img
                    src={block.image}
                    alt={block.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  {/* Luxury Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 group-hover:from-black/90 group-hover:via-black/45 transition-colors duration-500" />
                </div>

                {/* Subtle top indicator on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#E10600] transition-colors duration-300" />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-white z-10">
                  {/* Top: Category Kicker */}
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-300 group-hover:text-[#E10600] transition-colors">
                      {block.kicker}
                    </span>
                  </div>

                  {/* Bottom: Title, Short Subtitle & Discrete Discovery Arrow */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-snug uppercase group-hover:text-white">
                      {block.title}
                    </h3>
                    <p className="text-[11px] text-neutral-300/90 font-normal line-clamp-1 group-hover:text-white transition-colors">
                      {block.subtitle}
                    </p>

                    {/* Pill Action Button */}
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 group-hover:border-[#E10600] group-hover:bg-[#E10600] px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300">
                        <span>{block.cta}</span>
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Destination Modals */}
      <CustomOrderModal
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
      />

      <ShowroomModal
        isOpen={isShowroomOpen}
        onClose={() => setIsShowroomOpen(false)}
      />

      <VIPContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
};
