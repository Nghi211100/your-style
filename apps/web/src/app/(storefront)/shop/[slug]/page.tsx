import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartForm from '@/components/product/AddToCartForm';
import ProductCard from '@/components/product/ProductCard';
import { getServerApiBaseUrl } from '@/lib/serverApiUrl';

export const revalidate = 0;

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
}

async function getProduct(slug: string): Promise<ProductData | null> {
  const base = getServerApiBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/products/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return null;
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('[your-style] Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(category: string, excludeId: string): Promise<ProductData[]> {
  const base = getServerApiBaseUrl();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/products`, { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }
    const data: unknown = await res.json();
    const products = Array.isArray(data) ? (data as ProductData[]) : [];
    return products.filter((p) => p.category === category && p.id !== excludeId).slice(0, 4);
  } catch (error) {
    console.error('[your-style] Error fetching related products:', error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  return (
    <div className="w-full max-w-[1440px] mx-auto min-h-screen pb-24">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Sticky Images */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-hide flex flex-col">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div key={index} className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-cashmere-gray/10">
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))
          ) : (
            <div className="relative w-full aspect-[3/4] bg-cashmere-gray/20 flex items-center justify-center text-warm-stone">
              No images available
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="w-full lg:w-1/2 px-6 py-12 md:p-16 lg:p-24 flex flex-col bg-warm-ivory">
          <nav className="mb-12">
            <ol className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-warm-stone font-light">
              <li><Link href="/" className="hover:text-deep-espresso transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/shop" className="hover:text-deep-espresso transition-colors">Shop</Link></li>
              <li>/</li>
              <li className="text-deep-espresso">{product.category}</li>
            </ol>
          </nav>

          <div className="mb-10">
            <h1 className="text-[32px] md:text-[40px] font-bold leading-tight tracking-[-0.01em] mb-4 text-deep-espresso">
              {product.name}
            </h1>
            <p className="text-[20px] font-mono text-warm-stone">${product.price}</p>
          </div>

          <div className="mb-12">
            <p className="text-[16px] leading-relaxed text-foreground/80 font-light">
              {product.description}
            </p>
          </div>

          <AddToCartForm product={product} />
          
          <div className="space-y-6 pt-8 border-t border-deep-espresso/10">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="text-[14px] uppercase tracking-wider font-light">Details & Care</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-warm-stone text-[14px] leading-relaxed mt-4 font-light">
                <ul className="list-disc pl-4 space-y-2">
                  <li>Dry clean only</li>
                  <li>Do not bleach</li>
                  <li>Cool iron if needed</li>
                  <li>Made in Italy</li>
                </ul>
              </div>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="text-[14px] uppercase tracking-wider font-light">Shipping & Returns</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-warm-stone text-[14px] leading-relaxed mt-4 font-light">
                <p>Complimentary express shipping on all orders over $500. Returns are accepted within 14 days of delivery for a full refund or exchange. Items must be in their original condition with all tags attached.</p>
              </div>
            </details>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 px-6 md:px-16 lg:px-24">
          <h2 className="text-[12px] uppercase tracking-[0.4em] mb-12 text-center text-deep-espresso">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
