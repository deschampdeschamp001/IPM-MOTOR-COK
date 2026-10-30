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
  ArrowUpRight
} from 'lucide-react';

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
    document.title = 'Contact & Devis VIP | IPM Motors Abidjan';
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
          // fallback to localStorage
          saveLocalLead(payload);
        }
      } else {
        saveLocalLead(payload);
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Une erreur est survenue lors de l’envoi. Veuillez nous contacter via WhatsApp ou téléphone.');
    }
  };

  const saveLocalLead = (lead: any) => {
    const existing = JSON.parse(localStorage.getItem('ipm_leads') || '[]');
    const newLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('ipm_leads', JSON.stringify([newLead, ...existing]));
  };

  const waMessage = formData.vehicle
    ? `Bonjour IPM Motors, je souhaite des informations sur le véhicule 0 km suivant : ${formData.vehicle}. Mon nom est ${formData.name || ''}.`
    : `Bonjour IPM Motors, je souhaite échanger avec un conseiller commercial concernant vos véhicules neufs en stock.`;
  const waUrl = buildWhatsAppUrl(waMessage);

  return (
    <div className="pt-24 sm:pt-32 pb-24 max-w-[1550px] mx-auto px-8 sm:px-14 md:px-18 lg:px-24 xl:px-32 2xl:px-44">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="eyebrow block mb-2">Parc Automobile & Devis Express</span>
        <h1 className="font-heading font-light text-3xl sm:text-5xl tracking-tight">
          Contactez <span className="font-semibold text-[#e10600]">IPM Motors</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6b6b72] mt-3 font-light leading-relaxed">
          Notre équipe est à votre disposition pour vous orienter, établir un devis personnalisé ou convenir d’un rendez-vous privé au parc automobile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form & WhatsApp CTA (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--border)]">
              <div>
                <h2 className="font-heading font-medium text-xl">Demande de devis VIP</h2>
                <p className="text-xs text-[#6b6b72] mt-1 font-light">
                  Réponse sous 2 heures ouvrées par nos conseillers
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp direct</span>
              </a>
            </div>

            {status === 'success' ? (
              <div className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-xl mb-2">Demande enregistrée avec succès !</h3>
                <p className="text-xs leading-relaxed max-w-md mx-auto mb-6">
                  Merci pour votre confiance. Un conseiller commercial IPM Motors prendra contact avec vous dans les plus brefs délais au {formData.phone}.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFormData({ name: '', phone: '', vehicle: '', message: '' });
                  }}
                  className="pill-btn px-6 py-2.5 bg-emerald-600 text-white text-xs font-semibold"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6b6b72] mb-1.5">
                    Nom & Prénoms *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: M. Jean-Eudes Konan"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] text-xs sm:text-sm focus:outline-none focus:border-[#e10600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6b6b72] mb-1.5">
                    Numéro de Téléphone (avec indicatif) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: +225 07 00 00 00 00"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] text-xs sm:text-sm focus:outline-none focus:border-[#e10600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6b6b72] mb-1.5">
                    Modèle ou Marque Souhaitée (Optionnel)
                  </label>
                  <input
                    type="text"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    placeholder="Ex: Toyota Land Cruiser LC300 VXR ou BYD Seal"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] text-xs sm:text-sm focus:outline-none focus:border-[#e10600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6b6b72] mb-1.5">
                    Votre Message ou Demande Spécifique
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Précisez votre demande, délai de livraison souhaité, modalité de paiement (comptant, leasing)..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] text-xs sm:text-sm focus:outline-none focus:border-[#e10600] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="pill-btn w-full py-4 bg-[#e10600] hover:bg-[#c30500] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#e10600]/25 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer ma demande de devis</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Parc Automobile Coordinates & Map Link (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-6">
            <h3 className="font-heading font-medium text-xl">Coordonnées du Parc Automobile</h3>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-[var(--fg)]">Adresse</span>
                  <p className="text-[#6b6b72] font-light leading-relaxed mt-0.5">
                    {DEALERSHIP_CONFIG.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-[var(--fg)]">Téléphone Commercial</span>
                  <a href={`tel:${DEALERSHIP_CONFIG.phone}`} className="text-[#6b6b72] hover:text-[#e10600] block mt-0.5">
                    {DEALERSHIP_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-[var(--fg)]">Courrier Électronique</span>
                  <a href={`mailto:${DEALERSHIP_CONFIG.email}`} className="text-[#6b6b72] hover:text-[#e10600] block mt-0.5">
                    {DEALERSHIP_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e10600]/10 text-[#e10600] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-[var(--fg)]">Horaires d'Ouverture</span>
                  <p className="text-[#6b6b72] font-light mt-0.5">
                    Lundi au Vendredi : 08h00 – 18h30<br />
                    Samedi : 09h00 – 17h00 (Dimanche sur rendez-vous)
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps External Button */}
            <div className="pt-4 border-t border-[var(--border)]">
              <a
                href={DEALERSHIP_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn w-full py-3 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--fg)] text-xs font-semibold flex items-center justify-center gap-2 border border-[var(--border)] transition-colors"
              >
                <span>Ouvrir dans Google Maps</span>
                <ArrowUpRight className="w-4 h-4 text-[#e10600]" />
              </a>
            </div>
          </div>

          {/* Showroom Photo Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] border border-[var(--border)] shadow-md">
            <img
              src="/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg"
              alt="Parc Automobile IPM Motors Cocody Riviera Bonoumin"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e10600]">
                Exposition Permanente
              </span>
              <p className="text-xs font-medium mt-0.5">
                Véhicules 0 km sous hangar sécurisé et climatisé
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
