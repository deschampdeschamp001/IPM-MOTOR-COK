import React, { useState, useEffect } from 'react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import {
  ShieldCheck,
  Wrench,
  FileCheck2,
  Plus,
  Minus,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';

import bmwXmWhiteCutout from '../assets/images/bmw_xm_white_cutout.png';
import savDealImg from '../assets/images/ci_garantie_deal_1793449020315.jpg';
import savWorkshopImg from '../assets/images/ci_workshop_tech_1793449044800.jpg';
import savKeysImg from '../assets/images/ci_immat_handover_1793449069146.jpg';
import {
  getServicesSections,
  subscribeToServicesSections,
  ServiceSectionItem
} from '../config/servicesConfig';

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FAQQuestion[] = [
  {
    id: 'faq-1',
    question: 'Les véhicules vendus par IPM Motors sont-ils réellement 100% neufs avec 0 km ?',
    answer: 'Oui, rigoureusement 0 km sans exception. Tous nos véhicules proviennent directement des usines officielles des constructeurs ou de filières agréées. Chaque modèle est vérifié et certifié vierge de toute utilisation antérieure à sa livraison à Abidjan.'
  },
  {
    id: 'faq-2',
    question: 'Peut-on voir et essayer le véhicule avant de finaliser l’achat ?',
    answer: 'Absolument ! Notre showroom et parc automobile privé situé à Cocody Riviera Bonoumin vous accueille 6j/7. Vous pouvez inspecter chaque détail extérieur et intérieur, vous installer à bord et échanger en toute sérénité avec nos conseillers dédiés.'
  },
  {
    id: 'faq-3',
    question: 'Vais-je devoir négocier le prix ou les tarifs sont-ils transparents ?',
    answer: 'Chez IPM MOTORS, la transparence est un engagement contractuel. Nos tarifs sont clairement affichés et englobent tous les frais douaniers, les taxes légales et la préparation du véhicule sans frais cachés.'
  },
  {
    id: 'faq-4',
    question: 'D’où proviennent les véhicules commercialisés par IPM MOTORS ?',
    answer: 'Nos véhicules 0 km sont importés directement des réseaux de distribution européens, asiatiques et du Moyen-Orient selon les normes de tropicalisation indispensables pour rouler en toute fiabilité en Côte d’Ivoire.'
  },
  {
    id: 'faq-5',
    question: 'Quelle est la durée de la garantie constructeur appliquée à Abidjan ?',
    answer: 'Chaque véhicule bénéficie de la garantie constructeur allant de 3 à 8 ans selon la marque (jusqu’à 8 ans ou 160 000 km pour les batteries de traction des modèles 100% électriques BYD). Le carnet d’entretien officiel vous est remis.'
  },
  {
    id: 'faq-6',
    question: 'Comment s’effectuent l’immatriculation et la pose des plaques ivoiriennes ?',
    answer: 'Notre service logistique s’occupe intégralement des démarches auprès du Guichet Unique Automobile (Quipux / DGTTC) : dédouanement complet, carte grise officielle à votre nom et pose des plaques d’immatriculation homologuées en Côte d’Ivoire avant la remise des clés.'
  },
  {
    id: 'faq-7',
    question: 'Où faire entretenir mon véhicule et les pièces de rechange sont-elles disponibles ?',
    answer: 'Nous avons des conventions d’entretien avec des ateliers techniques agréés à Abidjan munis des valises de diagnostic officielles. Toutes les pièces de rechange courantes sont certifiées 100% d’origine constructeur (OEM).'
  },
  {
    id: 'faq-8',
    question: 'Puis-je commander un modèle spécifique sur-mesure ou configurer une finition rare ?',
    answer: 'Oui ! Notre service Commande Sur-Mesure vous accompagne pour configurer exactement le véhicule de votre choix (coloris, sellerie cuir, pack technologique). Nous gérons l’expédition sécurisée et l’immatriculation complète à Abidjan.'
  }
];

