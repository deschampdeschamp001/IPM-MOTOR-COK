import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

import clientManImg from '../assets/images/client_delivery_man_1793375416666.jpg';
import clientCoupleImg from '../assets/images/client_delivery_couple_1793375435524.jpg';
import clientKeysImg from '../assets/images/client_holding_keys_1793375456332.jpg';

interface TestimonialItem {
  id: string;
  name: string;
  date: string;
  comment: string;
  image: string;
  avatarText: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Alain',
    date: 'il y a 6 jours',
    comment: 'Le service client a traité ma demande avec un véritable professionnalisme. Mon véhicule 0 km a été préparé et livré clé en main.',
    image: clientManImg,
    avatarText: 'A',
  },
  {
    id: '2',
    name: 'Monsieur Idrissa',
    date: 'il y a 6 jours',
    comment: 'Je tire mon chapeau à l’équipe qui vient de changer nos habitudes en matière de transactions automobiles pour le mieux !',
    image: clientCoupleImg,
    avatarText: 'MI',
  },
  {
    id: '3',
    name: 'Mme Blédou',
    date: 'il y a 6 jours',
    comment: 'L’entreprise a reçu de nombreux avis positifs. Je suis très satisfaite du travail accompli et du dynamisme de l’équipe.',
    image: clientKeysImg,
    avatarText: 'MB',
  },
  {
    id: '4',
    name: 'Koffi Emmanuel',
    date: 'il y a 2 semaines',
    comment: 'Garantie constructeur confirmée et démarches de carte grise effectuées sans délai. Service impeccable à Bonoumin.',
    image: clientManImg,
    avatarText: 'KE',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const maxVisible = 3;
  const canGoNext = startIndex + maxVisible < TESTIMONIALS.length;
  const canGoPrev = startIndex > 0;

  const handleNext = () => {
    if (canGoNext) setStartIndex(prev => prev + 1);
    else setStartIndex(0);
  };

  const handlePrev = () => {
    if (canGoPrev) setStartIndex(prev => prev - 1);
    else setStartIndex(TESTIMONIALS.length - maxVisible);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAFA] dark:bg-[#0c0c0e] border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Colonne gauche : Titre, sous-titre et badges de notation Google / Facebook (Style Image 2) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Trait d'accentuation bleu */}
            <div className="w-12 h-1 bg-[#1565C0] rounded-full" />

            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-zinc-950 dark:text-white tracking-tight leading-snug">
                Clients heureux, nous aussi !
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-light leading-relaxed">
                Vous pouvez nous faire confiance, comme ces clients déjà heureux !
              </p>
            </div>

            {/* Badges Google & Facebook avec étoiles dorées */}
            <div className="pt-2 space-y-3">
              {/* Google */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-xs flex items-center justify-center p-1.5 shrink-0 border border-zinc-200 dark:border-zinc-700">
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">Google</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">4.8</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1877F2] shadow-xs flex items-center justify-center p-1.5 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">Facebook</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">4.8</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite : Slider horizontal des cartes de témoignages avec photos réelles */}
          <div className="lg:col-span-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {TESTIMONIALS.slice(startIndex, startIndex + maxVisible).map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#141416] rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
                >
                  {/* Photo de livraison du client */}
                  <div className="relative aspect-[16/11] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Client ${item.name} IPM Motors`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Commentaire et identité */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
                      {item.comment}
                    </p>

                    <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-200 shrink-0">
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

            {/* Bouton flèche navigation circulaire droite comme sur Image 2 */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Témoignage suivant"
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg text-zinc-800 dark:text-white flex items-center justify-center hover:bg-[#e10600] hover:text-white transition-colors cursor-pointer z-10 hidden sm:flex"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
