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

          {/* 3 Piliers de Confiance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-center">
              <ShieldCheck className="w-5 h-5 text-[#e10600] mx-auto mb-1.5" />
              <span className="text-[11px] font-bold block text-zinc-900 dark:text-white">100% Certifié</span>
              <span className="text-[10px] text-zinc-500 font-light">Origine constructeur</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-center">
              <Award className="w-5 h-5 text-[#e10600] mx-auto mb-1.5" />
              <span className="text-[11px] font-bold block text-zinc-900 dark:text-white">Garantie 0 km</span>
              <span className="text-[10px] text-zinc-500 font-light">3 à 8 ans officiels</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-center">
              <Sparkles className="w-5 h-5 text-[#e10600] mx-auto mb-1.5" />
              <span className="text-[11px] font-bold block text-zinc-900 dark:text-white">Clés en Main</span>
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
                  className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
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
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+225 07 XX XX XX XX"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#e10600]"
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
                  className="w-full py-3.5 rounded-full bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
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
