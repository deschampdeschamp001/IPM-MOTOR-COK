import React from 'react';
import { Link, useRouter } from '../router/Router';
import { Home, Car, ShieldCheck, Newspaper, PhoneCall } from 'lucide-react';

/**
 * Barre de navigation mobile inspirée du Dock iOS
 * Style îlot flottant translucide (glassmorphism blur), ergonomique pour le pouce.
 * Contient exactement 5 éléments :
 * 1. Accueil
 * 2. Nos véhicules (fusion Modèles & Offres)
 * 3. Services (SAV & Garanties)
 * 4. Actualités
 * 5. Contact (fusion À Propos & Contact)
 */
export const MobileBottomNav: React.FC = () => {
  const { pathname } = useRouter();

  const handleNavClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    try {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {}
  };

  const navItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Nos véhicules',
      href: '/vehicules',
      icon: Car,
      isActive: pathname === '/vehicules' || pathname === '/modeles' || pathname === '/offres' || pathname.startsWith('/vehicule/'),
    },
    {
      label: 'Services',
      href: '/apres-vente',
      icon: ShieldCheck,
      isActive: pathname === '/apres-vente',
    },
    {
      label: 'Actualités',
      href: '/actualites',
      icon: Newspaper,
      isActive: pathname.startsWith('/actualites'),
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: PhoneCall,
      isActive: pathname === '/contact' || pathname === '/a-propos',
    },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[420px] max-w-md mx-auto z-50 lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <nav
        aria-label="Barre de navigation dock mobile"
        className="pointer-events-auto w-full px-2 py-1.5 rounded-full bg-white/90 dark:bg-[#121214]/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.65)] flex items-center justify-between gap-1 transition-all duration-300"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavClick}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-full transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer group ${
                item.isActive
                  ? 'bg-[#e10600] text-white shadow-[0_4px_14px_rgba(225,6,0,0.35)]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {/* Icône avec animation fluide */}
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    item.isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.9] group-hover:scale-105'
                  }`}
                />
              </div>

              {/* Libellé typographie épurée */}
              <span
                className={`text-[9px] sm:text-[10px] tracking-tight mt-0.5 leading-none transition-colors truncate max-w-full ${
                  item.isActive ? 'font-bold text-white' : 'font-normal'
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
