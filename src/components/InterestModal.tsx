import React, { useState } from 'react';
import { X, CheckCircle2, User, MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';
import { recordLeadInDB } from '../lib/supabase';
import { buildWhatsAppUrl } from '../config/dealership';
import { PhoneInputWithCountry } from './PhoneInputWithCountry';

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id?: string;
    brand: string;
    model: string;
    image?: string;
    price?: string;
    fuel?: string;
  };
}

export const InterestModal: React.FC<InterestModalProps> = ({
  isOpen,
  onClose,
  vehicle
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+225 ');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.trim().length <= 5) {
      setErrorMsg('Veuillez renseigner votre nom complet et un numéro de téléphone valide.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const leadPayload = {
      name: fullName.trim(),
      phone: phone.trim(),
      vehicle_id: vehicle.id || null,
      vehicle_brand: vehicle.brand,
      vehicle_model: vehicle.model,
      message: message.trim() || `Demande d'informations et disponibilité pour ${vehicle.brand} ${vehicle.model} 0 km.`
    };

    try {
      // 1. Sauvegarde locale persistante
      const localKey = 'ipm_local_leads';
      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
      const newLocalLead = {
        ...leadPayload,
        id: `lead-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(localKey, JSON.stringify([newLocalLead, ...existing]));

      // 2. Enregistrement Supabase
      await recordLeadInDB(leadPayload);

      setIsSuccess(true);
    } catch (err: any) {
      console.warn('Erreur lead Supabase, fallback local appliqué:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFullName('');
    setPhone('+225 ');
    setMessage('');
    setErrorMsg('');
    onClose();
  };

  const directWhatsAppUrl = buildWhatsAppUrl(
    `Bonjour IPM Motors, je suis vivement intéressé par le modèle 0 km suivant :\n- Modèle : ${vehicle.brand} ${vehicle.model}\nMon nom : ${fullName || 'Client'}\nMon contact : ${phone || 'Non renseigné'}\nMerci de me recontacter.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 text-zinc-900 dark:text-white rounded-3xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Fermer la fenêtre"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-4 text-center space-y-3.5">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto rounded-full border border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-zinc-950 dark:text-white">
                Demande transmise avec succès !
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 font-light leading-relaxed">
                Merci <strong>{fullName}</strong>. Notre équipe à Cocody Riviera Bonoumin prépare la fiche détaillée de votre{' '}
                <strong className="text-[#e10600]">{vehicle.brand} {vehicle.model}</strong>.
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                Rappel prévu au : <strong>{phone}</strong>
              </p>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-colors shadow-sm"
              >
                <span>Accélérer via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header compact & raffiné */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#e10600] mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>IPM MOTORS • DEMANDE DE RAPPEL</span>
              </div>
              <h2 className="font-heading font-bold text-lg text-zinc-950 dark:text-white leading-tight">
                Je suis intéressé
              </h2>
            </div>

            {/* Fiche récapitulative véhicule compacte */}
            <div className="flex items-center gap-3 p-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl">
              {vehicle.image && (
                <div className="w-14 h-11 shrink-0 bg-white dark:bg-zinc-950 rounded-lg flex items-center justify-center p-1 border border-zinc-200/60 dark:border-zinc-800 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block leading-tight">
                  {vehicle.brand}
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate">
                  {vehicle.model}
                </span>
                {vehicle.price && (
                  <span className="text-[11px] font-bold text-[#e10600] block">
                    {vehicle.price}
                  </span>
                )}
              </div>
            </div>

            {/* Formulaire compact */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {errorMsg && (
                <div className="p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-[11px] rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nom complet <span className="text-[#e10600]">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: M. Jean-Marc Kouassi"
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:border-[#e10600] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Numéro de téléphone <span className="text-[#e10600]">*</span>
                </label>
                <PhoneInputWithCountry
                  value={phone}
                  onChange={setPhone}
                  required
                  placeholder="07 01 20 20 21"
                  variant="rounded"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Message ou questions (facultatif)
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre requête ou vos disponibilités..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:border-[#e10600] transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer mes coordonnées</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-400 text-center font-light leading-tight">
                  Vos informations restent strictement confidentielles.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
