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
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'À Propos | IPM Motors Abidjan - L’Excellence Automobile';
  }, []);

  const waUrl = buildWhatsAppUrl(
    'Bonjour IPM Motors, je souhaite des informations sur votre parc automobile et vos services.'
  );

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28 max-w-[1500px] mx-auto w-full">
      {/* 1. En-tête Épuré & Minimaliste */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <span className="eyebrow block mb-2">Notre Vision & Engagement</span>
        <h1 className="font-heading font-light text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--fg)] leading-tight">
          L’Excellence Automobile <span className="font-semibold text-[#e10600]">à Abidjan</span>
        </h1>
        <p className="text-base sm:text-lg text-[#6b6b72] mt-4 font-light leading-relaxed">
          Distributeur spécialisé de véhicules neufs 100% 0 km, IPM MOTORS vous garantit un accès direct aux plus grands constructeurs mondiaux avec une tranquillité d’esprit totale en Côte d’Ivoire.
        </p>
      </div>

      {/* 2. Bandeau 4 Chiffres Clés Minimaliste */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <span className="block text-2xl sm:text-4xl font-bold text-[#e10600] font-heading">100%</span>
          <span className="text-xs sm:text-sm font-medium text-[var(--fg)] block mt-1">Véhicules 0 km</span>
          <span className="text-[11px] text-[#6b6b72] font-light">Strictement vierges de toute utilisation</span>
        </div>
        <div>
          <span className="block text-2xl sm:text-4xl font-bold text-[#e10600] font-heading">3 à 8 ans</span>
          <span className="text-xs sm:text-sm font-medium text-[var(--fg)] block mt-1">Garantie Constructeur</span>
          <span className="text-[11px] text-[#6b6b72] font-light">Carnet officiel remis à la livraison</span>
        </div>
        <div>
          <span className="block text-2xl sm:text-4xl font-bold text-[#e10600] font-heading">6j/7</span>
          <span className="text-xs sm:text-sm font-medium text-[var(--fg)] block mt-1">Showroom & Essais</span>
          <span className="text-[11px] text-[#6b6b72] font-light">Cocody Riviera Bonoumin</span>
        </div>
        <div>
          <span className="block text-2xl sm:text-4xl font-bold text-[#e10600] font-heading">100% OEM</span>
          <span className="text-xs sm:text-sm font-medium text-[var(--fg)] block mt-1">Pièces & Ateliers</span>
          <span className="text-[11px] text-[#6b6b72] font-light">Réseau technique certifié à Abidjan</span>
        </div>
      </div>

      {/* 3. Section Deux Colonnes : Récit Sobre + Photo du Parc Automobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e10600] font-mono">
              Sens du Service & Rigueur
            </span>
            <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[var(--fg)] tracking-tight">
              Une expérience d’acquisition claire, transparente et sans compromis
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#6b6b72] font-light leading-relaxed">
            Chez IPM MOTORS, nous croyons qu’acquérir un véhicule neuf doit être une expérience sereine et mémorable. Du SUV haut de gamme à la citadine économique, nous sélectionnons chaque modèle directement auprès des filières officielles des constructeurs.
          </p>

          <ul className="space-y-3.5 pt-2">
            {[
              'Disponibilité immédiate en concession à Abidjan, sans délais d’attente maritime',
              'Prise en charge intégrale du dédouanement et de l’immatriculation officielle (carte grise CI & plaques posées)',
              'Accompagnement personnalisé pour le choix du financement, leasing bancaire et assurance automobile',
              'Suivi après-vente rigoureux avec ateliers certifiés partenaires et pièces 100% d’origine'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--fg)] font-normal">
                <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/modeles"
              className="pill-btn inline-flex items-center gap-2 px-7 py-3.5 bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Consulter le stock disponible</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--surface)] hover:bg-[var(--card)] text-[var(--fg)] border border-[var(--border)] text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Échanger avec un conseiller</span>
            </a>
          </div>
        </div>

        {/* Colonne Showroom / Parc Automobile */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-lg">
            <div className="relative aspect-[16/11] overflow-hidden bg-zinc-950">
              <img
                src="/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg"
                alt="Showroom IPM Motors Cocody Riviera Bonoumin"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    '/public/assets/aistudio/Capture_d_e_cran_2026-10-27_a__23.27.19_3d38d533.png';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                  Parc Automobile Officiel
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="font-heading font-medium text-lg text-[var(--fg)]">
                Showroom Riviera Bonoumin
              </h3>
              <div className="space-y-2 text-xs text-[#6b6b72] font-light">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e10600] shrink-0 mt-0.5" />
                  <span>{DEALERSHIP_CONFIG.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-[#e10600] shrink-0" />
                  <span>Lun - Sam : 08h00 - 18h30</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#e10600] shrink-0" />
                  <span>{DEALERSHIP_CONFIG.phoneDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Les 3 Piliers de Confiance */}
      <div className="pt-12 border-t border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#e10600] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base sm:text-lg text-[var(--fg)]">
              Origine 100% Certifiée
            </h4>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed">
              Zéro kilomètre d’usage. Véhicules protégés sous plastiques de transport usine, avec fiches d’homologation officielles.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#e10600] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base sm:text-lg text-[var(--fg)]">
              Garantie Constructeur Préservée
            </h4>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed">
              Prise en charge officielle de 3 à 8 ans selon la marque, avec carnet d’entretien officiel délivré à la livraison.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#e10600] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base sm:text-lg text-[var(--fg)]">
              Clés en Main & Sérénité
            </h4>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed">
              Aucune démarche compliquée : nous gérons le dédouanement et l’immatriculation pour que vous rouliez en toute conformité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
