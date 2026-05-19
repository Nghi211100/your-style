'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

const ARTICLES: Article[] = [
  {
    slug: 'the-art-of-capsule-dressing',
    title: 'The Art of Capsule Dressing',
    excerpt: 'Discover the essential components of a timeless wardrobe. From structured silhouettes to high-quality fibers, we explore how to build a lasting identity.',
    category: 'STYLE GUIDE',
    author: 'Elena Rossi',
    date: 'OCT 14, 2026',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop',
    readTime: '6 min read'
  },
  {
    slug: 'autumn-layering',
    title: 'Autumn Layering & Textures',
    excerpt: 'Master the art of transitioning seasons with our guide to luxurious textures, cashmere wraps, and soft wool layers.',
    category: 'TRENDS',
    author: 'Julian Marc',
    date: 'OCT 12, 2026',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop',
    readTime: '4 min read'
  },
  {
    slug: 'inside-the-atelier',
    title: 'Inside the Atelier: Hand Crafting',
    excerpt: 'A rare glimpse into the meticulous design process, custom pattern drafts, and heritage craftsmanship that defines every silhouette.',
    category: 'BEHIND THE SCENES',
    author: 'Clara Vento',
    date: 'OCT 10, 2026',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2942&auto=format&fit=crop',
    readTime: '8 min read'
  },
  {
    slug: 'sustainable-silk',
    title: 'Sustainable Silk: A Soft Future',
    excerpt: 'How we are redefining contemporary luxury through responsible mulberry cultivation, non-toxic dyes, and circular textile innovations.',
    category: 'SUSTAINABILITY',
    author: 'Elena Rossi',
    date: 'OCT 08, 2026',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2940&auto=format&fit=crop',
    readTime: '5 min read'
  },
  {
    slug: 'the-modern-suit',
    title: 'The Modern Suit: Poise & Presence',
    excerpt: 'Exploring structured custom tailoring for the contemporary woman. Redefining high-fashion coordinates with supreme power and grace.',
    category: 'STYLE GUIDE',
    author: 'Mark Thorne',
    date: 'OCT 05, 2026',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2942&auto=format&fit=crop',
    readTime: '5 min read'
  },
  {
    slug: 'sustainable-fashion',
    title: 'Sustainable Fashion: The New Luxury Standard',
    excerpt: 'Why mindfulness and circular tailoring represent the absolute pinnacle of high fashion in 2026 and beyond.',
    category: 'SUSTAINABILITY',
    author: 'Sarah Mitchell',
    date: 'SEP 28, 2026',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop',
    readTime: '7 min read'
  },
  {
    slug: 'art-of-tailoring',
    title: 'The Art of Tailoring: From Thread to Silhouette',
    excerpt: 'An intimate look into our atelier, showcasing the timeless drafting methods used to create sculptural winter coats.',
    category: 'BEHIND THE SCENES',
    author: 'Marco Valenti',
    date: 'SEP 15, 2026',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop',
    readTime: '9 min read'
  }
];

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'STYLE GUIDE', 'TRENDS', 'BEHIND THE SCENES', 'SUSTAINABILITY'];

  const filteredArticles = selectedCategory === 'ALL'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === selectedCategory);

  const featured = ARTICLES[0]; // Hero post

  return (
    <div className="bg-warm-ivory text-[#1c1b1b] min-h-screen pb-24">
      {/* Page Header */}
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

      {/* Featured Hero Article */}
      {selectedCategory === 'ALL' && (
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
              <p className="text-sm font-light text-neutral-500 mb-6 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 mb-6 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-full bg-[#755a24] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {featured.author.substring(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{featured.author}</p>
                  <p className="text-[10px] text-neutral-400 font-light">{featured.date} • {featured.readTime}</p>
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

      {/* Category Buttons */}
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

      {/* Articles Grid */}
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
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-neutral-50 mt-auto text-[10px] text-neutral-400 font-light uppercase tracking-wider">
                  <span>By {article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
