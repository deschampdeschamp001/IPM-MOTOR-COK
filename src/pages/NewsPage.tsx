import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Link } from '../router/Router';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const parseDateBadge = (dateStr: string) => {
  if (!dateStr) return { day: '4', month: 'Mai' };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const mIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10).toString();
    return { day, month: months[mIdx] || 'Mai' };
  }
  const tokens = dateStr.trim().split(/\s+/);
  if (tokens.length >= 2 && !isNaN(parseInt(tokens[0], 10))) {
    return { day: tokens[0], month: tokens[1].slice(0, 4) };
  }
  return { day: '4', month: 'Mai' };
};

export const NewsPage: React.FC = () => {
  const { newsArticles } = useData();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    document.title = 'Magazine & Actualités 0 km | IPM Motors Abidjan';
  }, []);

  const publishedArticles = newsArticles.filter((n) => n.is_published);

  // Pagination (6 articles per page matching Image 2 3x2 grid)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(publishedArticles.length / itemsPerPage));
  const currentArticles = publishedArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pt-24 sm:pt-32 pb-24 max-w-[1550px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28">
      {/* En-tête simple et aéré */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <span className="eyebrow block mb-2">Magazine Automobile & Nouveautés</span>
        <h1 className="font-heading font-light text-3xl sm:text-5xl tracking-tight text-[var(--fg)]">
          L’Actualité <span className="font-semibold text-[#e10600]">IPM Motors</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6b6b72] mt-3 font-light leading-relaxed">
          Retrouvez nos arrivages officiels 0 km à Abidjan, nos analyses techniques et les conseils de nos experts automobiles.
        </p>
      </div>

      {/* Grille d'articles fidèle à l'Image 2 (Bords carrés, badge date orange/ambre bas-droite de la photo, titre vert foncé) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {currentArticles.map((article) => {
          const articleSlug = article.slug || article.id;
          const { day, month } = parseDateBadge(article.published_at);

          return (
            <article
              key={article.id}
              className="group flex flex-col justify-between bg-white dark:bg-zinc-900/60 rounded-xl overflow-hidden transition-all duration-300"
            >
              <div>
                {/* Zone Image avec Badge Date en bas à droite (Exact style Image 2) */}
                <div className="relative aspect-[16/10.5] overflow-hidden rounded-xl bg-zinc-950">
                  <Link to={`/actualites/${articleSlug}`} className="block w-full h-full">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                      }}
                    />
                  </Link>

                  {/* Badge Date en bas à droite exact Image 2 (Fond blanc pur, grand chiffre orange + mois en orange) */}
                  <div className="absolute bottom-0 right-4 z-10 bg-white shadow-md rounded-t-lg px-3.5 py-1 text-center min-w-[56px] border border-b-0 border-zinc-100">
                    <span className="block text-xl sm:text-2xl font-bold text-[#f39c12] leading-tight">
                      {day}
                    </span>
                    <span className="block text-[11px] font-semibold text-[#f39c12] uppercase tracking-wider">
                      {month}
                    </span>
                  </div>

                  {/* Catégorie discrète en haut à gauche */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-black/70 backdrop-blur-sm text-white">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Corps de l'article : Titre vert sombre + résumé (Exact Image 2) */}
                <div className="pt-4 pb-2">
                  <Link to={`/actualites/${articleSlug}`}>
                    <h2 className="font-heading font-bold text-base sm:text-lg leading-snug text-[#064e3b] dark:text-emerald-400 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mt-2.5 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Lien discret de lecture */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-zinc-400">
                  {article.read_time || '3 min de lecture'}
                </span>
                <Link
                  to={`/actualites/${articleSlug}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#064e3b] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  <span>Lire la suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination style Image 2 : 1 2 3 4 5 centrée en bas */}
      <div className="mt-16 flex items-center justify-center gap-3 sm:gap-4 text-sm font-semibold">
        {currentPage > 1 && (
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 text-zinc-500 hover:text-[#064e3b] transition-colors cursor-pointer"
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#f39c12] font-bold text-base border-b-2 border-[#f39c12]'
                  : 'text-zinc-500 hover:text-[#064e3b]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {currentPage < totalPages && (
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 text-zinc-500 hover:text-[#064e3b] transition-colors cursor-pointer"
            aria-label="Page suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
