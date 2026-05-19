import Link from 'next/link';
import { getServerApiBaseUrl } from '@/lib/serverApiUrl';
import BlogListingClient from './BlogListingClient';

export const revalidate = 0;

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  authorName: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  image: string;
  readTime?: string | null;
  createdAt: string;
}

async function getArticles(): Promise<Article[]> {
  const base = getServerApiBaseUrl();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/posts`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`[your-style] GET ${base}/posts failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as Article[]) : [];
  } catch (error) {
    console.error('[your-style] Error fetching blog posts (is the API running on the same host as API_URL?)', error);
    return [];
  }
}

export default async function BlogListingPage() {
  const articles = await getArticles();

  if (articles.length === 0) {
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
          </div>
        </header>
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
          <div className="py-20 text-center border border-dashed border-neutral-200 rounded-xl bg-[#fdf8f7]">
            <p className="text-sm text-neutral-500 font-light mb-4">No articles published yet.</p>
            <Link href="/" className="text-xs underline tracking-widest uppercase hover:text-champagne-gold">
              Back home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return <BlogListingClient articles={articles} />;
}
