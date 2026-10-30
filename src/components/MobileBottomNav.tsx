import React from 'react';
import { Link, useRouter } from '../router/Router';
import { Home, Car, Tag, ShieldCheck, PhoneCall } from 'lucide-react';

/**
 * Barre de navigation mobile inspirée du Dock iOS
 * Style îlot flottant translucide (glassmorphism blur), ergonomique pour le pouce,
 * optimisé pour iPhone, Android, tablettes et PWA responsive.
 */
export const MobileBottomNav: React.FC = () => {
  const { pathname } = useRouter();

  const navItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: Home,
      exact: true,
    },
    {
      label: 'Modèles',
      href: '/modeles',
      icon: Car,
      exact: false,
    },
    {
      label: 'Offres',
      href: '/offres',
      icon: Tag,
      badge: '0 KM',
      exact: false,
    },
    {
      label: 'Garantie',
      href: '/apres-vente',
      icon: ShieldCheck,
      exact: false,
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: PhoneCall,
      exact: false,
    },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[420px] max-w-md mx-auto z-50 lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <nav
        aria-label="Barre de navigation dock iOS"
        className="pointer-events-auto w-full px-2 py-1.5 rounded-full bg-white/85 dark:bg-[#121214]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.65)] flex items-center justify-between gap-1 transition-all duration-300"
      >
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-full transition-all duration-200 active:scale-90 touch-manipulation cursor-pointer group ${
                isActive
                  ? 'bg-[#e10600] text-white shadow-[0_4px_14px_rgba(225,6,0,0.35)]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {/* Badge supérieur pour les offres */}
              {item.badge && !isActive && (
                <span className="absolute -top-1 right-2 px-1 py-0.2 rounded-full bg-[#e10600] text-[8px] font-bold text-white tracking-tighter uppercase leading-none shadow-xs">
                  {item.badge}
                </span>
              )}

              {/* Icône avec animation fluide */}
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.9] group-hover:scale-105'
                  }`}
                />
              </div>

              {/* Libellé typographie iOS épurée */}
              <span
                className={`text-[9px] sm:text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
                  isActive ? 'font-bold text-white' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
