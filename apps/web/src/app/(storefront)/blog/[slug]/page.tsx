import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  authorName: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  image: string;
  readTime?: string | null;
  createdAt: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRelatedPosts(currentSlug: string): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    const all = (await res.json()) as Post[];
    return all.filter((p) => p.slug !== currentSlug).slice(0, 2);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).toUpperCase();
}

function toParagraphs(content: string): string[] {
  return content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPost(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedPosts(slug);
  const paragraphs = toParagraphs(article.content);

  return (
    <div className="bg-warm-ivory text-[#1c1b1b] min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-widest text-champagne-gold hover:text-neutral-900 transition-colors font-bold inline-flex items-center gap-2"
        >
          ← Back to Journal
        </Link>
      </div>

      <header className="max-w-4xl mx-auto px-6 pt-10 pb-16 text-center space-y-6">
        <span className="text-[10px] text-champagne-gold uppercase tracking-[0.3em] font-semibold">
          {article.category}
        </span>
        <h1 className="font-serif text-3xl md:text-[56px] text-neutral-900 font-bold leading-tight tracking-tight">
          {article.title}
        </h1>
        <p className="text-base md:text-lg font-light text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          {article.summary}
        </p>

        <div className="flex items-center justify-center gap-4 pt-6">
          <div className="w-10 h-10 rounded-full bg-[#755a24] text-white flex items-center justify-center font-bold text-xs uppercase">
            {article.authorAvatar || article.authorName.substring(0, 2)}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{article.authorName}</p>
            <p className="text-[10px] text-neutral-400 font-light">
              {formatDate(article.createdAt)}
              {article.readTime ? ` • ${article.readTime}` : ''}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-sm">
          <img alt={article.title} className="w-full h-full object-cover" src={article.image} />
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 space-y-8 text-neutral-600 font-light text-base md:text-lg leading-relaxed">
        {paragraphs.map((p, index) => {
          if (index === 1) {
            return (
              <div key={index} className="space-y-8">
                <p>{p}</p>
                <blockquote className="border-l-2 border-champagne-gold pl-6 py-2 my-8">
                  <p className="font-serif text-xl md:text-2xl italic text-[#755a24]">
                    &quot;True elegance does not demand attention. It is a silent signature of craftsmanship, detail, and pure intent.&quot;
                  </p>
                  <cite className="block text-xs uppercase tracking-widest text-neutral-400 mt-3 not-italic">
                    — The Atelier Manifesto
                  </cite>
                </blockquote>
              </div>
            );
          }
          return <p key={index}>{p}</p>;
        })}
      </article>

      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mt-28 pt-16 border-t border-neutral-200/60">
          <h3 className="font-serif text-2xl text-neutral-900 mb-8 uppercase tracking-wide">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group bg-white p-6 rounded-2xl border border-neutral-200/40 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-champagne-gold font-bold mb-2 block">
                    {a.category}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-neutral-800 mb-2 group-hover:text-champagne-gold transition-colors leading-snug">
                    {a.title}
                  </h4>
                  <p className="text-xs font-light text-neutral-500 line-clamp-2 leading-relaxed">{a.summary}</p>
                </div>
                <span className="text-[10px] text-neutral-400 font-light uppercase tracking-widest block pt-6">
                  Read Article →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
