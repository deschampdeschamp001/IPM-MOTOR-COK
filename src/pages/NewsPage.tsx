import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Link } from '../router/Router';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { newsArticles } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  useEffect(() => {
    document.title = 'Magazine & Actualités 0 km | IPM Motors Abidjan';
  }, []);

  const publishedArticles = newsArticles.filter(n => n.is_published);

  const categories = ['Tous', 'Offres Spéciales', 'Nouveautés 0 km', 'Électrique & Hybride', 'Tout-Terrain'];

  const filteredArticles = selectedCategory === 'Tous'
    ? publishedArticles
    : publishedArticles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const featured = publishedArticles.find(a => a.is_featured) || publishedArticles[0];

  return (
    <div className="pt-24 sm:pt-32 pb-24 max-w-[1550px] mx-auto px-8 sm:px-14 md:px-18 lg:px-24 xl:px-32 2xl:px-44">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="eyebrow block mb-2">Magazine Automobile</span>
        <h1 className="font-heading font-light text-3xl sm:text-5xl tracking-tight">
          L’Actualité <span className="font-semibold text-[#e10600]">IPM Motors</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6b6b72] mt-3 font-light">
          Retrouvez nos analyses sur les nouveaux arrivages 0 km à Abidjan, les offres promotionnelles et les tendances de l'automobile mondiale.
        </p>
      </div>

      {/* Featured Article Banner (if available) */}
      {featured && selectedCategory === 'Tous' && (
        <div className="mb-16">
          <Link
            to={`/actualites/${featured.slug || featured.id}`}
            className="group block rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm hover:border-[#e10600] transition-all duration-300 hover:shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-zinc-950">
                <img
                  src={featured.cover_image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e10600] text-white shadow-sm">
                    À la Une
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#6b6b72] mb-3 font-mono">
                    <span>{featured.category}</span>
                    <span>•</span>
                    <span>{featured.published_at}</span>
                    <span>•</span>
                    <span>{featured.read_time || '3 min'}</span>
                  </div>

                  <h2 className="font-heading font-light text-2xl sm:text-3xl leading-snug group-hover:text-[#e10600] transition-colors mb-4">
                    {featured.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6b6b72] font-light leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[#e10600]">
                  <span>Lire l’article complet</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[var(--border)]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`pill-btn px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#e10600] text-white shadow-sm'
                : 'bg-[var(--surface)] text-[#6b6b72] hover:text-[var(--fg)] border border-[var(--border)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => {
          const articleSlug = article.slug || article.id;
          return (
            <article
              key={article.id}
              className="group rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col justify-between hover:border-[#e10600] transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <Link to={`/actualites/${articleSlug}`} className="block relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/75 backdrop-blur-md text-white border border-white/20">
                      {article.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#6b6b72] mb-2 font-mono">
                    <span>{article.published_at}</span>
                    <span>•</span>
                    <span>{article.read_time || '3 min'}</span>
                  </div>

                  <Link to={`/actualites/${articleSlug}`}>
                    <h3 className="font-heading font-medium text-lg leading-snug group-hover:text-[#e10600] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#6b6b72] mt-3 font-light leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[var(--border)]">
                <Link
                  to={`/actualites/${articleSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e10600] group-hover:underline"
                >
                  <span>Lire l'article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
