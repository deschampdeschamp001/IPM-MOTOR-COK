import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Navigation, Send, CheckCircle2 } from 'lucide-react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';
import { recordLeadInDB } from '../lib/supabase';
import { Vehicle } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PhoneInputWithCountry } from './PhoneInputWithCountry';

interface ContactSectionProps {
  vehicles: Vehicle[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ vehicles }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);

    const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
    const vehicleText = selectedVehicle
      ? `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.year})`
      : 'Véhicule neuf selon conseil';

    try {
      await recordLeadInDB({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        vehicle_id: formData.vehicleId || null,
        message: formData.message.trim() || 'Demande d’information depuis le formulaire web',
      });
    } catch (err) {
      console.warn('Supabase lead record skipped or offline:', err);
    }

    const formattedWhatsAppMsg = `Bonjour IPM Motors,
Je m'appelle *${formData.name}* (Tél: ${formData.phone}).
Véhicule souhaité : *${vehicleText}*.
${formData.message ? `Message : ${formData.message}` : 'Je souhaite recevoir des informations et un devis pour ce véhicule neuf 0 km.'}`;

    const waUrl = buildWhatsAppUrl(formattedWhatsAppMsg);

    setIsSubmitting(false);
    setSubmitted(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contact"
      className={`py-12 sm:py-16 transition-colors duration-300 ${
        isDark ? 'bg-[#0E0E0E] text-white' : 'bg-[#FFFFFF] text-[#0A0A0A]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header Compact */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-6 h-[2px] bg-[#E10600]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-extrabold text-[#E10600]">
              Parc Automobile & Échange direct
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Contact & Localisation
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 font-normal ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-600'}`}>
            Venez découvrir nos véhicules neufs en exposition ou contactez notre équipe pour une commande sur mesure.
          </p>
        </div>

        {/* 2-Columns Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Coordinates & Quick Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className={`p-6 sm:p-8 rounded-2xl border space-y-6 transition-colors ${
                isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-[#F9FAFB] border-neutral-200 shadow-sm'
              }`}
            >
              <h3 className="text-xl font-bold tracking-tight">
                Coordonnées du parc automobile
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl border text-[#E10600] shrink-0 mt-0.5 ${
                    isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-white border-neutral-200'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-500'}`}>
                    Adresse
                  </h4>
                  <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {DEALERSHIP_CONFIG.address}
                  </p>
                  <p className={`text-xs mt-0.5 font-normal ${isDark ? 'text-[#666666]' : 'text-neutral-500'}`}>
                    {DEALERSHIP_CONFIG.city}, {DEALERSHIP_CONFIG.country}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl border text-[#E10600] shrink-0 mt-0.5 ${
                    isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-white border-neutral-200'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-500'}`}>
                    Téléphone direct
                  </h4>
                  <a
                    href={`tel:${DEALERSHIP_CONFIG.phone}`}
                    className={`text-base sm:text-lg font-bold hover:text-[#E10600] transition-colors tabular-nums ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {DEALERSHIP_CONFIG.phoneDisplay}
                  </a>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-500'}`}>
                    Lundi au Samedi : 08h00 – 18h30
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl border text-[#E10600] shrink-0 mt-0.5 ${
                    isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-white border-neutral-200'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-500'}`}>
                    E-mail
                  </h4>
                  <a
                    href={`mailto:${DEALERSHIP_CONFIG.email}`}
                    className={`text-sm font-semibold hover:text-[#E10600] transition-colors ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {DEALERSHIP_CONFIG.email}
                  </a>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Google Maps Directions */}
              <div className={`pt-4 border-t flex flex-col sm:flex-row gap-3 ${isDark ? 'border-[#2A2A2A]' : 'border-neutral-200'}`}>
                <a
                  href={`https://wa.me/${DEALERSHIP_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Écrire sur WhatsApp</span>
                </a>
                <a
                  href={DEALERSHIP_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider border rounded-lg transition-colors ${
                    isDark
                      ? 'border-[#333333] hover:bg-white/5 text-white'
                      : 'border-neutral-300 hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-[#E10600]" />
                  <span>Itinéraire</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps & Direct Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Embedded Google Map iframe */}
            <div
              className={`w-full h-64 sm:h-72 rounded-2xl overflow-hidden border relative shadow-sm ${
                isDark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-neutral-200 bg-neutral-100'
              }`}
            >
              <iframe
                title="Localisation IPM Motors Cocody Riviera Bonoumin"
                src="https://maps.google.com/maps?q=5.28394,-3.97594&hl=fr&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={DEALERSHIP_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute bottom-3 right-3 px-3 py-1.5 text-[11px] font-semibold rounded-md shadow border transition-colors ${
                  isDark
                    ? 'bg-[#0A0A0A]/95 text-white border-[#2A2A2A] hover:text-[#E10600]'
                    : 'bg-white/95 text-neutral-900 border-neutral-200 hover:text-[#E10600]'
                }`}
              >
                Ouvrir dans Google Maps ↗
              </a>
            </div>

            {/* Quick Contact Form */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
                isDark ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-[#F9FAFB] border-neutral-200 shadow-sm'
              }`}
            >
              <h3 className="text-lg font-bold mb-1">
                Demander des informations ou un devis express
              </h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-500'}`}>
                Remplissez ces informations pour initier l'échange directement sur WhatsApp avec un conseiller.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Demande transmise avec succès !</h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      Votre conversation WhatsApp s'est ouverte.{' '}
                      <a
                        href={`https://wa.me/${DEALERSHIP_CONFIG.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold"
                      >
                        Cliquez ici si la fenêtre ne s'est pas affichée
                      </a>.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-3 text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
                    >
                      Envoyer une autre demande
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-600'}`}>
                        Votre nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Jean Kouassi"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E10600] transition-colors ${
                          isDark
                            ? 'bg-[#0A0A0A] border border-[#2A2A2A] text-white focus:border-[#E10600]'
                            : 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#E10600]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-600'}`}>
                        Numéro de téléphone *
                      </label>
                      <PhoneInputWithCountry
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                        required
                        placeholder="07 01 20 20 21"
                        variant="rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-600'}`}>
                      Véhicule souhaité
                    </label>
                    <select
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E10600] transition-colors ${
                        isDark
                          ? 'bg-[#0A0A0A] border border-[#2A2A2A] text-white focus:border-[#E10600]'
                          : 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#E10600]'
                      }`}
                    >
                      <option value="">Sélectionnez un véhicule (facultatif)</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.brand} {v.model} ({v.year}) - {v.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-[#8A8A8A]' : 'text-neutral-600'}`}>
                      Votre message ou précision
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Précisez votre recherche : options souhaitées, délai d'achat, reprise éventuelle..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E10600] transition-colors ${
                        isDark
                          ? 'bg-[#0A0A0A] border border-[#2A2A2A] text-white focus:border-[#E10600]'
                          : 'bg-white border border-neutral-300 text-neutral-900 focus:border-[#E10600]'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#E10600] hover:bg-[#B00500] disabled:bg-[#E10600]/50 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer et ouvrir WhatsApp'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
