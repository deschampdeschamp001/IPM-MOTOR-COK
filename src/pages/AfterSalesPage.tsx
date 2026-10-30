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
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import bmwXmImg from '../assets/images/bmw_xm_front_cut_1793375396928.jpg';
import savDealImg from '../assets/images/sav_handshake_deal_1793375478850.jpg';
import savWorkshopImg from '../assets/images/sav_workshop_tech_1793375496830.jpg';
import savKeysImg from '../assets/images/sav_immatriculation_keys_1793375516416.jpg';

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
    answer: 'Chaque véhicule bénéficie de la garantie constructeur allant de 3 à 8 ans selon la marque (jusqu’à 8 ans ou 160 000 km pour les batteries de traction des modèles 100% électriques BYD). Le carnet d’entretien d’origine vous est remis.'
  },
  {
    id: 'faq-6',
    question: 'Comment s’effectuent l’immatriculation et la pose des plaques ivoiriennes ?',
    answer: 'Notre service logistique s’occupe intégralement des démarches auprès du Guichet Unique Automobile (Quipux / DGTTC). Votre véhicule vous est livré avec sa carte grise ivoirienne et ses plaques homologuées déjà posées.'
  },
  {
    id: 'faq-7',
    question: 'Où faire entretenir mon véhicule et les pièces de rechange sont-elles disponibles ?',
    answer: 'Nous avons des conventions d’entretien avec des ateliers techniques agréés à Abidjan munis des valises de diagnostic officielles. Toutes les pièces de rechange courantes sont en stock ou acheminées en fret express sous 5 à 7 jours.'
  },
  {
    id: 'faq-8',
    question: 'Puis-je commander un modèle spécifique sur-mesure ou configurer une finition rare ?',
    answer: 'Oui ! Notre service Commande Sur-Mesure vous accompagne pour configurer exactement le véhicule de votre choix (coloris, sellerie cuir, pack technologique). Nous gérons l’expédition sécurisée jusqu’à Cocody.'
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
    "Bonjour IPM Motors, j'ai une question spécifique concernant un véhicule ou le service après-vente."
  );

  return (
    <div className="bg-white dark:bg-[#0b0b0c] text-[var(--fg)] transition-colors duration-300">
      {/* 1. HERO HEADER */}
      <section className="pt-24 sm:pt-32 pb-14 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <span className="eyebrow block mb-2 text-[#e10600]">
            Transparence & Sérénité
          </span>
          <h1 className="font-heading font-light text-3xl sm:text-5xl lg:text-6xl tracking-tight text-zinc-900 dark:text-white">
            Service Après-Vente & <span className="font-semibold text-[#e10600]">Garantie</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 font-light leading-relaxed">
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
              className="pill-btn inline-flex items-center gap-2.5 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-medium hover:border-zinc-400 dark:hover:border-zinc-500 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#e10600]" />
              <span>{DEALERSHIP_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ENGAGEMENTS SAV & GARANTIE — ALTERNATING SPLIT BLOCKS (Style Capture 4) */}
      <section className="py-12 sm:py-16 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto space-y-16 sm:space-y-24">
        
        {/* ENGAGEMENT 01 — Garantie Constructeur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[#e10600] text-[11px] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Engagement 01</span>
            </div>
            <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
              Garantie <span className="font-semibold text-[#e10600]">Constructeur Officielle</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Tous nos véhicules 0 km bénéficient de la protection constructeur intégrale. Nous assurons l’activation immédiate de votre carnet d’entretien officiel dès la livraison des clés.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Couverture étendue de 3 à 8 ans selon le constructeur',
                'Garantie spécifique jusqu’à 160 000 km pour les batteries électriques (BYD)',
                'Prise en charge officielle par les réseaux agréés des marques',
                'Carnet d’entretien officiel tamponné et remis le jour de la livraison',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-[36px_14px_36px_14px] shadow-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 aspect-[16/11]">
              <img
                src={savDealImg}
                alt="Garantie constructeur IPM Motors"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">Sérénité d'achat</span>
                <p className="text-sm font-medium text-white">Protection certifiée 0 km d'origine constructeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* ENGAGEMENT 02 — Ateliers & Pièces d'Origine (Image on left, text on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="order-1">
            <div className="relative group overflow-hidden rounded-[14px_36px_14px_36px] shadow-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 aspect-[16/11]">
              <img
                src={savWorkshopImg}
                alt="Ateliers certifiés et pièces d'origine IPM Motors"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">Diagnostic Haute Précision</span>
                <p className="text-sm font-medium text-white">Valises électroniques multimarques & outillage de pointe</p>
              </div>
            </div>
          </div>
          <div className="order-2 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-[11px] font-bold tracking-wider uppercase">
              <Wrench className="w-3.5 h-3.5" />
              <span>Engagement 02</span>
            </div>
            <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
              Ateliers Certifiés & <span className="font-semibold text-blue-600 dark:text-blue-400">Pièces 100% OEM</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Pour prolonger les performances de votre véhicule, nous collaborons avec les centres techniques les plus qualifiés d’Abidjan, équipés des outillages les plus modernes.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Partenariat avec des ateliers hautement certifiés à Abidjan (Cocody, Marcory, Zone 4)',
                'Valises de diagnostic officielles multi-marques pour reprogrammation et mises à jour',
                'Pièces détachées d’origine OEM garantissant la longévité de votre moteur',
                'Techniciens formés aux spécifications techniques et aux climats tropicaux',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ENGAGEMENT 03 — Immatriculation Clé en Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-wider uppercase">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Engagement 03</span>
            </div>
            <h2 className="font-heading font-light text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight">
              Immatriculation & <span className="font-semibold text-emerald-600 dark:text-emerald-400">Clés en Main</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Finies les démarches administratives complexes. IPM MOTORS s'occupe de l’intégralité des formalités légales et fiscales afin que vous preniez la route en toute conformité.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Dédouanement complet et certifié auprès des douanes ivoiriennes',
                'Délivrance de la carte grise officielle à votre nom (Quipux / DGTTC)',
                'Fabrication et pose soignée des plaques d’immatriculation homologuées',
                'Nettoyage esthétique et remise des clés en main à notre showroom Bonoumin',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-[36px_14px_36px_14px] shadow-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 aspect-[16/11]">
              <img
                src={savKeysImg}
                alt="Livraison clé en main IPM Motors"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">Formalités Simplifiées</span>
                <p className="text-sm font-medium text-white">Carte grise ivoirienne et plaques posées avant livraison</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. FAQ SECTION AVEC BMW XM 2026 SUR LE CÔTÉ GAUCHE (Style exact Image 1) */}
      <section className="relative py-16 sm:py-24 bg-white dark:bg-[#0b0b0c] border-t border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Colonne gauche : BMW XM 2026 coupée sur le bord gauche comme Image 1 */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-start">
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <img
                    src={bmwXmImg}
                    alt="BMW XM 2026 IPM Motors"
                    loading="lazy"
                    className="w-full h-auto object-cover object-left transform -translate-x-3 sm:-translate-x-6 scale-105 transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>BMW XM 2026 • 0 KM</span>
                  </div>
                </div>

                {/* Badge showroom subtil */}
                <div className="hidden sm:flex items-center gap-3 mt-4 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 text-[#e10600] shrink-0" />
                  <span>Disponible immédiatement dans notre showroom à Bonoumin</span>
                </div>
              </div>
            </div>

            {/* Colonne droite : Accordéon questions fréquentes (Exact Image 1 layout) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Entête avec ligne d'accent bleue comme Image 1 */}
              <div>
                <div className="w-12 h-1 bg-[#1a44b8] rounded-full mb-3" />
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
                  Questions et réponses
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal mt-1">
                  Les questions fréquentes de nos clients
                </p>
              </div>

              {/* Bouton d'action outline "POSER UNE QUESTION" comme Image 1 */}
              <div>
                <a
                  href={waAskQuestionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#1a44b8] text-[#1a44b8] hover:bg-[#1a44b8] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Poser une question</span>
                </a>
              </div>

              {/* Liste d'accordéons blancs avec bouton +/- (Style exact Image 1) */}
              <div className="space-y-3 pt-2">
                {FAQ_LIST.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isExpanded}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-heading text-sm sm:text-base font-normal text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="leading-snug pr-2">{item.question}</span>
                        <div className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                          {isExpanded ? (
                            <Minus className="w-4 h-4 text-[#1a44b8]" />
                          ) : (
                            <Plus className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3.5 bg-zinc-50/50 dark:bg-zinc-950/30">
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

      {/* 4. BANDEAU DE CONTACT & RENDEZ-VOUS SHOWROOM */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <h3 className="font-heading font-medium text-base sm:text-lg text-zinc-900 dark:text-white">
              Une question sur une garantie ou un devis d’entretien ?
            </h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500 dark:text-zinc-400">
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
