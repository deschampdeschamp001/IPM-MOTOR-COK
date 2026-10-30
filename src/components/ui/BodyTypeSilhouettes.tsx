import React from 'react';
import { Link } from '../../router/Router';

// High-resolution realistic vehicle body types generated for IPM Motors
import suvImg from '../../assets/images/bodytype_suv_1793375545619.jpg';
import berlineImg from '../../assets/images/bodytype_berline_1793375565953.jpg';
import pickupImg from '../../assets/images/bodytype_pickup_1793375584946.jpg';
import citadineImg from '../../assets/images/bodytype_citadine_1793375603264.jpg';
import fourByFourImg from '../../assets/images/bodytype_4x4_1793375622287.jpg';
import electriqueImg from '../../assets/images/bodytype_electrique_1793375642616.jpg';

export interface BodyTypeItem {
  id: string;
  name: string;
  label: string;
  sublabel: string;
  image: string;
}

export const BODY_TYPES: BodyTypeItem[] = [
  {
    id: '4x4',
    name: '4X4',
    label: '4X4 BAROUDEUR',
    sublabel: 'Tout-terrain & Expédition',
    image: fourByFourImg,
  },
  {
    id: 'Berline',
    name: 'BERLINE',
    label: 'BERLINE DE PRESTIGE',
    sublabel: 'Élégance & Confort VIP',
    image: berlineImg,
  },
  {
    id: 'SUV',
    name: 'SUV',
    label: 'SUV & CROSSOVER',
    sublabel: 'Familial & Grand Espace',
    image: suvImg,
  },
  {
    id: 'Pick-up',
    name: 'PICK-UP',
    label: 'PICK-UP DOUBLE CABINE',
    sublabel: 'Puissance & Charge utile',
    image: pickupImg,
  },
  {
    id: 'Citadine',
    name: 'COMPACT',
    label: 'CITADINE & COMPACT',
    sublabel: 'Agilité urbaine à Abidjan',
    image: citadineImg,
  },
  {
    id: 'Électrique',
    name: 'ÉLECTRIQUE',
    label: '100% ÉLECTRIQUE',
    sublabel: 'Innovation & 0 Émission',
    image: electriqueImg,
  },
];

interface BodyTypeSilhouettesProps {
  activeType?: string;
  onSelect?: (type: string) => void;
}

export const BodyTypeSilhouettes: React.FC<BodyTypeSilhouettesProps> = ({
  activeType,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {BODY_TYPES.map((item) => {
        const isSelected = activeType?.toLowerCase() === item.id.toLowerCase();

        return (
          <Link
            key={item.id}
            to={`/modeles?type=${encodeURIComponent(item.id)}`}
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(item.id);
              }
            }}
            className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#141416] border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden ${
              isSelected
                ? 'border-[#e10600] ring-2 ring-[#e10600]/20 shadow-md'
                : 'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {/* Visual vehicle container with soft ambient glow */}
            <div className="relative w-full aspect-[16/10] flex items-center justify-center mb-2 overflow-hidden">
              {/* Subtle halo matching Image 3 style */}
              <div className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-blue-50/70 dark:bg-zinc-800/60 blur-xs -z-0 group-hover:scale-110 transition-transform duration-500" />
              
              <img
                src={item.image}
                alt={`${item.name} 0 km IPM Motors`}
                className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
              />
            </div>

            {/* Label & category name */}
            <div className="w-full text-center z-10 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-zinc-950 dark:text-white block group-hover:text-[#e10600] transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-light truncate block mt-0.5">
                {item.sublabel}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
