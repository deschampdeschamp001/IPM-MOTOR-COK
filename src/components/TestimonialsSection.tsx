import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { getTestimonials, subscribeToTestimonials, TestimonialItem } from '../lib/testimonialsStorage';

export const TestimonialsSection: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(() => getTestimonials());
  const [startIndex, setStartIndex] = useState(0);

  React.useEffect(() => {
    const unsub = subscribeToTestimonials((updated) => {
      setItems(updated);
    });
    return unsub;
  }, []);

  const maxVisible = 3;
  const canGoNext = startIndex + maxVisible < items.length;
  const canGoPrev = startIndex > 0;

  const handleNext = () => {
    if (canGoNext) setStartIndex((prev) => prev + 1);
    else setStartIndex(0);
  };

  const handlePrev = () => {
    if (canGoPrev) setStartIndex((prev) => prev - 1);
    else setStartIndex(Math.max(0, items.length - maxVisible));
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FAFAFA] dark:bg-[#0c0c0e] border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Colonne gauche : Titre, sous-titre et badges Google / Facebook */}
          <div className="lg:col-span-4 space-y-4">
            <div className="w-10 h-1 bg-[#1565C0] rounded-full" />

            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-zinc-950 dark:text-white tracking-tight leading-snug">
                Clients heureux, nous aussi !
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 font-light leading-relaxed">
                Vous pouvez nous faire confiance, comme ces clients déjà heureux !
              </p>
            </div>

            {/* Badges Google & Facebook compacts */}
            <div className="pt-1 flex flex-row lg:flex-col gap-4 lg:gap-2.5">
              {/* Google */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 shadow-xs flex items-center justify-center p-1 shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Google</span>
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-white">4.8</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1877F2] shadow-xs flex items-center justify-center p-1 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Facebook</span>
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-white">4.8</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite : Slider horizontal parallax sur Mobile/Tablette, grille 3 sur Desktop */}
          <div className="lg:col-span-8 relative">
            {/* Mobile / Tablette : Défilement horizontal fluide de gauche à droite (Parallax minimaliste) */}
            <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 scrollbar-none -mx-4 px-4">
              {items.map((item: TestimonialItem) => (
                <div
                  key={item.id}
                  className="w-[240px] sm:w-[270px] shrink-0 snap-start bg-white dark:bg-[#141416] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Client ${item.name} IPM Motors`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 font-light leading-relaxed line-clamp-3">
                      {item.comment}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-700 dark:text-zinc-200 shrink-0">
                        {item.avatarText}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-zinc-900 dark:text-white block truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-light block">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop : Grille 3 blocs avec flèche de navigation */}
            <div className="hidden lg:grid grid-cols-3 gap-4">
              {items.slice(startIndex, startIndex + maxVisible).map((item: TestimonialItem) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#141416] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Client ${item.name} IPM Motors`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 font-light leading-relaxed line-clamp-3">
                      {item.comment}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-700 dark:text-zinc-200 shrink-0">
                        {item.avatarText}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-light block">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton flèche navigation circulaire droite desktop */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Témoignage suivant"
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-zinc-800 dark:text-white items-center justify-center hover:bg-[#e10600] hover:text-white transition-colors cursor-pointer z-10 hidden lg:flex"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
