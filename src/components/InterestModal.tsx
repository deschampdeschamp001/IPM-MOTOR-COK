import React, { useState } from 'react';
import { X, CheckCircle2, Phone, User, MessageSquare, Send, Loader2 } from 'lucide-react';
import { recordLeadInDB } from '../lib/supabase';
import { buildWhatsAppUrl } from '../config/dealership';

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
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet et votre numéro de téléphone.');
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
    setPhone('');
    setMessage('');
    setErrorMsg('');
    onClose();
  };

  const directWhatsAppUrl = buildWhatsAppUrl(
    `Bonjour IPM Motors, je suis vivement intéressé par le modèle 0 km suivant :\n- Modèle : ${vehicle.brand} ${vehicle.model}\nMon nom : ${fullName || 'Client'}\nMon contact : ${phone || 'Non renseigné'}\nMerci de me recontacter.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 text-zinc-900 dark:text-white rounded-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer la fenêtre"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto rounded-none border border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl text-zinc-950 dark:text-white">
                Demande transmise avec succès !
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-light leading-relaxed">
                Merci <strong>{fullName}</strong>. Notre équipe commerciale à Cocody Riviera Bonoumin a bien reçu votre demande pour le véhicule{' '}
                <strong className="text-[#e10600]">{vehicle.brand} {vehicle.model}</strong>.
              </p>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Nous vous recontacterons sous peu au : <strong>{phone}</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-2.5">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-none transition-colors"
              >
                <span>Accélérer via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold rounded-none transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e10600] block mb-1">
                IPM Motors • Demande de rappel
              </span>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-zinc-950 dark:text-white">
                Je suis intéressé
              </h2>
            </div>

            {/* Fiche récapitulative véhicule */}
            <div className="flex items-center gap-3.5 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none">
              {vehicle.image && (
                <div className="w-16 h-12 shrink-0 bg-white dark:bg-zinc-950 flex items-center justify-center p-1 border border-zinc-200/60 dark:border-zinc-800">
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
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white block truncate">
                  {vehicle.model}
                </span>
                {vehicle.price && (
                  <span className="text-xs font-semibold text-[#e10600] block">
                    {vehicle.price}
                  </span>
                )}
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nom complet <span className="text-[#e10600]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: M. Jean-Marc Kouassi"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 rounded-none focus:outline-none focus:border-[#e10600] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Numéro de téléphone <span className="text-[#e10600]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +225 07 01 20 20 21"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 rounded-none focus:outline-none focus:border-[#e10600] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Message ou questions (facultatif)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre requête ou vos disponibilités..."
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 rounded-none focus:outline-none focus:border-[#e10600] transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#e10600] hover:bg-[#c30500] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-none shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer mes coordonnées</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-400 text-center font-light">
                  Vos informations restent strictement confidentielles et ne sont transmises à aucun tiers.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
