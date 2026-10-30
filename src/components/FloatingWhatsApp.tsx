import React from 'react';
import { MessageSquare } from 'lucide-react';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../config/dealership';

export const FloatingWhatsApp: React.FC = () => {
  const directMessage = `Bonjour IPM Motors, je consulte votre site web et je souhaite échanger avec un conseiller sur vos véhicules neufs disponibles.`;
  const waUrl = buildWhatsAppUrl(directMessage);

  return (
    <aside aria-label="Contact direct WhatsApp" className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter directement avec IPM Motors sur WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <MessageSquare className="w-6 h-6 fill-white" />

        {/* Hover Tooltip (desktop) */}
        <span className="hidden sm:block absolute right-16 px-3 py-1.5 bg-[#0A0A0A] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg border border-[#2A2A2A]">
          Discuter sur WhatsApp
        </span>
      </a>
    </aside>
  );
};
