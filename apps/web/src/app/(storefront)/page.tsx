import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 0; // Fresh content every time

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
}

async function getNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.slice(0, 4); // Take latest 4
  } catch (error) {
    console.error('Error fetching new arrivals for homepage:', error);
    return [];
  }
}

export default async function Home() {
  const newArrivals = await getNewArrivals();

  return (
    <div className="bg-warm-ivory text-[#1c1b1b]">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row min-h-[calc(100vh-72px)] relative">
        <div className="w-full md:w-[55%] relative overflow-hidden h-[500px] md:h-auto">
          <img
            className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-[2000ms] ease-out"
            alt="High-fashion editorial shot"
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>
        <div className="w-full md:w-[45%] bg-[#fdf8f7] flex flex-col justify-center items-center px-6 md:px-16 py-24 text-center border-l border-silk">
          <span className="text-[10px] text-champagne-gold mb-4 tracking-[0.3em] font-medium uppercase">
            NEW COLLECTION 2026
          </span>
          <h1 className="text-4xl md:text-[64px] font-serif font-bold text-neutral-900 mb-6 max-w-lg leading-[1.1] tracking-tight">
            Redefine Your Elegance
          </h1>
          <p className="text-sm font-light text-neutral-500 mb-10 max-w-sm leading-relaxed">
            Curated silhouettes designed for the modern visionary. Craftsmanship
            that whispers, style that speaks volumes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <Link
              href="/shop"
              className="bg-black text-white text-center px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase rounded-md hover:bg-[#755a24] transition-all duration-500 shadow-sm"
            >
              EXPLORE COLLECTION
            </Link>
            <Link
              href="/shop"
              className="border border-neutral-300 text-neutral-800 text-center px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase rounded-md hover:bg-neutral-50 transition-all duration-500"
            >
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="px-5 md:px-16 py-28 max-w-[1440px] mx-auto">
        <span className="text-[10px] text-champagne-gold tracking-[0.3em] uppercase mb-3 text-center block font-semibold">
          DISCOVERY
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-wide uppercase mb-12 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: 'Women',
              image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2973&auto=format&fit=crop',
              slug: 'women',
            },
            {
              name: 'Men',
              image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop',
              slug: 'men',
            },
            {
              name: 'Accessories',
              image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2815&auto=format&fit=crop',
              slug: 'accessories',
            },
            {
              name: 'New In',
              image: 'https://images.unsplash.com/photo-1434389678369-1835747158c3?q=80&w=2942&auto=format&fit=crop',
              slug: 'new',
            },
          ].map((category) => (
            <Link
              href={`/shop?category=${category.slug}`}
              key={category.name}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt={category.name}
                src={category.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-6">
                <div className="flex flex-col">
                  <span className="text-white text-xs tracking-[0.2em] uppercase font-light">
                    Category
                  </span>
                  <span className="text-white font-serif text-lg tracking-wide uppercase mt-1 font-bold">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals (Fetch from API) */}
      <section className="bg-white/40 border-y border-silk px-5 md:px-16 py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] text-champagne-gold tracking-[0.3em] uppercase block mb-2 font-semibold">
                CURATED SELECTION
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-wide uppercase">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs text-champagne-gold hover:text-black hover:border-black transition-all border-b border-champagne-gold pb-1 font-semibold tracking-wider"
            >
              VIEW ALL ITEMS
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md group transition-all duration-300 border border-neutral-100/50 flex flex-col h-full"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                    {product.images && product.images[0] ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        alt={product.name}
                        src={product.images[0]}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300 text-xs uppercase tracking-widest">
                        Image Unavailable
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-light mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-[15px] font-bold text-neutral-800 leading-snug group-hover:text-champagne-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-neutral-50">
                      <span className="text-xs text-neutral-400 uppercase font-light">Price</span>
                      <span className="text-sm font-semibold text-[#755a24] font-mono">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-neutral-200 rounded-xl bg-[#fdf8f7]">
              <p className="text-sm text-neutral-500 font-light mb-4">No arrivals in catalog.</p>
              <Link href="/shop" className="text-xs underline tracking-widest uppercase hover:text-champagne-gold">
                Shop Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Editorial Spotlight */}
      <section className="px-5 md:px-16 py-28 max-w-[1440px] mx-auto">
        <span className="text-[10px] text-champagne-gold tracking-[0.3em] uppercase mb-3 text-center block font-semibold">
          THE JOURNAL
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-wide uppercase mb-12 text-center">
          Editorial Spotlight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="group relative h-[500px] overflow-hidden rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-end p-8 md:p-12">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="Sustainable Fashion"
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2940&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white space-y-4">
              <span className="text-[10px] text-champagne-gold tracking-[0.2em] uppercase font-bold">
                SUSTAINABILITY
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                Sustainable Fashion: The New Luxury Standard
              </h3>
              <p className="text-xs text-neutral-300 font-light max-w-md leading-relaxed">
                Why mindfulness and circular tailoring represent the absolute pinnacle of high fashion in 2026 and beyond.
              </p>
              <Link
                href="/blog/sustainable-fashion"
                className="inline-block text-xs uppercase tracking-widest border-b border-white hover:border-champagne-gold hover:text-champagne-gold transition-colors pb-1"
              >
                Read Article
              </Link>
            </div>
          </div>

          <div className="group relative h-[500px] overflow-hidden rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-end p-8 md:p-12">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="Art of Tailoring"
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2942&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white space-y-4">
              <span className="text-[10px] text-champagne-gold tracking-[0.2em] uppercase font-bold">
                CRAFTSMANSHIP
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                The Art of Tailoring: From Thread to Silhouette
              </h3>
              <p className="text-xs text-neutral-300 font-light max-w-md leading-relaxed">
                An intimate look into our atelier, showcasing the timeless drafting methods used to create sculptural coats.
              </p>
              <Link
                href="/blog/art-of-tailoring"
                className="inline-block text-xs uppercase tracking-widest border-b border-white hover:border-champagne-gold hover:text-champagne-gold transition-colors pb-1"
              >
                Read Article
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Banner */}
      <section className="bg-[#f7f3f1] border-t border-silk overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-8 md:p-20 order-2 md:order-1 text-center md:text-left space-y-6">
            <span className="text-[10px] text-champagne-gold tracking-widest font-semibold uppercase block">
              WINTER COLLECTION
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-neutral-900 leading-tight">
              Timeless Pieces, Modern Craft
            </h2>
            <p className="text-sm font-light text-neutral-500 max-w-md mx-auto md:mx-0 leading-relaxed">
              Discover the intersection of warmth and sophistication with our limited edition winter capsule. Every wool weave is sourced sustainably and hand-guided through assembly.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-10 py-4 text-xs font-semibold tracking-[0.2em] rounded-md hover:bg-[#755a24] transition-all duration-500 uppercase shadow-sm"
            >
              DISCOVER NOW
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[450px] md:h-[650px] order-1 md:order-2 relative overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Winter Collection"
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-neutral-900 text-white px-5 md:px-16 py-28 text-center border-t border-neutral-800">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] text-champagne-gold mb-3 tracking-[0.3em] block font-bold uppercase">
            JOIN THE CLUB
          </span>
          <h2 className="font-serif text-3xl md:text-5xl mb-6 tracking-wide">Stay in Style</h2>
          <p className="text-sm font-light opacity-80 max-w-md mx-auto leading-relaxed">
            Receive early access to collections, exclusive events, and editorial insights delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
            <input
              className="flex-1 bg-transparent border-b border-neutral-700 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-champagne-gold transition-colors text-sm font-light"
              placeholder="Your Email Address"
              type="email"
            />
            <button className="bg-[#755a24] text-white px-8 py-3 rounded-md text-xs font-semibold tracking-widest uppercase hover:bg-opacity-90 transition-opacity">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
