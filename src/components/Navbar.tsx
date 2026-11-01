import React, { useState, useEffect } from 'react';
import { Sun, Moon, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link, useRouter } from '../router/Router';
import { DEALERSHIP_CONFIG } from '../config/dealership';

export const Navbar: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const { pathname } = useRouter();

  const getPageTitle = (path: string) => {
    if (path === '/') return 'IPM MOTORS';
    if (path === '/vehicules' || path === '/modeles' || path === '/offres' || path.startsWith('/vehicule/')) return 'Nos Véhicules';
    if (path === '/apres-vente') return 'Services & SAV';
    if (path.startsWith('/actualites')) return 'Actualités';
    if (path === '/contact' || path === '/a-propos') return 'Contact & À Propos';
    if (path === '/admin') return 'Administration';
    return 'IPM MOTORS';
  };

  const navLinks = [
    { label: 'Modèles', href: '/modeles' },
    { label: 'Offres', href: '/offres' },
    { label: 'Services', href: '/apres-vente' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'À propos', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0b0b0c]/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xs py-2 sm:py-2.5 transition-colors duration-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto">
        
        {/* VUE MOBILE & TABLETTE (< lg) : Titre de la page à gauche + Theme et Avatar Google profil rond à droite */}
        <div className="flex lg:hidden items-center justify-between h-11">
          {/* Titre dynamique de la page à gauche */}
          <div className="flex items-center min-w-0 pr-2">
            <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-zinc-950 dark:text-white truncate">
              {getPageTitle(pathname)}
            </span>
          </div>

          {/* Droite : Bouton Inversion Thème + Bouton Se connecter rond profil Google standard */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Bouton changement thème */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Changer de thème clair/sombre"
              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bouton rond profil utilisateur standard Google sans PNG */}
            <Link
              to="/admin"
              aria-label="Connexion / Mon compte"
              title="Espace administration / Connexion"
              className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-white hover:bg-[#e10600] dark:hover:bg-[#e10600] flex items-center justify-center transition-all duration-200 shadow-2xs border border-zinc-300 dark:border-zinc-700 overflow-hidden shrink-0 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 translate-y-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* VUE DESKTOP (lg+) : Menu standard élégant */}
        <div className="hidden lg:flex items-center justify-between h-12">
          {/* Liens de navigation */}
          <nav className="flex items-center gap-6 xl:gap-8 flex-1 justify-start">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-xs xl:text-sm tracking-wide transition-colors relative py-1.5 ${
                    isActive
                      ? 'text-zinc-950 dark:text-white font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e10600]'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-normal'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logo IPM Motors */}
          <div className="flex items-center justify-center shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group focus:outline-none" aria-label="IPM Motors Accueil">
              <img
                src="/public/assets/aistudio/image_150e736b.png"
                alt="IPM Motors"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col items-start">
                <span className="font-heading font-medium tracking-wider text-sm sm:text-base leading-none text-zinc-950 dark:text-white">
                  IPM <span className="text-[#e10600] font-bold">MOTORS</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase font-mono mt-0.5 text-zinc-500 dark:text-zinc-400">
                  ABIDJAN
                </span>
              </div>
            </Link>
          </div>

          {/* Droite : Téléphone + Thème + Profil */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-5 flex-1">
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone}`}
              className="hidden md:flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 hover:text-[#e10600] dark:hover:text-[#e10600] transition-colors"
              title="Appeler le parc automobile IPM Motors"
            >
              <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0 transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase font-mono text-zinc-500 dark:text-zinc-400">
                  Appelez-nous au
                </span>
                <span className="font-semibold text-xs tracking-tight text-zinc-900 dark:text-white">
                  {DEALERSHIP_CONFIG.phoneDisplay}
                </span>
              </div>
            </a>

            {/* Bouton Inversion de thème */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Changer de thème clair/sombre"
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bouton rond profil Google standard */}
            <Link
              to="/admin"
              aria-label="Connexion / Mon compte"
              title="Espace administration / Connexion"
              className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-white hover:bg-[#e10600] dark:hover:bg-[#e10600] flex items-center justify-center transition-all duration-200 shadow-2xs border border-zinc-300 dark:border-zinc-700 overflow-hidden shrink-0 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 translate-y-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};
