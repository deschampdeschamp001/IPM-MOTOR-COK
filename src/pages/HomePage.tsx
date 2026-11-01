import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { subscribeNewsletter } from '../lib/newsletterStorage';
import clientServiceBannerImg from '../assets/images/client_service_banner_1793277931395.jpg';

const parseDateBadge = (dateStr: string) => {
  if (!dateStr) return { day: '4', month: 'Mai' };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const mIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10).toString();
    return { day, month: months[mIdx] || 'Mai' };
  }
  const tokens = dateStr.trim().split(/\s+/);
  if (tokens.length >= 2 && !isNaN(parseInt(tokens[0], 10))) {
    return { day: tokens[0], month: tokens[1].slice(0, 4) };
  }
  return { day: '4', month: 'Mai' };
};

const SERVICES_DATA = [
  {
    id: 's1',
    type: 'globe',
    title: 'Véhicules 0 km en Stock',
    description: 'Disponibilité immédiate | Sélection 100% neufs | Zéro kilomètre garanti | Enlèvement direct sans attente de fret',
    link: '/modeles',
    cta: 'Voir le catalogue'
  },
  {
    id: 's2',
    type: 'pen',
    title: 'Commande Sur-Mesure',
    description: 'Configuration usine | Teintes & finitions rares | Sellerie personnalisée | Suivi logistique direct',
    link: '/contact',
    cta: 'Configurer un modèle'
  },
  {
    id: 's3',
    type: 'code',
    title: 'Parc Automobile Bonoumin',
    description: 'Showroom climatisé | Essai privé sur rendez-vous | Parking sécurisé | Accueil personnalisé VIP',
    link: '/a-propos',
    cta: 'Visiter le parc'
  },
  {
    id: 's4',
    type: 'shield',
    title: 'Garantie & Clés en Main',
    description: 'Garantie constructeur 3 à 8 ans | Dédouanement certifié | Immatriculation CI | Remise officielle',
    link: '/apres-vente',
    cta: 'Nos engagements SAV'
  }
];