export const AfterSalesPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_LIST[0].id);
  const [sections, setSections] = useState<ServiceSectionItem[]>(() => getServicesSections());

  useEffect(() => {
    document.title = 'Service Après-Vente & Garantie | IPM Motors Abidjan';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const unsub = subscribeToServicesSections((updated) => setSections(updated));
    return unsub;
  }, []);

  const sec1 = sections.find((s) => s.id === 'garantie') || sections[0];
  const sec2 = sections.find((s) => s.id === 'ateliers') || sections[1];
  const sec3 = sections.find((s) => s.id === 'immatriculation') || sections[2];

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const waGeneralUrl = buildWhatsAppUrl(
    "Bonjour IPM Motors, je souhaite des renseignements sur la garantie, le service après-vente et la livraison de vos véhicules 0 km."
  );

  const waAskQuestionUrl = buildWhatsAppUrl(
    "Bonjour IPM Motors, j'ai une question spécifique concernant un véhicule 0 km ou le service après-vente."
  );

  return (
    <div className="bg-white text-zinc-950 transition-colors duration-200">
      {/* 1. PREMIÈRE SECTION : SERVICES & GARANTIES (Suppression du titre 'Parc Automobile & Showroom Officiel' selon demande) */}
      <section className="pt-24 sm:pt-28 pb-12 px-4 sm:px-8 lg:px-14 max-w-[1440px] mx-auto w-full">
        {/* En-tête principal */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-[#e10600] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#e10600]" />
            <span>Excellence Technique & Suivi Officiel</span>
          </div>
          <h1 className="font-heading font-light text-2xl sm:text-4xl lg:text-5xl text-zinc-950 dark:text-white tracking-tight leading-tight">
            Services & <span className="font-semibold text-[#e10600]">Garanties Constructeur</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 font-light max-w-2xl mx-auto leading-relaxed">
            Notre centre technique agréé à Cocody Riviera Bonoumin vous accueille 6j/7 pour la présentation de nos véhicules 0 km, vos essais privés et le suivi intégral de votre garantie constructeur.
          </p>

          {/* Boutons d'action rapide côte à côte sur la même ligne */}
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 mt-6 max-w-lg mx-auto w-full">
            <a
              href={waGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-3 sm:px-5 bg-[#e10600] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#e10600]/25 hover:bg-[#c30500] rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer truncate"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">Assistance WhatsApp</span>
            </a>
            <a
              href="tel:0701202021"
              className="flex-1 py-3 px-3 sm:px-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold hover:border-zinc-500 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer truncate"
            >
              <Phone className="w-4 h-4 text-[#e10600] shrink-0" />
              <span className="truncate">07 01 20 20 21</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ENGAGEMENTS SAV & GARANTIE — 3 SECTIONS SANS EFFET DE SURVOL ET SANS TEXTE SUR LES IMAGES (Exact demande) */}
      <div className="w-full space-y-0">
        {/* ENGAGEMENT 01 — Garantie Constructeur Officielle (Full-Bleed Fond Blanc, Image Pure sans texte ni hover) */}
        {sec1 && (
          <section className="engagement engagement--media-right bg-white dark:bg-[#0c0c0e] text-zinc-950 dark:text-white border-t border-zinc-100 dark:border-zinc-800">
            <div className="engagement__text space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-[#e10600] text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{sec1.badge || 'Engagement 01'}</span>
              </div>
              <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 dark:text-white tracking-tight">
                Garantie <span className="font-semibold text-[#e10600]">{sec1.titleHighlight || 'Constructeur Officielle'}</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                {sec1.subtitle}
              </p>
              <ul className="space-y-2.5 pt-2">
                {sec1.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image pure sans texte superposé et sans effet de survol */}
            <div className="engagement__media">
              <div className="relative overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:h-full md:min-h-[380px]">
                <img
                  src={sec1.image || savDealImg}
                  alt={sec1.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* ENGAGEMENT 02 — Ateliers Certifiés & Pièces 100% OEM (Image Pure sans texte ni hover) */}
        {sec2 && (
          <section className="engagement engagement--media-left bg-[#0f172a] text-white shadow-md">
            <div className="engagement__text space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wider uppercase">
                <Wrench className="w-3.5 h-3.5" />
                <span>{sec2.badge || 'Engagement 02'}</span>
              </div>
              <h2 className="font-heading font-light text-2xl sm:text-4xl text-white tracking-tight">
                Ateliers Certifiés & <span className="font-semibold text-blue-400">{sec2.titleHighlight || 'Pièces 100% OEM'}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                {sec2.subtitle}
              </p>
              <ul className="space-y-2.5 pt-2">
                {sec2.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image pure sans texte superposé et sans effet de survol */}
            <div className="engagement__media">
              <div className="relative overflow-hidden shadow-md border border-slate-700 bg-slate-800 aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:h-full md:min-h-[380px]">
                <img
                  src={sec2.image || savWorkshopImg}
                  alt={sec2.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* ENGAGEMENT 03 — Immatriculation & Clés en Main (Image Pure sans texte ni hover) */}
        {sec3 && (
          <section className="engagement engagement--media-right bg-zinc-50/80 dark:bg-[#121215] text-zinc-950 dark:text-white border-t border-b border-zinc-200 dark:border-zinc-800">
            <div className="engagement__text space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold tracking-wider uppercase">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{sec3.badge || 'Engagement 03'}</span>
              </div>
              <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 dark:text-white tracking-tight">
                Immatriculation & <span className="font-semibold text-emerald-600 dark:text-emerald-400">{sec3.titleHighlight || 'Clés en Main'}</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                {sec3.subtitle}
              </p>
              <ul className="space-y-2.5 pt-2">
                {sec3.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image pure sans texte superposé et sans effet de survol */}
            <div className="engagement__media">
              <div className="relative overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:h-full md:min-h-[380px] flex items-center justify-center p-2">
                <img
                  src={sec3.image || savKeysImg}
                  alt={sec3.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* 3. NOUVEAU DESIGN ÉLÉGANT QUESTIONS ET RÉPONSES (ACCORDÉON LUXE AVEC BMW XM) */}
      <section className="relative py-16 sm:py-24 bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 overflow-x-hidden">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-14 items-center">
            
            {/* Colonne gauche : BMW XM Cutout 2026 coupé sur le bord gauche */}
            <div className="lg:col-span-5 relative order-1 lg:order-none select-none pointer-events-none">
              <div className="relative">
                <img
                  src={bmwXmWhiteCutout}
                  alt="BMW XM 2026 IPM Motors"
                  loading="lazy"
                  className="relative z-10 w-[115%] max-w-none -ml-[8%] lg:w-[130%] lg:-ml-[18%] select-none pointer-events-none object-contain drop-shadow-sm"
                />
                <div className="absolute left-[4%] right-[12%] bottom-[2%] h-7 rounded-[50%] bg-black/40 blur-2xl z-0" />
              </div>
            </div>

            {/* Colonne droite : Nouveau Design Accordéon Questions et Réponses */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Entête épurée et moderne */}
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-5 h-[2px] bg-[#e10600]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e10600]">
                    FAQ & Assistance Client
                  </span>
                </div>
                <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 dark:text-white tracking-tight">
                  Questions & <span className="font-semibold text-[#e10600]">Réponses</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                  Tout ce qu’il faut savoir sur nos véhicules 0 km, garanties et livraisons à Abidjan.
                </p>
              </div>

              {/* Bouton d'action "Poser une question" */}
              <div>
                <a
                  href={waAskQuestionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-[#e10600] dark:hover:bg-[#e10600] dark:hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Poser une question sur WhatsApp</span>
                </a>
              </div>

              {/* Liste d'accordéons modernes avec coins arrondis et transitions douces */}
              <div className="space-y-3 pt-2">
                {FAQ_LIST.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'bg-zinc-50/90 dark:bg-zinc-900/90 border-[#e10600]/40 shadow-xs'
                          : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isExpanded}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-heading text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:text-[#e10600] dark:hover:text-[#e10600] transition-colors cursor-pointer"
                      >
                        <span className="leading-snug pr-2">{item.question}</span>
                        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isExpanded ? 'bg-[#e10600] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}>
                          {isExpanded ? (
                            <Minus className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. BANDEAU DE CONTACT SHOWROOM BONOUMIN */}
      <section className="py-10 bg-zinc-50 border-t border-zinc-200 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h3 className="font-heading font-medium text-base sm:text-lg text-zinc-950">
              Une question sur une garantie ou les démarches administratives ?
            </h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e10600]" />
                Cocody Riviera Bonoumin, Abidjan
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#e10600]" />
                Lun - Sam : 08h00 - 18h30
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={waGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn px-6 py-3 bg-[#e10600] text-white text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#c30500] shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter un conseiller</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
