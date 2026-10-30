import React, { useEffect, useState } from 'react';
import { useParams, Link } from '../router/Router';
import { useData } from '../context/DataContext';
import { buildWhatsAppUrl } from '../config/dealership';
import {
  ArrowLeft,
  ChevronRight,
  Share2,
  Calendar,
  Clock,
  User,
  MessageCircle,
  Tag
} from 'lucide-react';

export const NewsArticlePage: React.FC = () => {
  const { slug } = useParams();
  const { getArticleBySlug, newsArticles } = useData();
  const [copied, setCopied] = useState(false);

  const article = getArticleBySlug(slug || '');

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | IPM Motors Abidjan`;
    }
  }, [article]);

  if (!article) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-heading font-light text-3xl mb-4">Article introuvable</h1>
        <p className="text-sm text-[#6b6b72] mb-8 font-light">
          Cet article a été déplacé ou n'existe plus.
        </p>
        <Link
          to="/actualites"
          className="pill-btn px-6 py-3 bg-[#e10600] text-white text-xs font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux actualités</span>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const otherArticles = newsArticles
    .filter(a => a.id !== article.id && a.is_published)
    .slice(0, 3);

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(`${article.title} - À lire sur IPM Motors Abidjan : ${window.location.href}`)}`;

  return (
    <div className="pt-24 sm:pt-32 pb-24 max-w-4xl mx-auto px-8 sm:px-12 lg:px-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6b6b72] mb-8 font-mono">
        <Link to="/" className="hover:text-[var(--fg)]">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/actualites" className="hover:text-[var(--fg)]">Actualités</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--fg)] font-semibold truncate max-w-[200px]">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e10600]/10 text-[#e10600] border border-[#e10600]/20 mb-4">
          <Tag className="w-3 h-3" />
          <span>{article.category}</span>
        </div>

        <h1 className="font-heading font-light text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--border)] text-xs text-[#6b6b72] font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#e10600]" />
              <span>{article.author || 'IPM Motors'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#e10600]" />
              <span>{article.published_at}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#e10600]" />
              <span>{article.read_time || '3 min'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--fg)] transition-colors"
              title="Copier le lien"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
              title="Partager sur WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden mb-10 bg-zinc-950 border border-[var(--border)] shadow-xl">
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
          }}
        />
      </div>

      {/* Article Lead Excerpt */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border-l-4 border-[#e10600] text-base sm:text-lg font-light text-[var(--fg)] leading-relaxed mb-8">
        {article.excerpt}
      </div>

      {/* Article Content */}
      <article className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[#0b0b0c] dark:text-zinc-200 font-light space-y-5">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-line leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Bottom Share & Back */}
      <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/actualites"
          className="pill-btn px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux actualités</span>
        </Link>

        <a
          href={waShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn px-6 py-3 bg-[#e10600] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Partager cet article sur WhatsApp</span>
        </a>
      </div>

      {/* Other Articles Recommendation */}
      {otherArticles.length > 0 && (
        <div className="mt-20 pt-16 border-t border-[var(--border)]">
          <h3 className="font-heading font-medium text-2xl mb-8">
            À lire aussi dans le magazine
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherArticles.map(a => (
              <Link
                key={a.id}
                to={`/actualites/${a.slug || a.id}`}
                className="group p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[#e10600] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#6b6b72] block mb-1">{a.published_at}</span>
                  <h4 className="font-heading font-medium text-sm leading-snug group-hover:text-[#e10600] transition-colors line-clamp-2">
                    {a.title}
                  </h4>
                </div>
                <span className="text-xs text-[#e10600] font-semibold mt-4 block">Lire →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
