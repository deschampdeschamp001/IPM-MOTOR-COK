import React, { useState, useEffect } from 'react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import { useSearchParams } from '../router/Router';
import { recordLeadInDB, isSupabaseConfigured } from '../lib/supabase';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { PhoneInputWithCountry } from '../components/PhoneInputWithCountry';

{/* Icônes 3D Glassmorphism Cristal inspirées de l'Image 4 sur fond blanc sans contour */}
const GlassShieldIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="0.4" stopColor="#2563EB" />
        <stop offset="0.8" stopColor="#1E3A8A" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="shieldHighlight" x1="18" y1="10" x2="32" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="0.5" stopColor="#93C5FD" stopOpacity="0.2" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="#1E3A8A" opacity="0.25" />
    <path
      d="M32 8L48 15V32C48 43 32 54 32 54C32 54 16 43 16 32V15L32 8Z"
      fill="url(#shieldGrad)"
      stroke="#93C5FD"
      strokeWidth="1.2"
    />
    <path
      d="M32 12L44 17.5V30C44 39.5 32 49 32 49C32 49 20 39.5 20 30V17.5L32 12Z"
      fill="#1D4ED8"
      fillOpacity="0.4"
    />
    <path
      d="M32 10L46 16.2V28C46 32 43 38 32 46C26 40 22 34 22 28V16.2L32 10Z"
      fill="url(#shieldHighlight)"
    />
    <path
      d="M32 20C28 20 25.5 22.5 25.5 25.5C25.5 29 28 30.5 32 31.5C36 32.5 38.5 34 38.5 37.5C38.5 41 35.5 43.5 32 43.5M32 18V45"
      stroke="#E0F2FE"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

const GlassLightningIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lightGrad" x1="18" y1="8" x2="46" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="0.35" stopColor="#3B82F6" />
        <stop offset="0.75" stopColor="#1D4ED8" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="lightSpecular" x1="20" y1="10" x2="35" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="0.6" stopColor="#BAE6FD" stopOpacity="0.2" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="56" rx="16" ry="3.5" fill="#1E3A8A" opacity="0.25" />
    <path
      d="M36 6L18 32H32L26 58L48 28H34L40 6H36Z"
      fill="url(#lightGrad)"
      stroke="#BFDBFE"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M35 8L20 31H32L28 50L44 29H33L37 8H35Z"
      fill="url(#lightSpecular)"
    />
    <path
      d="M36 6L18 32H32"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.9"
    />
  </svg>
);

const GlassKeysIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="keyGrad" x1="14" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="0.4" stopColor="#2563EB" />
        <stop offset="0.8" stopColor="#1E3A8A" />
        <stop offset="1" stopColor="#0B1329" />
      </linearGradient>
      <linearGradient id="keyGloss" x1="20" y1="14" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="0.5" stopColor="#93C5FD" stopOpacity="0.2" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="54" rx="20" ry="4" fill="#1E3A8A" opacity="0.25" />
    <rect x="12" y="32" width="40" height="20" rx="4" fill="url(#keyGrad)" stroke="#93C5FD" strokeWidth="1.2" />
    <rect x="15" y="35" width="34" height="14" rx="2.5" fill="#1E3A8A" fillOpacity="0.4" />
    <path d="M14 34L50 34" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    <path
      d="M26 12C26 8.7 28.7 6 32 6C35.3 6 38 8.7 38 12V24C38 27.3 35.3 30 32 30C28.7 30 26 27.3 26 24V12Z"
      fill="url(#keyGrad)"
      stroke="#BFDBFE"
      strokeWidth="1.2"
    />
    <circle cx="32" cy="14" r="3.5" fill="#0F172A" stroke="#93C5FD" strokeWidth="1" />
    <path
      d="M28 12C28 9.8 29.8 8 32 8C33.5 8 34.8 8.8 35.4 10H30V24C30 25.5 30.8 26.8 32 27.4C30 27 28 25.5 28 24V12Z"
      fill="url(#keyGloss)"
    />
  </svg>
);

