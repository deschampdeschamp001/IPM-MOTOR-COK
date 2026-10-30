import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Retour en haut"
      className={`fixed bottom-36 lg:bottom-24 right-4 sm:right-6 z-40 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Remonter en haut de la page"
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E10600] ${
          isDark
            ? 'bg-[#141414]/90 hover:bg-[#E10600] text-white border border-[#2A2A2A] hover:border-[#E10600] backdrop-blur-md'
            : 'bg-white/95 hover:bg-[#E10600] text-[#0A0A0A] hover:text-white border border-gray-200 hover:border-[#E10600] backdrop-blur-md shadow-lg'
        }`}
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Desktop Tooltip */}
        <span
          className={`hidden sm:block absolute right-14 px-2.5 py-1 text-[11px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md ${
            isDark
              ? 'bg-[#0A0A0A] text-white border border-[#2A2A2A]'
              : 'bg-white text-[#0A0A0A] border border-gray-200'
          }`}
        >
          Haut de page
        </span>
      </button>
    </aside>
  );
};