export const HomePage: React.FC = () => {
  const { vehicles, brands, newsArticles } = useData();

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // News carousel slide state (3 articles sur PC, pagination 1 2 3 4 5)
  const [newsSlideIndex, setNewsSlideIndex] = useState(0);
  const publishedNews = newsArticles.filter(n => n.is_published);
  const displayedNews = publishedNews.slice(newsSlideIndex * 3, newsSlideIndex * 3 + 3).length > 0 
    ? publishedNews.slice(newsSlideIndex * 3, newsSlideIndex * 3 + 3)
    : publishedNews.slice(0, 3);

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

      {/* 6. SERVICES (EXACT DESIGN IMAGE 4 : TITRE ROUGE AVEC SOULIGNEMENT JAUNE, BLOCS DORÉS #f59e0b, ICÔNES BLANCHES & CARROUSEL FLUIDE) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-[#0c0c0e] text-zinc-950 w-full transition-colors border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-28">
          {/* En-tête style Image 4 : "Nos expertises" rouge bordeaux avec barre dorée en-dessous (sans sous-titre) */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#990000] dark:text-red-500 tracking-tight relative inline-block pb-2.5">
              Nos expertises
              <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-[#f59e0b] rounded-full" />
            </h2>
          </div>

          {/* Grille responsive : sur mobile et tablette 2 sur la même ligne et 2 en dessous (grid-cols-2), sur PC les 4 sur la même ligne (lg:grid-cols-4), sans aucun défilement parallaxe */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full">
            {SERVICES_DATA.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="w-full rounded-none bg-[#f59e0b] text-white p-3.5 sm:p-5 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md transition-all duration-200 min-h-[220px] sm:min-h-[250px]"
              >
                <div className="flex flex-col items-center w-full">
                  {/* Icônes blanches pures compactes */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3.5 flex items-center justify-center text-white">
                    {service.type === 'globe' && (
                      <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    )}
                    {service.type === 'pen' && (
                      <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 19 7-7 3 3-7 7-3-3z" />
                        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                        <path d="m2 2 7.586 7.586" />
                        <circle cx="11" cy="11" r="2" />
                      </svg>
                    )}
                    {service.type === 'code' && (
                      <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    )}
                    {service.type === 'shield' && (
                      <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    )}
                    {service.type === 'vip' && (
                      <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </div>

                  {/* Titre blanc centré */}
                  <h3 className="font-heading font-bold text-sm sm:text-base text-white mb-2 leading-snug">
                    {service.title}
                  </h3>

                  {/* Description séparée par des | style Image 4 */}
                  <p className="text-white/95 text-[11px] sm:text-xs font-normal leading-relaxed line-clamp-4">
                    {service.description}
                  </p>
                </div>

                {/* Lien d'action blanc épuré */}
                <div className="mt-4 pt-3 border-t border-white/20 w-full">
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white hover:text-white/80 transition-colors"
                  >
                    <span>{service.cta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNIÈRE ACCUEIL PRIVILÈGE & CONSEILS PERSONNALISÉS (IMAGE ORIGINALE PURE SANS TEXTE INTÉGRÉ, SANS BUG) */}
      <section className="py-6 sm:py-8 px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1550px] mx-auto w-full">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl min-h-[220px] sm:min-h-[260px] flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-10 lg:p-12 gap-6 bg-zinc-950">
          <img
            src={clientServiceBannerImg}
            alt="Accueil Privilège et Conseils Personnalisés IPM Motors"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dégradé noir profond pour faire ressortir le texte parfaitement */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/35" />

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

      {/* 7. SERVICE APRÈS-VENTE (Fond Blanc pur, espacement réduit & textes sombres nets) */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-white text-zinc-950 w-full border-t border-zinc-200">
        <div className="max-w-[1500px] mx-auto">
          {/* En-tête centré (sans sous-titre supprimé) */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-1">
              Tranquillité d’Esprit
            </span>
            <h2 className="font-heading font-light text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight text-zinc-950">
              Service <span className="font-semibold text-[#e10600]">Après-Vente</span>
            </h2>
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
        </div>
      </section>

      {/* 8. CARTE PARC AUTOMOBILE IPM MOTORS (SANS LOGOS NI BORDURES LOURDES, PLEINEMENT RESPONSIVE) */}
      <section className="py-10 sm:py-14 px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1550px] mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-1">
              Accès & Itinéraire
            </span>
            <h2 className="font-heading font-semibold text-lg sm:text-2xl text-[var(--fg)] tracking-tight">
              Localisez notre Parc Automobile IPM Motors
            </h2>
          </div>
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

        {/* Conteneur de la Carte panoramique responsive */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-md w-full h-[300px] sm:h-[400px]">
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

        {/* 9. ACTUALITÉS (DESIGN FIDÈLE À L'IMAGE 2 & 3 : BORDURES CARRÉES, PETITE TAILLE, TOUT VOIR À CÔTÉ DES CHIFFRES) */}
        <div className="mt-10 sm:mt-14 mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="w-4 h-[2px] bg-[#e10600]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e10600]">
                Actualités & Nouveautés
              </span>
            </div>
            <h2 className="font-heading font-semibold text-xl sm:text-3xl tracking-tight text-[var(--fg)]">
              Nos Dernières <span className="text-[#e10600]">Actualités</span>
            </h2>
          </div>

          {/* Grille des Actualités minimaliste, bordures carrées, 3 sur mobile défilables */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            {displayedNews.map((article) => {
              const articleSlug = article.slug || article.id;
              const waArticleUrl = buildWhatsAppUrl(`Bonjour IPM Motors, je souhaite des renseignements suite à votre article : "${article.title}".`);
              const { day, month } = parseDateBadge(article.published_at);

              return (
                <article
                  key={article.id}
                  className="w-[200px] sm:w-[240px] md:w-auto shrink-0 snap-start group flex flex-col justify-between bg-white dark:bg-zinc-900/70 rounded-none overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all duration-200"
                >
                  <div>
                    {/* Zone Image avec Badge Date en bas à droite carré (Exact Image 2) */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 rounded-none">
                      <Link to={`/actualites/${articleSlug}`} className="block w-full h-full rounded-none">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-none"
                          onError={(e) => {
                            e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                          }}
                        />
                      </Link>

                      {/* Badge Date en bas à droite carré */}
                      <div className="absolute bottom-0 right-2 z-10 bg-white shadow-sm rounded-none px-2 py-0.5 text-center min-w-[42px] border border-b-0 border-zinc-100">
                        <span className="block text-sm sm:text-base font-bold text-[#f39c12] leading-tight">
                          {day}
                        </span>
                        <span className="block text-[9px] font-bold text-[#f39c12] uppercase tracking-wider">
                          {month}
                        </span>
                      </div>

                      {/* Badge Catégorie discret en haut à gauche */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-1.5 py-0.5 rounded-none text-[8px] font-bold tracking-wider uppercase bg-black/75 backdrop-blur-sm text-white">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Titre vert sombre & extrait minimaliste */}
                    <div className="p-3 pb-2">
                      <Link to={`/actualites/${articleSlug}`}>
                        <h3 className="font-heading font-bold text-xs sm:text-sm text-[#064e3b] dark:text-emerald-400 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-light mt-1 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Actions au bas de la carte (Minimaliste carré) */}
                  <div className="px-3 pb-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-1.5">
                    <Link
                      to={`/actualites/${articleSlug}`}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#064e3b] dark:text-emerald-400 hover:underline"
                    >
                      <span>Lire l'article</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>

                    <a
                      href={waArticleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-none bg-emerald-50 dark:bg-emerald-950/40 text-[#064e3b] dark:text-emerald-400 hover:bg-emerald-100 text-[10px] font-semibold transition-all inline-flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/40"
                    >
                      <MessageCircle className="w-2.5 h-2.5 text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination chiffrée petite minimaliste (1 2 3 4 5) avec "Tout voir" à côté */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-3 pb-2 select-none">
            <div className="flex items-center gap-3 sm:gap-4">
              {Array.from({ length: Math.min(5, Math.max(1, Math.ceil(publishedNews.length / 3))) }).map((_, idx) => {
                const isActive = newsSlideIndex === idx;
                return (
                  <button
                    key={idx + 1}
                    type="button"
                    onClick={() => setNewsSlideIndex(idx)}
                    aria-label={`Aller à la page ${idx + 1}`}
                    className={`text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-[#f39c12] scale-110 underline underline-offset-4'
                        : 'text-[#064e3b] dark:text-emerald-500 hover:text-[#f39c12]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <span className="text-zinc-300 dark:text-zinc-700">|</span>

            <Link
              to="/actualites"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#e10600] hover:text-[#c30500] group"
            >
              <span>Tout voir</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
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
