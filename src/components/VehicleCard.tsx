import React from 'react';
import { Vehicle } from '../types';
import { Link } from '../router/Router';
import { buildVehicleWhatsAppUrl } from '../config/dealership';
import { getVehiclePriceInfo } from '../lib/priceUtils';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.16 12.04 20.16C10.61 20.16 9.21 19.78 7.99 19.06L7.7 18.89L4.58 19.71L5.41 16.67L5.22 16.37C4.43 15.11 4.02 13.53 4.02 11.91C4.02 7.37 7.71 3.67 12.04 3.67ZM8.82 7.42C8.61 7.42 8.41 7.43 8.24 7.46C8.01 7.5 7.68 7.6 7.46 8.09C7.21 8.64 6.54 9.27 6.54 10.53C6.54 11.79 7.46 13.01 7.59 13.18C7.72 13.35 9.38 15.91 11.92 17.01C14.03 17.92 14.46 17.74 14.93 17.7C15.4 17.65 16.44 17.08 16.65 16.49C16.86 15.9 16.86 15.4 16.8 15.29C16.74 15.19 16.57 15.13 16.32 15C16.07 14.88 14.84 14.28 14.61 14.2C14.38 14.12 14.21 14.07 14.04 14.32C13.88 14.57 13.39 15.15 13.24 15.31C13.1 15.48 12.95 15.5 12.7 15.37C12.45 15.25 11.65 14.99 10.7 14.14C9.96 13.48 9.46 12.67 9.32 12.42C9.17 12.17 9.31 12.04 9.43 11.91C9.54 11.8 9.68 11.62 9.81 11.47C9.93 11.33 9.97 11.22 10.05 11.06C10.14 10.89 10.09 10.75 10.03 10.62C9.97 10.5 9.49 9.31 9.28 8.82C9.09 8.34 8.89 8.41 8.74 8.4C8.59 8.4 8.42 8.4 8.24 8.4L8.82 7.42Z"
    />
  </svg>
);

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const mainImage = vehicle.images?.[0] || '/assets/cars/hero_dealership_car_1793116464643.jpg';
  const priceInfo = getVehiclePriceInfo(vehicle);
  const waVehicleUrl = buildVehicleWhatsAppUrl(vehicle);

  return (
    <article className="group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141416] border border-zinc-200/90 dark:border-zinc-800 p-3.5 sm:p-5 lg:p-6 flex flex-col items-center text-center justify-between min-h-[340px] sm:min-h-[390px] transition-all duration-300 shadow-2xs hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* 1. Header du bloc : Marque, Modèle en sans-serif élégant, Badges sans bleu */}
      <div className="w-full flex flex-col items-center">
        {/* Marque */}
        <span className="font-heading text-[10px] sm:text-xs tracking-wider uppercase text-zinc-500 font-semibold mb-0.5">
          {vehicle.brand}
        </span>

        {/* Titre du modèle */}
        <Link to={`/vehicule/${vehicle.id}`} className="focus:outline-none block w-full">
          <h3 className="font-heading font-bold text-sm sm:text-base lg:text-lg text-zinc-950 dark:text-white leading-tight line-clamp-1 mb-1.5 tracking-tight hover:text-[#e10600] transition-colors">
            {vehicle.model}
          </h3>
        </Link>

        {/* Badges horizontaux centrés */}
        <div className="flex flex-wrap items-center justify-center gap-1 mb-1.5">
          <span className="bg-[#e10600] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
            0 km
          </span>
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">
            {vehicle.fuel || vehicle.type}
          </span>
          {vehicle.year && (
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700 text-[9px] font-mono px-1.5 py-0.5 rounded">
              {vehicle.year}
            </span>
          )}
        </div>
      </div>

      {/* 2. Photo du véhicule centrée */}
      <Link
        to={`/vehicule/${vehicle.id}`}
        className="w-full my-2 flex-1 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="w-full h-28 sm:h-36 lg:h-40 flex items-center justify-center">
          <img
            src={mainImage}
            alt={`${vehicle.brand} ${vehicle.model} 0 km`}
            loading="lazy"
            className="max-h-full max-w-full object-contain filter drop-shadow-sm"
            onError={(e) => {
              e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
            }}
          />
        </div>
      </Link>

      {/* 3. Zone inférieure : Prix + Boutons d'action */}
      <div className="w-full mt-1 pt-1.5 flex flex-col items-center">
        {/* Prix toujours affiché au centre */}
        <div className="mb-2 text-center">
          <span className="text-[10px] text-zinc-500 font-light block leading-none mb-0.5">
            à partir de
          </span>
          <span className="font-heading font-bold text-sm sm:text-base lg:text-lg text-zinc-950 dark:text-white tracking-tight">
            {priceInfo.displayPrice}
          </span>
        </div>

        {/* Bloc d'actions : Bouton En savoir plus + WhatsApp */}
        <div className="w-full flex items-center justify-center gap-1.5 pt-1">
          <Link
            to={`/vehicule/${vehicle.id}`}
            className="flex-1 py-1.5 sm:py-2 px-3 bg-[#e10600] hover:bg-[#c30500] text-white text-[11px] sm:text-xs font-semibold rounded-full flex items-center justify-center transition-all shadow-xs"
          >
            <span>Détails</span>
          </Link>

          <a
            href={waVehicleUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Acheter ou commander ${vehicle.brand} ${vehicle.model} sur WhatsApp`}
            title="Contacter par WhatsApp avec les détails de ce modèle"
            className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-all shadow-md hover:scale-105 shrink-0"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
          </a>
        </div>
      </div>
    </article>
  );
};
