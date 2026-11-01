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
      {/* 1. HERO HEADER (Fond blanc pur, textes sombres nets) */}
      <section className="pt-24 sm:pt-32 pb-14 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <span className="eyebrow block mb-2 text-[#e10600]">
            Transparence & Sérénité
          </span>
          <h1 className="font-heading font-light text-3xl sm:text-5xl lg:text-6xl tracking-tight text-zinc-950">
            Service Après-Vente & <span className="font-semibold text-[#e10600]">Garantie</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 mt-4 font-light leading-relaxed">
            Chez IPM MOTORS, l’acquisition d’un véhicule 0 km s’accompagne d’un suivi rigoureux. Nous assurons la garantie constructeur, l'entretien certifié et les démarches administratives à Abidjan.
          </p>

          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 mt-7 max-w-lg mx-auto w-full">
            <a
              href={waGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-3 sm:px-5 bg-[#e10600] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#e10600]/25 hover:bg-[#c30500] rounded-none flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer truncate"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">Assistance WhatsApp</span>
            </a>
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone}`}
              className="flex-1 py-3 px-3 sm:px-5 bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs sm:text-sm font-semibold hover:border-zinc-500 rounded-none flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer truncate"
            >
              <Phone className="w-4 h-4 text-[#e10600] shrink-0" />
              <span className="truncate">{DEALERSHIP_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ENGAGEMENTS SAV & GARANTIE — 3 SECTIONS FULL-BLEED AVEC IMAGES DÉFINIES DEPUIS L'ADMIN */}
      <div className="w-full space-y-0">
        {/* ENGAGEMENT 01 — Garantie Constructeur Officielle (Full-Bleed Fond Blanc) */}
        {sec1 && (
          <section className="full-bleed bg-white text-zinc-950 py-12 sm:py-16 border-t border-zinc-100">
            <div className="full-bleed__inner max-w-[1100px] mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-red-50 border border-red-200 text-[#e10600] text-[11px] font-bold tracking-wider uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{sec1.badge || 'Engagement 01'}</span>
                  </div>
                  <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 tracking-tight">
                    Garantie <span className="font-semibold text-[#e10600]">{sec1.titleHighlight || 'Constructeur Officielle'}</span>
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                    {sec1.subtitle}
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {sec1.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image définie depuis l'admin */}
                <div className="order-1 md:order-2">
                  <div className="relative group overflow-hidden rounded-none shadow-md border border-zinc-200 bg-zinc-100 aspect-[16/10]">
                    <img
                      src={sec1.image || savDealImg}
                      alt={sec1.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white/90 block">
                        {sec1.locationBadge || 'Cocody Abidjan'}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {sec1.caption || 'Garantie constructeur & remise du carnet d’origine'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ENGAGEMENT 02 — Ateliers Certifiés & Pièces 100% OEM (Full-Bleed Fond #0f172a Slate Sombre) */}
        {sec2 && (
          <section className="full-bleed bg-[#0f172a] text-white py-12 sm:py-16 shadow-md">
            <div className="full-bleed__inner max-w-[1100px] mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Image définie depuis l'admin */}
                <div className="order-1">
                  <div className="relative group overflow-hidden rounded-none shadow-md border border-slate-700 bg-slate-800 aspect-[16/10]">
                    <img
                      src={sec2.image || savWorkshopImg}
                      alt={sec2.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">
                        {sec2.locationBadge || 'Diagnostic Expert & Pièces OEM'}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {sec2.caption || 'Techniciens certifiés & valises diagnostiques officielles'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-2 space-y-4">
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
              </div>
            </div>
          </section>
        )}

        {/* ENGAGEMENT 03 — Immatriculation & Clés en Main (Full-Bleed Fond Blanc Pur) */}
        {sec3 && (
          <section className="full-bleed bg-zinc-50/80 text-zinc-950 py-12 sm:py-16 border-t border-b border-zinc-200">
            <div className="full-bleed__inner max-w-[1100px] mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold tracking-wider uppercase">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{sec3.badge || 'Engagement 03'}</span>
                  </div>
                  <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 tracking-tight">
                    Immatriculation & <span className="font-semibold text-emerald-600">{sec3.titleHighlight || 'Clés en Main'}</span>
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                    {sec3.subtitle}
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {sec3.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image définie depuis l'admin */}
                <div className="order-1 md:order-2">
                  <div className="relative group overflow-hidden rounded-none shadow-md border border-zinc-200 bg-white aspect-[16/10] flex items-center justify-center p-2">
                    <img
                      src={sec3.image || savKeysImg}
                      alt={sec3.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white/90 block">
                        {sec3.locationBadge || 'Guichet Unique Automobile'}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {sec3.caption || 'Carte grise ivoirienne, plaques homologuées & clés remises en main propre'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* 3. SECTION FAQ AVEC BMW XM ENTRANTE SUR LA GAUCHE (Exact style Image 1 & Image 3) */}
      <section className="relative py-16 sm:py-24 bg-white border-t border-zinc-200 overflow-x-hidden">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-14 items-center">
            
            {/* Colonne gauche : BMW XM Cutout 2026 coupé sur le bord gauche de l'écran avec ombre douce au sol */}
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

            {/* Colonne droite : Accordéon questions et réponses (Design minimaliste exact Image 1) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Entête minimaliste avec barre bleue exacte Image 1 */}
              <div>
                <div className="w-12 h-1 bg-[#1a44b8] rounded-full mb-3" />
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tight">
                  Questions et réponses
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-1">
                  Les questions fréquentes de nos clients
                </p>
              </div>

              {/* Bouton d'action outline "POSER UNE QUESTION" style Image 1 */}
              <div>
                <a
                  href={waAskQuestionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded border border-[#1a44b8] text-[#1a44b8] hover:bg-[#1a44b8] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Poser une question</span>
                </a>
              </div>

              {/* Liste d'accordéons blancs avec bouton +/- (Style minimaliste exact Image 1) */}
              <div className="space-y-2.5 pt-2">
                {FAQ_LIST.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-md border border-zinc-200 bg-white shadow-2xs overflow-hidden transition-all duration-150"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isExpanded}
                        className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-4 font-heading text-xs sm:text-sm font-normal text-zinc-800 hover:text-zinc-950 transition-colors cursor-pointer"
                      >
                        <span className="leading-snug pr-2">{item.question}</span>
                        <div className="shrink-0 w-5 h-5 flex items-center justify-center text-zinc-400 font-light">
                          {isExpanded ? (
                            <Minus className="w-4 h-4 text-[#1a44b8]" />
                          ) : (
                            <Plus className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 sm:px-4 pb-4 pt-1 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed border-t border-zinc-100 bg-zinc-50/40">
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
