import React from 'react';
import { Calendar, Clock, Share2, MessageSquare } from 'lucide-react';
import { NewsArticle } from '../../types';
import { buildWhatsAppUrl } from '../../config/dealership';
import { ResponsiveModal } from '../ui/ResponsiveModal';

interface ArticleReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onExploreVehicles?: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  onExploreVehicles,
}) => {
  if (!article) return null;

  const handleShareWhatsApp = () => {
    const text = `Découvrez cet article sur IPM Motors : *${article.title}*\n${window.location.origin}/actualites`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInquireArticle = () => {
    const waMsg = `Bonjour IPM Motors, je viens de lire votre actualité : "${article.title}". Je souhaite obtenir plus d'informations à ce sujet.`;
    window.open(buildWhatsAppUrl(waMsg), '_blank', 'noopener,noreferrer');
  };

  return (
    <ResponsiveModal
      isOpen={Boolean(article)}
      onClose={onClose}
      kicker={article.category || 'Actualités IPM Motors'}
      title={article.title}
      maxWidth="3xl"
      bodyClassName="p-0 sm:p-0"
      footer={
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#E10600]" />
            <span>Partager sur WhatsApp</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onExploreVehicles && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreVehicles();
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex-1 sm:flex-none text-center"
              >
                Voir le catalogue
              </button>
            )}
            <button
              type="button"
              onClick={handleInquireArticle}
              className="px-5 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer flex-1 sm:flex-none shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contacter sur WhatsApp</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        {/* Cover Image Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black shrink-0">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 md:p-8 space-y-5">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E10600]" />
              <span>
                {new Date(article.published_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{article.read_time || '3 min'} de lecture</span>
            </div>
            {article.author && (
              <>
                <span>·</span>
                <span className="text-zinc-800 dark:text-white font-medium">{article.author}</span>
              </>
            )}
          </div>

          {/* Lead / Excerpt */}
          <p className="text-sm sm:text-base font-normal text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-2 border-[#E10600] pl-4 italic bg-zinc-50 dark:bg-zinc-900/60 py-2.5 rounded-r">
            {article.excerpt}
          </p>

          {/* Full Content */}
          <div className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line font-light">
            {article.content}
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
};
