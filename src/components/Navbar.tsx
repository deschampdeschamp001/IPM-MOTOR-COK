import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Phone, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link, useRouter } from '../router/Router';
import { DEALERSHIP_CONFIG } from '../config/dealership';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { pathname } = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Modèles', href: '/modeles' },
    { label: 'Offres', href: '/offres' },
    { label: 'Services', href: '/apres-vente' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'À propos', href: '/a-propos' },
  ];

  return (
    <>
      {/* Barre de navigation FIXE et TOUJOURS PRÉSENTE */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0b0b0c]/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xs py-2.5 sm:py-3 transition-colors duration-200"
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto">
          <div className="flex items-center justify-between h-12">
            
            {/* 1. GAUCHE : Liens de navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-start">
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

            {/* Mobile Burger (Gauche sur mobile) */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
                className="p-2 -ml-2 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* 2. MILIEU : Logo IPM Motors SANS AUCUN ROND AUTOUR */}
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

            {/* 3. DROITE : Contact Téléphone + Inversion Thème + Bouton Se connecter */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-5 flex-1">
              {/* Téléphone Dealer : 'Appelez-nous au +225 ...' */}
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
                className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Bouton Se connecter */}
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-950 dark:hover:border-white text-zinc-900 dark:text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                <span>Se connecter</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Drawer Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/70 backdrop-blur-md">
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-[#0e0e11] text-zinc-900 dark:text-white p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/public/assets/aistudio/image_150e736b.png"
                    alt="IPM Motors"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-heading font-medium text-base tracking-wide">
                    IPM <span className="text-[#e10600] font-bold">MOTORS</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-1">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#e10600]/10 text-[#e10600] dark:bg-[#e10600]/20'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <a
                href={`tel:${DEALERSHIP_CONFIG.phone}`}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#e10600]" />
                <span>{DEALERSHIP_CONFIG.phoneDisplay}</span>
              </a>
              <Link
                to="/admin"
                className="w-full py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Se connecter</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
