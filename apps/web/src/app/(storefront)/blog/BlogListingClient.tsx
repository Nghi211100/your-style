'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Article } from './page';

interface Props {
  articles: Article[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}

export default function BlogListingClient({ articles }: Props) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(a.category.toUpperCase()));
    return ['ALL', ...Array.from(set)];
  }, [articles]);

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredArticles =
    selectedCategory === 'ALL'
      ? articles
      : articles.filter((a) => a.category.toUpperCase() === selectedCategory);

  const featured = articles[0];

  return (
    <div className="bg-warm-ivory text-[#1c1b1b] min-h-screen pb-24">
      <header className="max-w-[1440px] mx-auto px-6 md:px-16 pt-16 md:pt-24 mb-16">
        <div className="max-w-4xl space-y-4">
          <span className="text-[10px] text-champagne-gold uppercase tracking-[0.3em] font-semibold block">
            THE ATELIER JOURNAL
          </span>
          <h1 className="font-serif text-4xl md:text-[72px] font-bold text-neutral-900 leading-tight tracking-tight">
            The Journal
          </h1>
          <p className="text-sm md:text-base font-light text-neutral-500 max-w-xl leading-relaxed">
            Style insights, behind the scenes, and fashion editorials curated for the modern minimalist.
          </p>
        </div>
      </header>

      {selectedCategory === 'ALL' && featured && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 mb-24">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 relative">
            <div className="w-full lg:w-[60%] aspect-video lg:aspect-auto lg:h-[550px] overflow-hidden rounded-2xl shadow-sm">
              <img
                alt={featured.title}
                className="w-full h-full object-cover grayscale-[15%] hover:scale-102 transition-transform duration-[1500ms]"
                src={featured.image}
              />
            </div>
            <div className="w-full lg:w-[45%] flex flex-col justify-center bg-white p-8 md:p-12 lg:-ml-16 z-10 rounded-2xl shadow-sm border border-neutral-200/40 relative">
              <div className="mb-4">
                <span className="bg-[#755a24] text-white px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  {featured.category}
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-4xl text-neutral-900 font-bold mb-4 leading-tight">
                <Link href={`/blog/${featured.slug}`} className="hover:text-champagne-gold transition-colors">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-sm font-light text-neutral-500 mb-6 leading-relaxed">{featured.summary}</p>
              <div className="flex items-center gap-3 mb-6 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-full bg-[#755a24] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {featured.authorAvatar || featured.authorName.substring(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{featured.authorName}</p>
                  <p className="text-[10px] text-neutral-400 font-light">
                    {formatDate(featured.createdAt)}
                    {featured.readTime ? ` • ${featured.readTime}` : ''}
                  </p>
                </div>
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-champagne-gold hover:text-neutral-800 transition-colors uppercase"
              >
                Read Article
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 mb-12">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200/40 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <Link href={`/blog/${article.slug}`} className="aspect-video w-full overflow-hidden block relative">
                <img
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={article.image}
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[9px] uppercase tracking-widest text-champagne-gold font-bold mb-3 block">
                  {article.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-800 mb-3 group-hover:text-champagne-gold transition-colors leading-snug">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-xs font-light text-neutral-500 mb-6 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-neutral-50 mt-auto text-[10px] text-neutral-400 font-light uppercase tracking-wider">
                  <span>By {article.authorName}</span>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
