import React, { useEffect } from 'react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import { Link } from '../router/Router';
import {
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'À Propos | IPM Motors Abidjan - L’Excellence Automobile';
  }, []);

  const waUrl = buildWhatsAppUrl("Bonjour IPM Motors, je souhaite des informations sur votre parc automobile et vos services.");

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-8 sm:px-14 md:px-18 lg:px-24 xl:px-32 2xl:px-44 max-w-[1550px] mx-auto w-full">
      {/* 1. Header Minimaliste, Simple & Cohérent */}
      <div className="max-w-4xl mb-14 sm:mb-18">
        <span className="eyebrow block mb-3">Notre Histoire & Notre Vision</span>
        <h1 className="font-heading font-light text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-[var(--fg)]">
          L’Excellence Automobile <span className="font-semibold text-[#e10600]">à votre portée</span>
        </h1>
        <p className="text-base sm:text-xl text-[#6b6b72] mt-4 font-light leading-relaxed">
          Bienvenue chez IPM MOTORS, votre partenaire de confiance pour l’achat de véhicules neufs 0 km en Côte d’Ivoire.
        </p>
      </div>

      {/* 2. Section Éditoriale & Showroom (Design épuré et ultra-lisible) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
        {/* Colonne Récit & Vision */}
        <div className="lg:col-span-7 space-y-6 text-[var(--fg)] font-light leading-relaxed">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e10600] font-mono">
              Expertise & Passion
            </span>
            <h2 className="font-heading font-normal text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-snug">
              Leader ambitieux et acteur influent du <span className="font-semibold text-[#e10600]">secteur automobile</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#6b6b72] leading-relaxed">
            Bienvenue chez IPM MOTORS, votre partenaire de confiance pour l’achat de véhicules neufs en Côte d’Ivoire. Leader ambitieux et acteur influent du secteur automobile, nous mettons notre expertise et notre passion au service de vos exigences pour vous proposer des véhicules qui allient prestige, performance, confort et élégance.
          </p>

          <blockquote className="my-8 py-5 px-6 rounded-2xl bg-[var(--surface)] border-l-4 border-[#e10600] text-base sm:text-lg font-medium italic text-[var(--fg)] shadow-sm">
            « Avec IPM MOTORS, donnez une nouvelle dimension à vos déplacements ! »
          </blockquote>

          <p className="text-sm sm:text-base text-[#6b6b72] leading-relaxed">
            Que vous recherchiez un SUV de luxe, une berline élégante, un véhicule familial ou un modèle aux performances exceptionnelles, nous vous accompagnons dans la réalisation de votre projet automobile avec professionnalisme, disponibilité et sens du service.
          </p>

          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mt-6">
            <p className="text-sm sm:text-base font-semibold text-[var(--fg)]">
              IPM MOTORS, bien plus qu’un vendeur de véhicules : une vision du luxe, de la qualité et de la satisfaction client.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/modeles"
              className="pill-btn inline-flex items-center gap-2 px-7 py-3.5 bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Découvrir le catalogue 0 km</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--surface)] hover:bg-[var(--card)] text-[var(--fg)] border border-[var(--border)] text-xs font-semibold transition-all hover:border-zinc-400 dark:hover:border-zinc-700"
            >
              <MessageCircle className="w-4 h-4 text-[#e10600]" />
              <span>Échanger avec un conseiller</span>
            </a>
          </div>
        </div>

        {/* Colonne Parc Automobile IPM Motors à Bonoumin */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
              <img
                src="/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg"
                alt="Parc Automobile IPM Motors à Bonoumin"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/public/assets/aistudio/Capture_d_e_cran_2026-10-27_a__23.27.19_3d38d533.png';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                  Parc Automobile Principal
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#e10600] font-mono block mb-1">
                  Abidjan Riviera
                </span>
                <h3 className="font-heading font-medium text-xl text-[var(--fg)]">
                  Parc Automobile IPM Motors à Bonoumin
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#6b6b72] font-light pt-2 border-t border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                  <span>{DEALERSHIP_CONFIG.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#e10600] shrink-0" />
                  <span>Lun - Sam : 08h00 - 18h30 (Accueil sur rendez-vous possible)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#e10600] shrink-0" />
                  <span>{DEALERSHIP_CONFIG.phoneDisplay}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="w-full py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--card)] text-xs font-semibold text-[var(--fg)] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Planifier une visite au parc automobile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Les 3 Piliers de l'Excellence Minimalistes */}
      <div className="pt-14 border-t border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-lg text-[var(--fg)]">100% Neuf 0 KM Certifié</h4>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed">
              Zéro kilomètre d’usage. Chaque véhicule arrive directement d’usine avec carnet constructeur officiel et documents douaniers en règle.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-lg text-[var(--fg)]">Multimarques d'Élite</h4>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed">
              Les plus grands constructeurs mondiaux réunis en un seul lieu : BYD, Toyota, Mercedes-Benz, BMW, Jetour, Nissan, Land Rover et Suzuki.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-3 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-lg text-[var(--fg)]">Accompagnement Sur-Mesure</h4>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed">
              De la commande personnalisée au dédouanement et à l’immatriculation express, nous livrons votre véhicule prêt à prendre la route à Abidjan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
