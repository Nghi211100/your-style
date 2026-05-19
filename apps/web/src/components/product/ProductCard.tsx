import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group cursor-pointer space-y-4 block">
      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-surface-container relative">
        {product.images && product.images.length > 0 ? (
          <Image 
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-cashmere-gray/20 flex items-center justify-center text-warm-stone">
            No Image
          </div>
        )}
        <button className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div>
        <p className="font-light text-[10px] text-warm-stone uppercase tracking-widest">{product.category}</p>
        <h3 className="text-[14px] font-medium text-deep-espresso mt-1">{product.name}</h3>
        <p className="text-[14px] text-warm-stone mt-1">${product.price}</p>
      </div>
    </Link>
  );
}
