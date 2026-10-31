import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '../router/Router';
import { HeroSlide, getHeroSlides, subscribeToHeroSlides } from '../lib/heroStorage';

export const Hero: React.FC = () => {
  const { navigate } = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>(() => getHeroSlides());
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroQuery, setHeroQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Subscribe to real-time admin slide changes
  useEffect(() => {
    const unsubscribe = subscribeToHeroSlides((updated) => {
      setSlides(updated);
      setCurrent((prev) => (prev >= updated.length ? 0 : prev));
    });
    return () => unsubscribe();
  }, []);

  const totalSlides = slides.length || 1;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((index + totalSlides) % totalSlides);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  }, [isTransitioning, totalSlides]);

  const nextSlide = useCallback(() => {
    goToSlide(current + 1);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(current - 1);
  }, [current, goToSlide]);

  // Automatic carousel slide every 5.5 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = window.setInterval(() => {
      goToSlide(current + 1);
    }, 5500);
    return () => clearInterval(interval);
  }, [current, isPaused, goToSlide, totalSlides]);

  // Touch swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const slide = slides[current] || slides[0] || {
    id: 'default',
    image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
    badge: 'Parc Automobile Riviera Bonoumin • 0 KM',
    title: 'L’Excellence Automobile',
    highlight: 'à votre portée.',
    subtitle: 'Découvrez notre parc exclusif de véhicules neufs 0 km toutes marques, prêts pour livraison immédiate à Abidjan.',
    link: '/modeles'
  };

  return (
    <section
      aria-label="Diaporama principal IPM Motors"
      className="relative min-h-[52vh] sm:min-h-[58vh] lg:min-h-[64vh] flex items-center justify-center overflow-hidden bg-[#09090b] text-white pt-28 sm:pt-36 lg:pt-40 pb-14 sm:pb-16 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Smooth Horizontal Sliding Carousel (Glissement automatique fluide) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slideItem) => (
            <div key={slideItem.id} className="w-full shrink-0 h-full relative overflow-hidden">
              <img
                src={slideItem.image}
                alt={slideItem.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                }}
              />
              {/* Dégradé noir profond et homogène pour lisibilité parfaite des textes et de la barre de recherche */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/55 z-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/50 to-black/40 z-1" />
              <div className="absolute inset-0 bg-black/35 z-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Container (Textes équilibrés, zéro élément superflu) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Dynamic Headline */}
          <h1 className="font-heading font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-2.5 text-white drop-shadow-md">
            {slide.title}{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#e10600]">
              {slide.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-xl mb-5 drop-shadow">
            {slide.subtitle}
          </p>

          {/* Search Bar compacte & élégante : [ Recherchez votre voiture préférée... | CHERCHEUR (Rouge IPM) ] */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (heroQuery.trim()) {
                navigate(`/modeles?q=${encodeURIComponent(heroQuery.trim())}`);
              } else {
                navigate('/modeles');
              }
            }}
            className="w-full max-w-xl bg-white rounded-lg p-1 sm:p-1.5 flex items-center shadow-xl transition-all border border-zinc-200 focus-within:ring-2 focus-within:ring-[#e10600]"
          >
            <Search className="w-4 h-4 text-zinc-400 ml-2 mr-1 shrink-0 hidden sm:block" />
            <input
              type="text"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              placeholder="Recherchez votre voiture préférée"
              className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-500 bg-transparent focus:outline-none font-normal"
            />
            <button
              type="submit"
              className="bg-[#e10600] hover:bg-[#c30500] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-6 py-2 sm:py-2.5 rounded-md transition-colors shrink-0 shadow-md flex items-center justify-center cursor-pointer"
            >
              CHERCHEUR
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar: Segmented Progress Bar */}
      <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start">
          <div className="flex items-center gap-1.5 w-44 sm:w-64">
            {slides.map((s, idx) => {
              const isActive = idx === current;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Aller au slide ${idx + 1}`}
                  className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden relative cursor-pointer group"
                >
                  {isActive && (
                    <div
                      className={`h-full bg-[#e10600] rounded-full transition-all duration-300 ${
                        isPaused ? 'w-full' : 'w-full animate-[progress_5.5s_linear]'
                      }`}
                    />
                  )}
                  <span className="sr-only">Slide {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
