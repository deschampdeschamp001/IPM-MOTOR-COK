import React from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { DEALERSHIP_CONFIG } from '../config/dealership';
import { useTheme } from '../context/ThemeContext';

export const WhyUs: React.FC = () => {
  const { isDark } = useTheme();

  const pillars = [
    {
      number: '01',
      title: '100 % neuf, 0 km',
      description: 'Véhicules certifiés d’usine, zéro kilomètre au compteur.',
    },
    {
      number: '02',
      title: 'Multimarque de prestige',
      description: 'BYD, Toyota, Mercedes-Benz, Jetour, Changan, BMW.',
    },
    {
      number: '03',
      title: 'Conseil personnalisé',
      description: 'Accompagnement sur-mesure, motorisation et fiscalité.',
    },
    {
      number: '04',
      title: 'Parc Automobile à Riviera Bonoumin',
      description: 'Un espace exclusif et accessible au cœur de Cocody.',
    },
  ];

  return (
    <section
      id="a-propos"
      className={`py-24 sm:py-36 border-t transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0A] text-white border-[#222222]' : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200'
      }`}
    >
      {/* Anchor alias for existing internal links */}
      <div id="pourquoi-ipm" className="absolute -top-24 opacity-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Header Kicker */}
        <div className="text-center mb-6">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#E10600]">
            À propos d'IPM Motors
          </span>
        </div>

        {/* Grand Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-balance mb-12 sm:mb-16">
          L’excellence automobile <span className="text-[#E10600]">à votre portée !</span>
        </h2>

        {/* Editorial Clean Flow */}
        <div className="space-y-10 sm:space-y-12 text-center max-w-3xl mx-auto">
          {/* Paragraph 1 */}
          <p
            className={`text-base sm:text-xl font-normal leading-relaxed text-balance ${
              isDark ? 'text-neutral-200' : 'text-neutral-700'
            }`}
          >
            Bienvenue chez <span className="font-semibold text-[#E10600]">IPM MOTORS</span>, votre partenaire de confiance pour l’achat de véhicules neufs en Côte d’Ivoire. Leader ambitieux et acteur influent du secteur automobile, nous mettons notre expertise et notre passion au service de vos exigences pour vous proposer des véhicules qui allient{' '}
            <span className="font-medium">prestige, performance, confort et élégance</span>.
          </p>

          {/* Accroche Punchline - Minimalist & Impactful */}
          <div className="py-6 sm:py-8 border-y border-[#E10600]/30 max-w-2xl mx-auto">
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-balance text-[#E10600]">
              « Avec IPM MOTORS, donnez une nouvelle dimension à vos déplacements ! »
            </blockquote>
          </div>

          {/* Paragraph 2 */}
          <p
            className={`text-sm sm:text-lg font-light leading-relaxed text-balance ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Que vous recherchiez un SUV de luxe, une berline élégante, un véhicule familial ou un modèle aux performances exceptionnelles, nous vous accompagnons dans la réalisation de votre projet automobile avec professionnalisme, disponibilité et sens du service.
          </p>

          {/* Brand Signature */}
          <div className="pt-2">
            <p
              className={`text-xs sm:text-sm uppercase tracking-widest font-semibold ${
                isDark ? 'text-neutral-300' : 'text-neutral-800'
              }`}
            >
              IPM MOTORS, bien plus qu’un vendeur de véhicules : une vision du luxe, de la qualité et de la satisfaction client.
            </p>
          </div>
        </div>

        {/* Showroom & Action Strip - Ultra Clean & Symmetrical */}
        <div
          className={`mt-16 sm:mt-20 p-8 sm:p-12 rounded-2xl border text-center transition-colors ${
            isDark
              ? 'bg-[#121212] border-[#262626]'
              : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full mb-4 bg-[#E10600]/10 text-[#E10600] border border-[#E10600]/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>Parc Automobile Riviera Bonoumin · Abidjan</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Le prestige automobile au cœur d'Abidjan
          </h3>

          <p
            className={`text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed mb-8 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Une sélection exclusive de modèles 0 km des plus grands constructeurs mondiaux, prêts pour livraison immédiate avec accompagnement complet.
          </p>

          {/* 2 Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shadow-[#E10600]/20 cursor-pointer"
            >
              <span>Explorer les véhicules neufs</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${DEALERSHIP_CONFIG.phone}`}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'border-neutral-700 hover:border-white text-white hover:bg-white/5'
                  : 'border-neutral-300 hover:border-neutral-900 text-neutral-900 hover:bg-black/5'
              }`}
            >
              <Phone className="w-4 h-4 text-[#E10600]" />
              <span>Contacter un conseiller</span>
            </a>
          </div>
        </div>

        {/* 4 Minimal Pillars - Pure Editorial Line */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-neutral-200/40 dark:border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.number} className="space-y-2">
                <span className="text-xs font-bold text-[#E10600] tracking-wider uppercase">
                  {pillar.number}
                </span>
                <h4 className="text-sm sm:text-base font-bold tracking-tight">
                  {pillar.title}
                </h4>
                <p
                  className={`text-xs leading-relaxed font-light ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
