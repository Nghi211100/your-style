import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticleContent {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  content: string[];
}

const ARTICLES_DATA: Record<string, ArticleContent> = {
  'the-art-of-capsule-dressing': {
    slug: 'the-art-of-capsule-dressing',
    title: 'The Art of Capsule Dressing',
    excerpt: 'Discover the essential components of a timeless wardrobe. From structured silhouettes to high-quality fibers, we explore how to build a lasting identity.',
    category: 'STYLE GUIDE',
    author: 'Elena Rossi',
    date: 'OCTOBER 14, 2026',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop',
    readTime: '6 min read',
    content: [
      'In a world dominated by rapid consumption and micro-trends that expire within weeks, capsule dressing stands as a powerful manifesto of quiet elegance. It is not simply a method of organizing your closet; it is an intimate philosophy of self-respect and intentional style.',
      'A true capsule wardrobe is constructed on three pillars: architectural structure, exceptional fiber quality, and cohesive color palettes. When these three elements are carefully balanced, dressing becomes a seamless, stress-free morning ritual.',
      'Start with the absolute foundations: a perfectly structured trench, tailored high-rise trousers, and a crisp white organic cotton shirt. These are the canvases upon which you draft your daily silhouette. By investing in premium fibers like extra-fine merino wool and mulberry silk, you choose garments that breathe, drape beautifully, and withstand the test of time.',
      'Remember, luxury is not about quantity. It is the confidence that comes from wearing a single, meticulously tailored garment that commands presence through simple lines and absolute quality.'
    ]
  },
  'autumn-layering': {
    slug: 'autumn-layering',
    title: 'Autumn Layering & Textures',
    excerpt: 'Master the art of transitioning seasons with our guide to luxurious textures, cashmere wraps, and soft wool layers.',
    category: 'TRENDS',
    author: 'Julian Marc',
    date: 'OCTOBER 12, 2026',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop',
    readTime: '4 min read',
    content: [
      'As the temperature transitions, the art of layering becomes the ultimate expression of personal style. Layering is not just about keeping warm; it is a tactical play of weights, tactile surfaces, and spatial proportions.',
      'The modern minimalist approach to autumn layering revolves around contrasting textures. Pair a heavy ribbed knit coat with an ultra-light silk slip skirt, or match a tailored flannel trouser with a fine gauge cashmere turtleneck. This tension between heavy and light creates beautiful optical depth.',
      'Keep your color palette unified. Choose soft earthy tones like sand, warm ivory, charcoal gray, and rich espresso. This allows you to stack up to four layers without looking cluttered or bulky.',
      'A master tip for high-fashion layering is maintaining the necklines. A high mock-neck cashmere top under a deep-V tailored blazer, completed with a oversized wool overcoat, defines a strong sculptural posture.'
    ]
  },
  'inside-the-atelier': {
    slug: 'inside-the-atelier',
    title: 'Inside the Atelier: Hand Crafting',
    excerpt: 'A rare glimpse into the meticulous design process, custom pattern drafts, and heritage craftsmanship that defines every silhouette.',
    category: 'BEHIND THE SCENES',
    author: 'Clara Vento',
    date: 'OCTOBER 10, 2026',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2942&auto=format&fit=crop',
    readTime: '8 min read',
    content: [
      'Welcome to the heart of YOUR STYLE. Our atelier is a quiet sanctuary where time-honored draft-cutting methods meet modern design vision. Here, every seam is calculated and every fabric swatch is handled with the utmost reverence.',
      'Every collection begins with a pencil sketch and a custom paper draft. Our master tailors guide the fabric by hand through every step, ensuring structural integrity and a bespoke finish. We do not mass-produce; we sculpt garments that fit like a second skin.',
      'By selecting only the finest certified linens, sustainable organic silks, and ethically sheared wools, we make sure that our carbon footprint remains as minimal as our aesthetic. Each item takes up to 40 hours of handcraft to complete.',
      'This dedication to slow fashion is what makes our garments feel different. When you wear a piece from our atelier, you wear the story, care, and precision of the hands that shaped it.'
    ]
  },
  'sustainable-silk': {
    slug: 'sustainable-silk',
    title: 'Sustainable Silk: A Soft Future',
    excerpt: 'How we are redefining contemporary luxury through responsible mulberry cultivation, non-toxic dyes, and circular textile innovations.',
    category: 'SUSTAINABILITY',
    author: 'Elena Rossi',
    date: 'OCTOBER 08, 2026',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2940&auto=format&fit=crop',
    readTime: '5 min read',
    content: [
      'Silk has always represented the peak of textile luxury. However, modern industrial production has often overlooked the biological health of our silk ecosystems. At YOUR STYLE, we have committed to a fully transparent, sustainable silk cycle.',
      'Our mulberry trees are cultivated organically, free from chemical fertilizers and harmful pesticides. We harvest our silk fibers using cruelty-free, circular methods that preserve the natural cycle of the silkworm, resulting in exceptionally strong and soft fibers.',
      'We wash and dye our silk using organic plant-based extracts and pure rainwater, completely eliminating toxic runoffs. This ensures that every silk slip or shirt is completely biodegradable and exceptionally gentle on your skin.',
      'We believe that true luxury cannot exist at the expense of our environment. Sustainable silk is not just a collection choice; it is a soft, conscious future that we are proud to lead.'
    ]
  },
  'the-modern-suit': {
    slug: 'the-modern-suit',
    title: 'The Modern Suit: Poise & Presence',
    excerpt: 'Exploring structured custom tailoring for the contemporary woman. Redefining high-fashion coordinates with supreme power and grace.',
    category: 'STYLE GUIDE',
    author: 'Mark Thorne',
    date: 'OCTOBER 05, 2026',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2942&auto=format&fit=crop',
    readTime: '5 min read',
    content: [
      'The suit has long been a symbol of corporate authority. But in 2026, the modern suit has evolved to become an exquisite canvas of personal expression, relaxed confidence, and structural grace.',
      'We design our suits to balance power and ease. This is achieved by introducing slightly dropped shoulders, elongated blazers, and wide-leg fluid trousers that drape beautifully without feeling stiff or restrictive.',
      'Choose lightweight wool-silk blends for all-season comfort, or dry organic linens for a soft editorial texture during summer. Pair your suit with premium leather boots and minimal jewelry to complete the high-end silhouette.',
      'Whether worn as a complete coordinate or styled separately, a masterfully tailored suit commands absolute presence through quiet luxury and impeccable cut.'
    ]
  },
  'sustainable-fashion': {
    slug: 'sustainable-fashion',
    title: 'Sustainable Fashion: The New Luxury Standard',
    excerpt: 'Why mindfulness and circular tailoring represent the absolute pinnacle of high fashion in 2026 and beyond.',
    category: 'SUSTAINABILITY',
    author: 'Sarah Mitchell',
    date: 'SEPTEMBER 28, 2026',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop',
    readTime: '7 min read',
    content: [
      'Luxury is evolving. Today, the ultimate mark of sophistication is not just how a garment looks, but how it was conceived, manufactured, and returned to the earth.',
      'We implement a circular design approach that guarantees zero fabric waste in our cutting patterns. We actively collect and repurpose cutting leftovers to craft beautiful bespoke accessories and premium insulation lining for winter pieces.',
      'Sustainable fashion is a commitment to the craftsmen, the textile gatherers, and the longevity of the garments. It means valuing small-batch manufacturing and encouraging clients to buy with intent.',
      'By selecting certified materials and investing in timeless designs, we build a legacy that respects our heritage and protects our future.'
    ]
  },
  'art-of-tailoring': {
    slug: 'art-of-tailoring',
    title: 'The Art of Tailoring: From Thread to Silhouette',
    excerpt: 'An intimate look into our atelier, showcasing the timeless drafting methods used to create sculptural winter coats.',
    category: 'BEHIND THE SCENES',
    author: 'Marco Valenti',
    date: 'SEPTEMBER 15, 2026',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop',
    readTime: '9 min read',
    content: [
      'Tailoring is the poetry of clothing. It is the meticulous translation of a flat roll of fabric into a three-dimensional sculpture that matches the unique contours of the human form.',
      'Every coat we draft features hand-guided canvas lining and hand-padded lapels that acquire their shape through soft moisture and custom pressing. This old-world technique ensures that the coat retains its pristine shape for decades.',
      'We prioritize double-faced cashmere and premium dense wools sourced directly from ethical Italian mills. This allows us to construct clean, unlined interiors that are exceptionally warm yet visually weightless.',
      'At YOUR STYLE, tailors work with a devotion to perfection that is rare in today’s fast-paced world. The result is a sculptural masterpiece that wraps you in pure elegance.'
    ]
  }
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES_DATA[slug];

  if (!article) {
    notFound();
  }

  // Related articles (excluding current)
  const related = Object.values(ARTICLES_DATA)
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  return (
    <div className="bg-warm-ivory text-[#1c1b1b] min-h-screen pb-24">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-widest text-champagne-gold hover:text-neutral-900 transition-colors font-bold inline-flex items-center gap-2"
        >
          ← Back to Journal
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-16 text-center space-y-6">
        <span className="text-[10px] text-champagne-gold uppercase tracking-[0.3em] font-semibold">
          {article.category}
        </span>
        <h1 className="font-serif text-3xl md:text-[56px] text-neutral-900 font-bold leading-tight tracking-tight">
          {article.title}
        </h1>
        <p className="text-base md:text-lg font-light text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          {article.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <div className="w-10 h-10 rounded-full bg-[#755a24] text-white flex items-center justify-center font-bold text-xs uppercase">
            {article.author.substring(0, 2)}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{article.author}</p>
            <p className="text-[10px] text-neutral-400 font-light">{article.date} • {article.readTime}</p>
          </div>
        </div>
      </header>

      {/* Main Image */}
      <div className="max-w-[1200px] mx-auto px-6 mb-16">
        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-sm">
          <img alt={article.title} className="w-full h-full object-cover" src={article.image} />
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-6 space-y-8 text-neutral-600 font-light text-base md:text-lg leading-relaxed">
        {article.content.map((p, index) => {
          if (index === 1) {
            return (
              <div key={index} className="space-y-8">
                <p>{p}</p>
                {/* Stunning Luxury Blockquote */}
                <blockquote className="border-l-2 border-champagne-gold pl-6 py-2 my-8">
                  <p className="font-serif text-xl md:text-2xl italic text-[#755a24]">
                    "True elegance does not demand attention. It is a silent signature of craftsmanship, detail, and pure intent."
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

      {/* Related Articles */}
      <section className="max-w-4xl mx-auto px-6 mt-28 pt-16 border-t border-neutral-200/60">
        <h3 className="font-serif text-2xl text-neutral-900 mb-8 uppercase tracking-wide">
          Related Articles
        </h3>
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
                <p className="text-xs font-light text-neutral-500 line-clamp-2 leading-relaxed">
                  {a.excerpt}
                </p>
              </div>
              <span className="text-[10px] text-neutral-400 font-light uppercase tracking-widest block pt-6">
                Read Article →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
