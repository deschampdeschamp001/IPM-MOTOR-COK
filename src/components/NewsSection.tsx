import React, { useState } from 'react';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ArticleReaderModal } from './modals/ArticleReaderModal';

interface NewsSectionProps {
  articles: NewsArticle[];
  onOpenAllNews: () => void;
  onExploreVehicles?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  onOpenAllNews,
  onExploreVehicles,
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  // Extract unique categories
  const categories = ['Toutes', ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles =
    selectedCategory === 'Toutes'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const featuredArticle = filteredArticles.find((a) => a.is_featured) || filteredArticles[0];
  const secondaryArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id).slice(0, 3);

  return (
    <>
      <section
        id="actualites"
        className={`py-12 sm:py-16 border-b transition-colors duration-300 ${
          isDark ? 'bg-[#0A0A0A] border-[#1F1F1F]' : 'bg-[#FAFAFA] border-neutral-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Header inspired by Mercedes-Benz / Image 1 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[2px] bg-[#E10600]" />
                <span className="text-[11px] sm:text-xs uppercase tracking-widest font-extrabold text-[#E10600]">
                  Actualités & Nouveautés 0 km
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif sm:font-sans">
                Actualités
              </h2>
            </div>

            {/* Category Segmented Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#E10600] text-white shadow-sm'
                        : isDark
                        ? 'bg-[#181818] text-neutral-400 hover:text-white border border-[#2A2A2A]'
                        : 'bg-white text-neutral-700 hover:text-black border border-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial Grid (Matching Image 1: Main Highlight Card + Secondary Right Card) */}
          {featuredArticle && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
              {/* Main Featured Card (Left, 7 or 8 columns) */}
              <div
                onClick={() => setReadingArticle(featuredArticle)}
                className="lg:col-span-7 group relative rounded-2xl overflow-hidden cursor-pointer border border-[#222222] min-h-[360px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-8 transition-transform duration-300"
              >
                {/* Background image */}
                <div className="absolute inset-0 bg-black overflow-hidden">
                  <img
                    src={featuredArticle.cover_image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2 text-white">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-[#E10600]">
                    {featuredArticle.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-neutral-100 transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 font-light max-w-xl">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E10600]/30"
                    >
                      <span>En savoir plus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Column (Right, 5 columns) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {secondaryArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setReadingArticle(article)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                      isDark
                        ? 'bg-[#121212] border-[#222222] hover:border-[#E10600]/60 hover:bg-[#161616]'
                        : 'bg-white border-neutral-200 hover:border-[#E10600]/60 shadow-sm hover:shadow'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#E10600]">
                          {article.category}
                        </span>
                        <span className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {new Date(article.published_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <h4
                        className={`text-base sm:text-lg font-bold tracking-tight line-clamp-2 transition-colors ${
                          isDark ? 'text-white group-hover:text-white' : 'text-black group-hover:text-black'
                        }`}
                      >
                        {article.title}
                      </h4>

                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isDark ? 'text-neutral-400' : 'text-neutral-600'
                        }`}
                      >
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-neutral-200/40 dark:border-neutral-800/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E10600] group-hover:underline inline-flex items-center gap-1">
                        <span>En savoir plus</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {article.read_time || '3 min'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* All News Trigger Banner */}
                <button
                  type="button"
                  onClick={onOpenAllNews}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-[#181818] border-[#2A2A2A] hover:bg-[#222222] text-white'
                      : 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200 text-neutral-900'
                  }`}
                >
                  <span>Consulter toutes les actualités IPM Motors</span>
                  <ArrowRight className="w-4 h-4 text-[#E10600]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reader Modal */}
      <ArticleReaderModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
        onExploreVehicles={onExploreVehicles}
      />
    </>
  );
};