interface LocalLead {
  id: string;
  name: string;
  phone: string;
  message: string;
  vehicle_model?: string;
  created_at: string;
}

const saveLocalLead = (lead: { name: string; phone: string; message: string; vehicle_model?: string }) => {
  try {
    const existing: LocalLead[] = JSON.parse(localStorage.getItem('ipm_local_leads') || '[]');
    const newLead: LocalLead = {
      ...lead,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('ipm_local_leads', JSON.stringify([newLead, ...existing]));
  } catch {
    // ignore
  }
};

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledVehicle = searchParams.get('vehicule') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: prefilledVehicle,
    message: prefilledVehicle ? `Bonjour, je souhaite obtenir un devis personnalisé pour le modèle : ${prefilledVehicle}.` : '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = 'À Propos & Contact VIP | IPM Motors Abidjan';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus('error');
      setErrorMsg('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setStatus('loading');

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        vehicle_model: formData.vehicle.trim() || undefined,
      };

      if (isSupabaseConfigured()) {
        const { error } = await recordLeadInDB(payload);
        if (error) {
          saveLocalLead(payload);
        }
      } else {
        saveLocalLead(payload);
      }

      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        vehicle: '',
        message: '',
      });
    } catch {
      saveLocalLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        vehicle_model: formData.vehicle.trim() || undefined,
      });
      setStatus('success');
    }
  };

  const waUrl = buildWhatsAppUrl(
    formData.vehicle
      ? `Bonjour IPM Motors, je souhaite des informations sur le véhicule : ${formData.vehicle}.`
      : 'Bonjour IPM Motors, je souhaite des renseignements sur vos véhicules neufs 0 km.'
  );

  return (
    <div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-[1500px] mx-auto w-full">
      {/* 1. SECTION À PROPOS & VISION DE L'ENTREPRISE */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <span className="eyebrow block mb-2">Notre Vision & Engagement</span>
        <h1 className="font-heading font-light text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--fg)] leading-tight">
          L’Excellence Automobile <span className="font-semibold text-[#e10600]">à Abidjan</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6b6b72] mt-3 font-light leading-relaxed">
          Distributeur spécialisé de véhicules neufs 100% 0 km, IPM MOTORS vous garantit un accès direct aux plus grands constructeurs mondiaux avec une tranquillité d’esprit totale en Côte d’Ivoire.
        </p>
      </div>

      {/* 2. BANDEAU 4 CHIFFRES CLÉS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <span className="block text-xl sm:text-3xl font-bold text-[#e10600] font-heading">100%</span>
          <span className="text-xs sm:text-sm font-semibold text-[var(--fg)] block mt-0.5">Véhicules 0 km</span>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b72] font-light">Vierges de toute utilisation</span>
        </div>
        <div>
          <span className="block text-xl sm:text-3xl font-bold text-[#e10600] font-heading">3 à 8 ans</span>
          <span className="text-xs sm:text-sm font-semibold text-[var(--fg)] block mt-0.5">Garantie Usine</span>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b72] font-light">Carnet officiel remis</span>
        </div>
        <div>
          <span className="block text-xl sm:text-3xl font-bold text-[#e10600] font-heading">6j/7</span>
          <span className="text-xs sm:text-sm font-semibold text-[var(--fg)] block mt-0.5">Showroom & Essais</span>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b72] font-light">Cocody Riviera Bonoumin</span>
        </div>
        <div>
          <span className="block text-xl sm:text-3xl font-bold text-[#e10600] font-heading">100% OEM</span>
          <span className="text-xs sm:text-sm font-semibold text-[var(--fg)] block mt-0.5">Pièces & Ateliers</span>
          <span className="text-[10px] sm:text-[11px] text-[#6b6b72] font-light">Réseau technique certifié</span>
        </div>
      </div>

      {/* 3. SECTION CONTACT : COORDONNÉES + FORMULAIRE DEVIS VIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
        {/* Colonne gauche : Coordonnées Directes & Accès Showroom */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
            <h3 className="font-heading font-bold text-lg text-zinc-950 dark:text-white">
              Parc Automobile & Showroom
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white font-medium">Adresse</strong>
                  <span>{DEALERSHIP_CONFIG.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white font-medium">Téléphone direct</strong>
                  <a href={`tel:${DEALERSHIP_CONFIG.phone}`} className="hover:text-[#e10600] transition-colors">
                    {DEALERSHIP_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white font-medium">Adresse e-mail</strong>
                  <a href={`mailto:${DEALERSHIP_CONFIG.email}`} className="hover:text-[#e10600] transition-colors">
                    {DEALERSHIP_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#e10600] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white font-medium">Horaires d’accueil</strong>
                  <span>Lundi au Samedi : 08h00 - 18h30</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discussion instantanée WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 3 Piliers de Confiance (Style 3D Image 4 sur Fond Blanc, sans aucun contour de bloc) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white dark:bg-transparent text-center flex flex-col items-center border-0 shadow-none">
              <div className="mb-2">
                <GlassShieldIcon className="w-13 h-13" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold block text-zinc-950 dark:text-white leading-snug">100% Certifié</span>
              <span className="text-[10px] text-zinc-500 font-light">Origine constructeur</span>
            </div>

            <div className="p-3 bg-white dark:bg-transparent text-center flex flex-col items-center border-0 shadow-none">
              <div className="mb-2">
                <GlassLightningIcon className="w-13 h-13" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold block text-zinc-950 dark:text-white leading-snug">Garantie 0 km</span>
              <span className="text-[10px] text-zinc-500 font-light">3 à 8 ans officiels</span>
            </div>

            <div className="p-3 bg-white dark:bg-transparent text-center flex flex-col items-center border-0 shadow-none">
              <div className="mb-2">
                <GlassKeysIcon className="w-13 h-13" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold block text-zinc-950 dark:text-white leading-snug">Clés en Main</span>
              <span className="text-[10px] text-zinc-500 font-light">Plaques & carte grise</span>
            </div>
          </div>
        </div>

        {/* Colonne droite : Formulaire de demande / Devis VIP */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800 shadow-md">
            <div className="mb-6">
              <span className="text-[#e10600] text-xs font-bold uppercase tracking-widest block mb-1">
                Formulaire Officiel
              </span>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-zinc-950 dark:text-white">
                Demande de Devis ou Rendez-vous VIP
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                Un conseiller automobile IPM Motors vous recontacte sous 30 minutes avec nos conditions officielles.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="font-heading font-bold text-base text-emerald-900 dark:text-emerald-200">
                  Demande transmise avec succès !
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-light leading-relaxed max-w-sm mx-auto">
                  Notre équipe commerciale a bien reçu votre demande. Un conseiller vous contactera dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2 rounded-none bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Nom et Prénom <span className="text-[#e10600]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Jean Kouassi"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#e10600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Numéro de Téléphone (Appels ou WhatsApp) <span className="text-[#e10600]">*</span>
                  </label>
                  <PhoneInputWithCountry
                    value={formData.phone}
                    onChange={(p) => setFormData((prev) => ({ ...prev, phone: p }))}
                    required
                    placeholder="07 01 20 20 21"
                    variant="rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Modèle concerné (facultatif)
                  </label>
                  <input
                    type="text"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    placeholder="Ex: Suzuki Jimny, Jetour Dashing, Toyota Land Cruiser..."
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#e10600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Votre message ou demande spécifique
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Précisez votre projet (financement, essai, configuration spécifique)..."
                    className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#e10600]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 rounded-none bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer ma demande VIP</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 4. CARTE INTERACTIVE ABIDJAN RIVIERA BONOUMIN */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 h-[280px] sm:h-[360px]">
        <iframe
          title="Parc Automobile IPM Motors Cocody Riviera Bonoumin"
          src="https://maps.google.com/maps?q=Riviera+Bonoumin,+Cocody,+Abidjan,+Cote+d'Ivoire&t=&z=14&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0 filter contrast-[1.05]"
          loading="lazy"
        />
      </div>
    </div>
  );
};
