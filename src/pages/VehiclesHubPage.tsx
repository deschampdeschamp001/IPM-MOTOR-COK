import React, { useState, useEffect } from 'react';
import { useSearchParams } from '../router/Router';
import { ModelsPage } from './ModelsPage';
import { OffersPage } from './OffersPage';
import { Car, Tag } from 'lucide-react';

export const VehiclesHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'offres' ? 'offres' : 'modeles';
  const [activeTab, setActiveTab] = useState<'modeles' | 'offres'>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'offres' && activeTab !== 'offres') {
      setActiveTab('offres');
    } else if (tabFromUrl === 'modeles' && activeTab !== 'modeles') {
      setActiveTab('modeles');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'modeles' | 'offres') => {
    setActiveTab(tab);
    const updated = new URLSearchParams(searchParams);
    updated.set('tab', tab);
    setSearchParams(updated);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] pt-14 sm:pt-16">
      {/* Sélecteur segmenté en haut : Nos Modèles à gauche | Nos Offres à droite (Bien calé sous la barre fixe z-30 sans chevauchement) */}
      <div className="py-2.5 sm:py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md sticky top-14 sm:top-14 z-30 shadow-2xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 flex items-center justify-center">
          <div className="inline-flex p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs max-w-md w-full">
            {/* Bouton gauche : Nos Modèles */}
            <button
              type="button"
              onClick={() => handleTabChange('modeles')}
              className={`flex-1 py-2 sm:py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'modeles'
                  ? 'bg-[#e10600] text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Nos Modèles</span>
            </button>

            {/* Bouton droite : Nos Offres */}
            <button
              type="button"
              onClick={() => handleTabChange('offres')}
              className={`flex-1 py-2 sm:py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'offres'
                  ? 'bg-[#e10600] text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Nos Offres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu de la section active */}
      <div className="flex-1">
        {activeTab === 'modeles' ? <ModelsPage /> : <OffersPage />}
      </div>
    </div>
  );
};
