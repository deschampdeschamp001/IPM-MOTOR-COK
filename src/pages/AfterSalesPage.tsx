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

  useEffect(() => {
    document.title = 'Service Après-Vente & Garantie | IPM Motors Abidjan';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7">
            <a
              href={waGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn inline-flex items-center gap-2.5 px-6 py-3 bg-[#e10600] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#e10600]/25 hover:bg-[#c30500] hover:scale-102 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Assistance WhatsApp directe</span>
            </a>
            <a
              href={`tel:${DEALERSHIP_CONFIG.phone}`}
              className="pill-btn inline-flex items-center gap-2.5 px-6 py-3 bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs sm:text-sm font-medium hover:border-zinc-500 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#e10600]" />
              <span>{DEALERSHIP_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ENGAGEMENTS SAV & GARANTIE — 3 BLOCS AVEC IMAGES PROFESSIONNELLES DE CÔTE D'IVOIRE */}
      <section className="py-12 sm:py-16 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto space-y-16 sm:space-y-24">
        
        {/* ENGAGEMENT 01 — Garantie Constructeur Officielle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#e10600] text-[11px] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Engagement 01</span>
            </div>
            <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 tracking-tight">
              Garantie <span className="font-semibold text-[#e10600]">Constructeur Officielle</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
              Tous nos véhicules 0 km bénéficient de la protection constructeur intégrale. Nous assurons l’activation immédiate de votre carnet d’entretien officiel dès la livraison des clés à Cocody Abidjan.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Couverture officielle de 3 à 8 ans selon la marque (jusqu’à 160 000 km pour batteries)',
                'Prise en charge intégrale par les réseaux et concessionnaires agréés',
                'Carnet d’entretien officiel tamponné et remis le jour de la livraison',
                'Traçabilité certifiée 0 km sortie d’usine garantie par PV de conformité',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-[36px_14px_36px_14px] shadow-lg border border-zinc-200 bg-zinc-100 aspect-[16/10]">
              <img
                src={savDealImg}
                alt="Remise officielle de garantie constructeur à Abidjan"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/90">Cocody Abidjan</span>
                <p className="text-sm font-semibold text-white">Garantie constructeur & remise du carnet d’origine</p>
              </div>
            </div>
          </div>
        </div>

        {/* ENGAGEMENT 02 — Ateliers Certifiés & Pièces 100% OEM (Image on left, text on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="order-1">
            <div className="relative group overflow-hidden rounded-[14px_36px_14px_36px] shadow-lg border border-zinc-200 bg-zinc-100 aspect-[16/10]">
              <img
                src={savWorkshopImg}
                alt="Ateliers certifiés et pièces d'origine OEM à Abidjan"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/90">Diagnostic Expert & Pièces OEM</span>
                <p className="text-sm font-semibold text-white">Techniciens ivoiriens certifiés & valises de pointe</p>
              </div>
            </div>
          </div>
          <div className="order-2 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1a44b8] text-[11px] font-bold tracking-wider uppercase">
              <Wrench className="w-3.5 h-3.5" />
              <span>Engagement 02</span>
            </div>
            <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 tracking-tight">
              Ateliers Certifiés & <span className="font-semibold text-[#1a44b8]">Pièces 100% OEM</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
              Pour prolonger la fiabilité et les performances de votre véhicule neuf, nous collaborons avec des centres techniques certifiés partenaires à Abidjan équipés des valises électroniques officielles.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Centres techniques certifiés partenaires à Abidjan (Cocody, Marcory, Zone 4)',
                'Valises électroniques de diagnostic multimarques de dernière génération',
                'Pièces détachées et filtres 100% d’origine constructeur (OEM)',
                'Techniciens formés aux normes tropicalisées et motorisations hybrides/électriques',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#1a44b8] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ENGAGEMENT 03 — Immatriculation & Clés en Main (Représentation Côte d'Ivoire) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold tracking-wider uppercase">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Engagement 03</span>
            </div>
            <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-950 tracking-tight">
              Immatriculation & <span className="font-semibold text-emerald-600">Clés en Main</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
              Toutes les formalités administratives ivoiriennes sont prises en charge avec rigueur et transparence pour que vous preniez le volant l’esprit serein.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Dédouanement complet et certifié auprès des douanes ivoiriennes',
                'Délivrance de la carte grise officielle à votre nom (Quipux / DGTTC)',
                'Fabrication et pose soignée des plaques d’immatriculation homologuées en Côte d’Ivoire',
                'Nettoyage esthétique et remise des clés en main à notre showroom Bonoumin',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-[36px_14px_36px_14px] shadow-lg border border-zinc-200 bg-zinc-100 aspect-[16/10]">
              <img
                src={savKeysImg}
                alt="Délivrance de la carte grise ivoirienne et pose des plaques à Abidjan"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[11px] uppercase tracking-wider font-bold text-white/90">Guichet Unique Automobile</span>
                <p className="text-sm font-semibold text-white">Carte grise ivoirienne, plaques homologuées & clés remises en main propre</p>
              </div>
            </div>
          </div>
        </div>

      </section>

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
