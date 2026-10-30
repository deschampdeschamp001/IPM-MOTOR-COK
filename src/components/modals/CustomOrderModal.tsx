import React, { useState } from 'react';
import { SlidersHorizontal, Send, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl } from '../../config/dealership';
import { recordLeadInDB } from '../../lib/supabase';
import { ResponsiveModal } from '../ui/ResponsiveModal';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({ isOpen, onClose }) => {
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [bodyType, setBodyType] = useState('SUV');
  const [fuel, setFuel] = useState('Essence');
  const [transmission, setTransmission] = useState('Automatique');
  const [budget, setBudget] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || isSubmitting) return;

    setIsSubmitting(true);
    const message = `Demande de configuration sur-mesure : ${brand} ${model || ''} (${bodyType}, ${fuel}, ${transmission}). Budget : ${budget || 'Non spécifié'}. Notes : ${notes || 'Aucune'}`;

    try {
      await recordLeadInDB({
        name: name.trim(),
        phone: phone.trim(),
        vehicle_brand: brand,
        vehicle_model: model,
        message,
      });
    } catch {
      // safe fallback
    }

    const waMsg = `Bonjour IPM Motors,
Je souhaite configurer et commander un véhicule neuf 0 km sur-mesure :
• *Marque :* ${brand}
• *Modèle :* ${model || 'À conseiller'}
• *Carrosserie :* ${bodyType}
• *Motorisation :* ${fuel} (${transmission})
• *Budget envisagé :* ${budget || 'À définir'}
• *Mes coordonnées :* ${name} (${phone})
${notes ? `• *Options spécifiques :* ${notes}` : ''}

Merci de me recontacter avec les disponibilités et votre meilleure offre.`;

    const waUrl = buildWhatsAppUrl(waMsg);
    setIsSubmitting(false);
    setIsSubmitted(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setModel('');
    setBudget('');
    setNotes('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      kicker="Commande sur-mesure & Importation 0 km"
      title="Configurez le véhicule de vos rêves"
      subtitle="IPM Motors trouve, importe et immatricule la configuration exacte de votre choix avec garantie constructeur."
      icon={<SlidersHorizontal className="w-5 h-5 text-[#E10600]" />}
      maxWidth="2xl"
      isSubmitting={isSubmitting}
    >
      {isSubmitted ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Demande transmise avec succès</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Votre conseiller privé IPM Motors a reçu votre cahier des charges et prépare une proposition personnalisée.
          </p>
          <button
            onClick={handleResetAndClose}
            className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Marque souhaitée *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value="Toyota">Toyota</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BYD">BYD</option>
                <option value="BMW">BMW</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Jetour">Jetour</option>
                <option value="Kia">Kia</option>
                <option value="Nissan">Nissan</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Changan">Changan</option>
                <option value="Geely">Geely</option>
                <option value="Autre">Autre constructeur d'exception</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Modèle envisagé
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Land Cruiser, Defender, Classe G, Seal..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Silhouette
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value="SUV">SUV Prestige</option>
                <option value="Berline">Berline de Luxe</option>
                <option value="Pick-up">Pick-up Puissant</option>
                <option value="Électrique">100% Électrique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Énergie
              </label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Électrique">Électrique</option>
                <option value="Hybride">Hybride Rechargeable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Boîte
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              >
                <option value="Automatique">Automatique</option>
                <option value="Manuelle">Manuelle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
              Budget approximatif (FCFA, optionnel)
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: 35 000 000 FCFA à 70 000 000 FCFA"
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
              Options & Finitions souhaitées
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Couleur extérieure, sellerie cuir, toit panoramique, système audio..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Votre Nom complet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: M. Jean Kouassi"
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Numéro de téléphone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 07 08 09 10 11"
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>
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
              className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E10600]/25 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmission...' : 'Transmettre mon cahier des charges'}</span>
            </button>
          </div>
        </form>
      )}
    </ResponsiveModal>
  );
};
