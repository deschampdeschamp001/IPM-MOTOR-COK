import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { BodyTypeSilhouettes } from '../components/ui/BodyTypeSilhouettes';
import { VehicleCard } from '../components/VehicleCard';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { useData } from '../context/DataContext';
import { Link } from '../router/Router';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  Award,
  CheckCircle2,
  Sliders,
  Store,
  Compass,
  FileCheck2,
  Wrench,
  Mail,
  Loader2,
  MapPin,
  Navigation,
  Zap,
  Car,
  ExternalLink
} from 'lucide-react';
import { subscribeNewsletter } from '../lib/newsletterStorage';

export const HomePage: React.FC = () => {
  const { vehicles, brands, newsArticles } = useData();

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // News carousel slide state (2 articles per slide like Image 1)
  const [newsSlideIndex, setNewsSlideIndex] = useState(0);
  const publishedNews = newsArticles.filter(n => n.is_published);
  const displayedNews = publishedNews.slice(newsSlideIndex * 2, newsSlideIndex * 2 + 2).length > 0 
    ? publishedNews.slice(newsSlideIndex * 2, newsSlideIndex * 2 + 2)
    : publishedNews.slice(0, 2);

  const featuredVehicles = vehicles.filter(v => v.is_available).slice(0, 6);
  const activeBrands = brands.filter(b => b.is_active).slice(0, 16);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    const res = await subscribeNewsletter(newsletterEmail);
    if (res.success) {
      setNewsletterStatus('success');
      setNewsletterMsg(res.message);
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
      setNewsletterMsg(res.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SLIDER (24H Chrono Shutter & Live Clock) */}
      <Hero />

      {/* 2. NOS MODÈLES & SILHOUETTE SELECTOR */}
      <section className="py-8 sm:py-12 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 max-w-[1500px] mx-auto w-full">
        {/* Section Header simplifié et épuré */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <h2 className="font-heading font-semibold text-xl sm:text-2xl lg:text-3xl tracking-tight text-[var(--fg)]">
              Nos Modèles <span className="font-bold text-[#e10600]">0 km</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6b6b72] mt-1 max-w-xl font-light">
              Véhicules 100% neufs disponibles immédiatement dans notre parc automobile à Cocody Riviera Bonoumin.
            </p>
          </div>

          <Link
            to="/modeles"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#e10600] hover:text-[#c30500] group"
          >
            <span>Voir tout le catalogue ({vehicles.length})</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hairline Minimalist Body Type Silhouettes */}
        <div>
          <div className="text-xs uppercase tracking-wider text-[#6b6b72] font-semibold mb-3">
            Choisir par type de véhicule
          </div>
          <BodyTypeSilhouettes />
        </div>
      </section>

      {/* Separator between Section 2 & 3 */}
      <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-20 py-2">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
      </div>

      {/* 3. NOS MARQUES (Logos épurés SANS AUCUN CONTOUR) */}
      <section className="py-10 sm:py-14 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 max-w-[1500px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
          <span className="eyebrow block mb-1">Toutes marques, un seul parc automobile</span>
          <h2 className="font-heading font-light text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            Nos <span className="font-semibold">Marques</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6b6b72] mt-1.5 font-light">
            Cliquez sur un constructeur pour découvrir les modèles 0 km disponibles en concession.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {activeBrands.map((brand) => {
            return (
              <Link
                key={brand.id}
                to={`/modeles?marque=${encodeURIComponent(brand.name)}`}
                aria-label={`Découvrir les véhicules ${brand.name}`}
                className="group p-2.5 sm:p-3 flex flex-col items-center justify-center min-h-[82px] sm:min-h-[92px] border-0 shadow-none bg-transparent hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="h-8 sm:h-9 w-full flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-105">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={`Logo ${brand.name}`}
                      loading="lazy"
                      className="max-h-8 sm:max-h-9 max-w-[72px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!brand.logo_url && (
                    <span className="font-heading font-bold text-xs sm:text-sm tracking-wide text-zinc-700 dark:text-zinc-300">
                      {brand.name}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#6b6b72] group-hover:text-[#e10600] transition-colors truncate max-w-full text-center">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/modeles"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b6b72] hover:text-[#e10600] transition-colors"
          >
            <span>Voir tous les modèles disponibles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. SERVICES (Fond Blanc pur, blocs carrés jaunes sans contour arrondi, pas d'effet survol) */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-900 text-zinc-950 w-full transition-colors border-t border-[var(--border)]">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-1">
              Accompagnement Sur-Mesure
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-neutral-950 dark:text-white">
              Nos Services
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 font-light">
              Une expérience haut de gamme pensée pour chaque étape de votre acquisition automobile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Bloc 1 */}
            <div className="p-5 sm:p-6 rounded-none bg-[#FFDE00] text-neutral-950 flex flex-col justify-between border-0 shadow-none">
              <div>
                <div className="w-7 h-7 flex items-center justify-center mb-3 text-neutral-950">
                  <Store className="w-5 h-5 text-neutral-950" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg mb-1.5 text-neutral-950">
                  Véhicules en Stock
                </h3>
                <p className="text-xs text-neutral-900 leading-relaxed font-normal">
                  Parc de véhicules 100% neufs 0 km prêts pour enlèvement immédiat sans attente de fret.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-950/20">
                <Link
                  to="/modeles"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline"
                >
                  <span>Consulter le stock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bloc 2 */}
            <div className="p-5 sm:p-6 rounded-none bg-[#FFDE00] text-neutral-950 flex flex-col justify-between border-0 shadow-none">
              <div>
                <div className="w-7 h-7 flex items-center justify-center mb-3 text-neutral-950">
                  <Sliders className="w-5 h-5 text-neutral-950" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg mb-1.5 text-neutral-950">
                  Commande Sur-Mesure
                </h3>
                <p className="text-xs text-neutral-900 leading-relaxed font-normal">
                  Configuration personnalisée d’usine : coloris exclusifs, selleries sur-mesure et options rares.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-950/20">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline"
                >
                  <span>Configurer un véhicule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bloc 3 */}
            <div className="p-5 sm:p-6 rounded-none bg-[#FFDE00] text-neutral-950 flex flex-col justify-between border-0 shadow-none">
              <div>
                <div className="w-7 h-7 flex items-center justify-center mb-3 text-neutral-950">
                  <Compass className="w-5 h-5 text-neutral-950" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg mb-1.5 text-neutral-950">
                  Parc Automobile Riviera
                </h3>
                <p className="text-xs text-neutral-900 leading-relaxed font-normal">
                  Espace d’exposition climatisé à Bonoumin pour admirer et essayer votre futur véhicule en toute sérénité.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-950/20">
                <Link
                  to="/a-propos"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline"
                >
                  <span>Visiter le parc automobile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bloc 4 */}
            <div className="p-5 sm:p-6 rounded-none bg-[#FFDE00] text-neutral-950 flex flex-col justify-between border-0 shadow-none">
              <div>
                <div className="w-7 h-7 flex items-center justify-center mb-3 text-neutral-950">
                  <Sparkles className="w-5 h-5 text-neutral-950" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg mb-1.5 text-neutral-950">
                  VIP & Financement
                </h3>
                <p className="text-xs text-neutral-900 leading-relaxed font-normal">
                  Solutions bancaires et leasing avec nos partenaires ivoiriens, et livraison VIP à domicile.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-950/20">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline"
                >
                  <span>Contacter un conseiller VIP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNIÈRE ACCUEIL PRIVILÈGE & CONSEILS PERSONNALISÉS (DÉPLACÉE AU-DESSUS DE SERVICE APRÈS-VENTE) */}
      <section className="py-6 sm:py-8 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 max-w-[1550px] mx-auto w-full">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[var(--border)] min-h-[220px] sm:min-h-[260px] flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-10 lg:p-12 gap-6">
          <img
            src="/public/assets/aistudio/Capture_d_e_cran_2026-10-29_a__18.34.08_75055a70.png"
            alt="Accueil Privilège et Conseils Personnalisés IPM Motors"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dégradé noir profond pour faire ressortir le texte parfaitement */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/35" />

          <div className="relative z-10 max-w-xl">
            <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-2">
              Accueil Privilège & Conseils Personnalisés
            </span>
            <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug">
              Une équipe dédiée à votre projet automobile
            </h3>
            <p className="text-xs sm:text-sm text-zinc-200 font-light mt-2 leading-relaxed">
              Prenez rendez-vous dès aujourd’hui pour une présentation exclusive ou un essai privé de nos modèles 0 km à Cocody Riviera Bonoumin.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/contact"
              className="pill-btn inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-[#e10600] hover:bg-[#c30500] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:scale-105"
            >
              <span>Prendre rendez-vous</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SERVICE APRÈS-VENTE (Fond Blanc pur, espacement réduit & design minimaliste) */}
      <section className="py-10 sm:py-14 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 bg-white dark:bg-[#121215] text-[var(--fg)] w-full border-t border-[var(--border)]">
        <div className="max-w-[1500px] mx-auto">
          {/* En-tête centré */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="eyebrow block mb-1.5">
              Tranquillité d’Esprit
            </span>
            <h2 className="font-heading font-light text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight mb-2">
              Service <span className="font-semibold text-[#e10600]">Après-Vente</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed max-w-2xl mx-auto">
              Un accompagnement durable pour rouler en toute confiance partout en Côte d’Ivoire.
            </p>
          </div>

          {/* 3 Cartes avec grandes icônes disposées sans contour, espacement équilibré */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* Carte 1 : Garantie Constructeur */}
            <div className="p-4 sm:p-5 flex flex-col items-center text-center justify-between border-0 shadow-none bg-transparent">
              <div className="flex flex-col items-center w-full">
                <div className="h-16 w-16 flex items-center justify-center mb-5 text-[#e10600]">
                  <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="16" width="38" height="26" rx="4" />
                    <line x1="6" y1="23" x2="44" y2="23" />
                    <rect x="11" y="29" width="8" height="5" rx="1" />
                    <g transform="translate(18, 12)">
                      <path d="M26 14v7c0 6-5 10-9 12-4-2-9-6-9-12v-7l9-4 9 4z" />
                      <path d="M22 20l2.5 2.5 5.5-5.5" strokeWidth="2.4" />
                    </g>
                  </svg>
                </div>

                <h3 className="font-heading font-semibold text-lg sm:text-xl text-[var(--fg)] mb-2">
                  Garantie Constructeur
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed mb-5">
                  Couverture officielle de 3 à 8 ans sur l'ensemble de nos véhicules neufs 0 km pour une sécurité totale dès le premier jour.
                </p>
              </div>

              {/* Puces avec séparateur fin */}
              <ul className="text-left space-y-2 text-xs sm:text-sm text-[var(--fg)] font-normal w-full pt-4 border-t border-[var(--border)]">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Garantie internationale constructeur</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Jusqu'à 160 000 km pour batteries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Moteur, boîte et électronique</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Carnet de garantie officiel tamponné</span>
                </li>
              </ul>
            </div>

            {/* Carte 2 : Sécurité & Ateliers certifiés */}
            <div className="p-4 sm:p-5 flex flex-col items-center text-center justify-between border-0 shadow-none bg-transparent">
              <div className="flex flex-col items-center w-full">
                <div className="h-16 w-16 flex items-center justify-center mb-5 text-[#e10600]">
                  <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M32 7l19 8v16c0 14-10.5 24-19 27C23.5 55 13 45 13 31V15L32 7z" />
                    <path d="M23 31l7 7 13-13" strokeWidth="2.4" />
                  </svg>
                </div>

                <h3 className="font-heading font-semibold text-lg sm:text-xl text-[var(--fg)] mb-2">
                  Entretien Certifié & Pièces OEM
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed mb-5">
                  Réseau de centres techniques agréés à Abidjan respectant rigoureusement les normes constructeurs.
                </p>
              </div>

              {/* Puces */}
              <ul className="text-left space-y-2 text-xs sm:text-sm text-[var(--fg)] font-normal w-full pt-4 border-t border-[var(--border)]">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Pièces 100% d'origine constructeur</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Valises diagnostiques officielles</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Techniciens formés multimarques</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Traçabilité complète des entretiens</span>
                </li>
              </ul>
            </div>

            {/* Carte 3 : Pilotage & Démarches Clé en Main */}
            <div className="p-4 sm:p-5 flex flex-col items-center text-center justify-between border-0 shadow-none bg-transparent">
              <div className="flex flex-col items-center w-full">
                <div className="h-16 w-16 flex items-center justify-center mb-5 text-[#e10600]">
                  <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="22" cy="18" r="5" />
                    <circle cx="42" cy="18" r="5" />
                    <path d="M15 30c0-3.5 3.5-5.5 7-5.5" />
                    <path d="M49 30c0-3.5-3.5-5.5-7-5.5" />
                    <path d="M29 13a11 11 0 0 1 6 0" />
                    <path d="M35 23a11 11 0 0 1-6 0" />
                    <path d="M11 48h18l11-5c3-1.5 6.5-0.5 7.5 2v0c0.5 2-0.5 4-2.5 5l-12 5H11v-7z" />
                    <path d="M21 48v-4a3.5 3.5 0 0 1 3.5-3.5h4.5" />
                  </svg>
                </div>

                <h3 className="font-heading font-semibold text-lg sm:text-xl text-[var(--fg)] mb-2">
                  Démarches & Prise en Charge
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed mb-5">
                  Toutes les formalités administratives ivoiriennes sont prises en charge pour une mise à la route immédiate.
                </p>
              </div>

              {/* Puces */}
              <ul className="text-left space-y-2 text-xs sm:text-sm text-[var(--fg)] font-normal w-full pt-4 border-t border-[var(--border)]">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Dédouanement officiel sécurisé</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Carte grise ivoirienne établie</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Pose de plaques homologuées</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] shrink-0" />
                  <span>Conseiller dédié disponible 6j/7</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lien vers la page dédiée */}
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              to="/apres-vente"
              className="pill-btn inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>En savoir plus sur nos garanties & SAV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CARTE PARC AUTOMOBILE IPM MOTORS & RIDE-HAILING LOGOS */}
      <section className="py-10 sm:py-14 px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 max-w-[1550px] mx-auto w-full">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="font-heading font-semibold text-lg sm:text-xl text-[var(--fg)] tracking-tight">
            Localisez notre Parc Automobile IPM Motors
          </h2>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Riviera+Bonoumin+Abidjan+Cote+d'Ivoire"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#e10600] hover:underline font-semibold inline-flex items-center gap-1.5"
          >
            <span>Afficher l'itinéraire</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Conteneur de la Carte panoramique */}
        <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-zinc-900 shadow-xl aspect-[21/9] sm:aspect-[24/9] min-h-[260px] sm:min-h-[360px]">
          {/* Iframe Carte Interactive Abidjan Riviera Bonoumin */}
          <iframe
            title="Localisation Parc Automobile IPM Motors - Cocody Riviera Bonoumin"
            src="https://maps.google.com/maps?q=Riviera+Bonoumin,+Cocody,+Abidjan,+Cote+d'Ivoire&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 filter contrast-[1.05] opacity-90 dark:opacity-80"
            loading="lazy"
          />

          {/* Badge flottant bas-gauche */}
          <div className="absolute bottom-4 left-4 z-10">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Riviera+Bonoumin+Abidjan+Cote+d'Ivoire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-black transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-[#e10600]" />
              <span>Itinéraire Parc Automobile</span>
            </a>
          </div>

          {/* Badge central Parc Automobile VIP */}
          <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#e10600] animate-ping" />
            <span>Parc Automobile Bonoumin</span>
          </div>
        </div>

        {/* NOUVELLE ZONE SOUS LA CARTE : IPM MOTORS EST DISPONIBLE SUR (YANGO, HEETCH, INDRIVE) */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-[#141417] rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e10600] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              IPM MOTORS est disponible sur
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            {/* YANGO */}
            <div className="h-10 px-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center hover:scale-105 transition-transform">
              <img
                src="/public/assets/aistudio/images__11__698c3a39.png"
                alt="Yango Côte d'Ivoire"
                className="h-6 w-auto object-contain"
              />
            </div>

            {/* inDrive */}
            <div className="h-10 px-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center hover:scale-105 transition-transform">
              <img
                src="/public/assets/aistudio/indrive-vertical-logo-png_seeklogo-630596_7d30db92.png"
                alt="inDrive Côte d'Ivoire"
                className="h-6 w-auto object-contain"
              />
            </div>

            {/* HEETCH */}
            <div className="h-10 px-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center hover:scale-105 transition-transform">
              <img
                src="/public/assets/aistudio/Logo-Horizontal-Red-02-1288x724-1_d8f34bd5.png"
                alt="Heetch Côte d'Ivoire"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* 9. ACTUALITÉS (DESIGN MODERNISÉ SUR PC AVEC DÉFILEMENT ET ROTATION DES INFOS) */}
        <div className="mt-12 sm:mt-16 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="w-5 h-[2px] bg-[#e10600]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#e10600]">
                  Actualités & Nouveautés
                </span>
              </div>
              <h2 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[var(--fg)]">
                Nos Dernières <span className="text-[#e10600]">Actualités</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Boutons précédents / suivants pour faire tourner les blocs d'actualités */}
              {publishedNews.length > 2 && (
                <div className="flex items-center gap-1.5 bg-[var(--surface)] p-1 rounded-full border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => {
                      const maxSlide = Math.ceil(publishedNews.length / 2) - 1;
                      setNewsSlideIndex((prev) => (prev <= 0 ? maxSlide : prev - 1));
                    }}
                    aria-label="Actualités précédentes"
                    className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center hover:bg-[#e10600] hover:text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <span className="text-[11px] font-mono px-2 font-medium text-zinc-600 dark:text-zinc-400">
                    {newsSlideIndex + 1} / {Math.ceil(publishedNews.length / 2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxSlide = Math.ceil(publishedNews.length / 2) - 1;
                      setNewsSlideIndex((prev) => (prev >= maxSlide ? 0 : prev + 1));
                    }}
                    aria-label="Actualités suivantes"
                    className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center hover:bg-[#e10600] hover:text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <Link
                to="/actualites"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#e10600] hover:text-[#c30500] group"
              >
                <span>Tout voir</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Grille des Actualités : Grands blocs panoramiques avec design haut de gamme sur PC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6">
            {displayedNews.map((article) => {
              const articleSlug = article.slug || article.id;
              const waArticleUrl = buildWhatsAppUrl(`Bonjour IPM Motors, je souhaite des renseignements suite à votre article : "${article.title}".`);

              return (
                <article
                  key={article.id}
                  className="group relative aspect-[16/11] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-950 shadow-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#e10600]/40 transition-all duration-500"
                >
                  {/* Image de fond plein cadre avec zoom au survol */}
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                    }}
                  />

                  {/* Dégradé sombre progressif multicouche pour un contraste parfait du texte sur PC */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden sm:block" />

                  {/* Header de la carte : Badges & date */}
                  <div className="absolute top-4 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 z-10 flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                      {article.category}
                    </span>
                    {article.read_time && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md border border-white/10 hidden sm:inline-block">
                        {article.read_time}
                      </span>
                    )}
                  </div>

                  {/* Contenu textuel et boutons en bas de la carte sur PC */}
                  <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7 right-5 sm:right-7 z-10">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-2 leading-snug drop-shadow-md group-hover:text-zinc-100 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 max-w-xl font-light mb-5 drop-shadow">
                      {article.excerpt}
                    </p>

                    {/* Deux boutons au bas du bloc */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/actualites/${articleSlug}`}
                        className="px-5 py-2.5 rounded-full bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-semibold shadow-md transition-all hover:scale-102"
                      >
                        Lire l'article
                      </Link>
                      <a
                        href={waArticleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold shadow-md transition-all hover:scale-102 inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Échanger sur WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Indicateur de défilement interactif pour naviguer dans les actualités */}
          {publishedNews.length > 2 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              {Array.from({ length: Math.ceil(publishedNews.length / 2) }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewsSlideIndex(idx)}
                  aria-label={`Page d'actualités ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    newsSlideIndex === idx
                      ? 'w-7 bg-[#e10600]'
                      : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8.5. TEMOIGNAGES CLIENTS (Clients heureux, nous aussi !) */}
      <TestimonialsSection />

      {/* 9. NEWSLETTER ("Restez informé.") */}
      <section className="py-12 sm:py-16 bg-[#0b0b0c] text-white border-t border-zinc-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-1.5">
            Lettre Privilège
          </span>
          <h2 className="font-heading font-extralight text-2xl sm:text-4xl text-white tracking-tight mb-3">
            Restez <span className="font-semibold">informé.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto mb-6">
            Soyez les premiers avertis de l’arrivée de nouvelles séries limitées 0 km, des arrivages de conteneurs et des conditions exceptionnelles à Abidjan.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Votre adresse e-mail professionnelle"
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#e10600]"
            />
            <button
              type="submit"
              disabled={newsletterStatus === 'loading'}
              className="pill-btn px-7 py-3.5 bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-semibold shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-[#e10600]/25 disabled:opacity-50"
            >
              {newsletterStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <span>S'inscrire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {newsletterMsg && (
            <div className={`mt-4 text-xs font-medium ${newsletterStatus === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {newsletterMsg}
            </div>
          )}

          <p className="text-[11px] text-zinc-500 mt-4 font-light">
            Zéro spam. Désabonnement en un clic à tout moment. Vos coordonnées restent strictement confidentielles.
          </p>
        </div>
      </section>
    </div>
  );
};
