import React, { useState } from 'react';
import { MessageSquare, Phone, Send, CheckCircle2 } from 'lucide-react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../../config/dealership';
import { recordLeadInDB } from '../../lib/supabase';
import { ResponsiveModal } from '../ui/ResponsiveModal';
import { PhoneInputWithCountry } from '../PhoneInputWithCountry';

interface VIPContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VIPContactModal: React.FC<VIPContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState('Devis véhicule neuf');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await recordLeadInDB({
        name: name.trim(),
        phone: phone.trim(),
        message: `[${requestType}] ${message || 'Demande de contact prioritaire'}`,
      });
    } catch {
      // safe fallback
    }

    const waMsg = `Bonjour IPM Motors,
Je m'appelle *${name}* (${phone}).
Type de demande : *${requestType}*.
${message ? `Détails : ${message}` : 'Je souhaite être contacté par un conseiller commercial pour un projet d’achat 0 km.'}`;

    const waUrl = buildWhatsAppUrl(waMsg);
    setIsSubmitting(false);
    setIsSubmitted(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      kicker="Conseil Commercial & Devis Express"
      title="Échangez avec un conseiller privé"
      subtitle="Réponse rapide garantie en moins de 15 minutes par WhatsApp ou téléphone."
      icon={<MessageSquare className="w-5 h-5 text-[#E10600]" />}
      maxWidth="lg"
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        {/* Fast Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={buildWhatsAppUrl('Bonjour IPM Motors, je souhaite échanger directement avec un conseiller commercial.')}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl flex items-center gap-2.5 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                WhatsApp Direct
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Réponse immédiate</div>
            </div>
          </a>

          <a
            href={`tel:${DEALERSHIP_CONFIG.phone}`}
            className="p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl flex items-center gap-2.5 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E10600]/10 text-[#E10600] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-[#E10600]">
                Appel Téléphonique
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{DEALERSHIP_CONFIG.phoneDisplay}</div>
            </div>
          </a>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Demande envoyée</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Votre conseiller vous recontacte dans les plus brefs délais.
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-5 py-2.5 bg-[#E10600] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#B00500] transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Objet de votre demande
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value="Devis véhicule neuf">Devis tarifaire véhicule neuf 0 km</option>
                <option value="Disponibilité immédiate en stock">Vérifier une disponibilité immédiate</option>
                <option value="Conseil financement & leasing">Conseil financement & leasing professionnel</option>
                <option value="Commande entreprise ou flotte">Commande entreprise / flotte société</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  Nom & Prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: M. Bamba"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  Téléphone / WhatsApp *
                </label>
                <PhoneInputWithCountry
                  value={phone}
                  onChange={setPhone}
                  required
                  placeholder="07 01 20 20 21"
                  variant="rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Message ou question
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Précisez votre véhicule recherché ou vos questions..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Envoi...' : 'Envoyer ma demande'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </ResponsiveModal>
  );
};
