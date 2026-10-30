import React from 'react';
import { Phone, Mail, MapPin, Lock, ArrowUpRight } from 'lucide-react';
import { DEALERSHIP_CONFIG } from '../config/dealership';
import { Link } from '../router/Router';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0b0c] text-white border-t border-zinc-800/80 py-6 sm:py-8 text-xs transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Main compact row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/60">
          
          {/* Brand & Address */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src="/public/assets/aistudio/image_150e736b.png"
                alt="IPM Motors"
                className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col text-left">
                <span className="font-heading font-bold text-base leading-none tracking-tight">
                  IPM <span className="text-[#e10600]">MOTORS</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase text-zinc-400 font-mono">
                  Cocody Riviera Bonoumin
                </span>
              </div>
            </Link>

            <div className="h-6 w-px bg-zinc-800 hidden sm:block mx-1" />

            <div className="text-zinc-400 font-light flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e10600] shrink-0" />
                {DEALERSHIP_CONFIG.neighborhood}, {DEALERSHIP_CONFIG.city}
              </span>
              <a
                href={`tel:${DEALERSHIP_CONFIG.phone}`}
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#e10600] shrink-0" />
                {DEALERSHIP_CONFIG.phoneDisplay}
              </a>
              <a
                href={DEALERSHIP_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#e10600] hover:underline"
              >
                <span>Plan d'accès</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links inline */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-400 font-medium">
            <Link to="/modeles" className="hover:text-white transition-colors">
              Modèles 0 km
            </Link>
            <Link to="/offres" className="hover:text-white transition-colors">
              Offres Exclusives
            </Link>
            <Link to="/apres-vente" className="hover:text-white transition-colors">
              Garantie & SAV
            </Link>
            <Link to="/actualites" className="hover:text-white transition-colors">
              Actualités
            </Link>
            <Link to="/a-propos" className="hover:text-white transition-colors">
              À Propos
            </Link>
          </nav>
        </div>

        {/* Bottom subtle copyright & admin access */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>
            © {new Date().getFullYear()} {DEALERSHIP_CONFIG.fullName}. Véhicules 100% neufs 0 km à Abidjan.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Administration</span>
          </Link>
        </div>

      </div>
    </footer>
  );
};
