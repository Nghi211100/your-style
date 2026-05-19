'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states initialized from URL query parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Interactive UI states
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger search parameter sync and products fetch when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (category && category !== 'all') queryParams.set('category', category);
        if (selectedSize) queryParams.set('size', selectedSize);
        if (selectedColor) queryParams.set('color', selectedColor);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (sortBy) queryParams.set('sortBy', sortBy);

        // Sync URL for shareability & consistency
        const newUrl = `/shop?${queryParams.toString()}`;
        window.history.pushState(null, '', newUrl);

        const res = await fetch(`${process.env.API_URL}/products?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to query products from catalog');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error('Error fetching filtered products:', err);
        setError(err.message || 'Error occurred while loading collection.');
      } finally {
        setIsLoading(false);
      }
    };

    // Add brief debounce for search & price text inputs to optimize network request load
    const delayDebounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category, selectedSize, selectedColor, minPrice, maxPrice, sortBy]);

  // Handle URL change detection (e.g. user clicked category link on Homepage)
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  const clearAllFilters = () => {
    setSearch('');
    setCategory('all');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const categoriesList = [
    { name: 'All Collection', value: 'all' },
    { name: 'Women', value: 'women' },
    { name: 'Men', value: 'men' },
    { name: 'Accessories', value: 'accessories' }
  ];

  const sizesList = ['XS', 'S', 'M', 'L', 'XL'];
  const colorsList = [
    { name: 'Black', value: 'black', hex: '#1c1b1b' },
    { name: 'White', value: 'white', hex: '#ffffff', border: true },
    { name: 'Beige', value: 'beige', hex: '#d4c5b3' },
    { name: 'Navy', value: 'navy', hex: '#1d2a44' },
    { name: 'Grey', value: 'grey', hex: '#8a8a8a' },
    { name: 'Tan', value: 'tan', hex: '#a67b5b' }
  ];

  return (
    <div className="w-full px-5 md:px-16 py-12 md:py-20 max-w-[1440px] mx-auto bg-warm-ivory text-[#1c1b1b]">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 block text-champagne-gold">
            LUXURY ATELIER
          </span>
          <h1 className="text-4xl md:text-[56px] font-serif font-bold leading-tight tracking-tight">
            The Atelier Catalog
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Elegant Search Bar */}
          <div className="relative flex-1 md:flex-initial min-w-[240px]">
            <input
              type="text"
              placeholder="Search garments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/60 border border-neutral-200 rounded-md py-2.5 pl-10 pr-4 text-xs focus:border-champagne-gold focus:bg-white outline-none transition-all duration-300 placeholder:text-neutral-400"
            />
            <svg
              className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Toggle Filter Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase border rounded-md px-5 py-3 transition-all duration-300 ${
              isFilterPanelOpen 
                ? 'bg-neutral-900 border-neutral-900 text-white' 
                : 'bg-white/60 border-neutral-200 hover:bg-neutral-50 text-neutral-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(selectedSize || selectedColor || minPrice || maxPrice || category !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse"></span>
            )}
          </button>

          {/* Sort Selection */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 border border-neutral-200 text-neutral-800 rounded-md px-5 py-3 text-xs font-semibold tracking-wider uppercase cursor-pointer outline-none hover:bg-neutral-50 appearance-none pr-10"
            >
              <option value="newest">New In</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none text-neutral-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {isFilterPanelOpen && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/50 mb-10 space-y-8 animate-fade-in-up">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-neutral-800 uppercase tracking-wide">Filter Garments</h3>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold tracking-widest uppercase text-champagne-gold hover:text-neutral-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider block text-neutral-400 font-bold">Category</label>
              <div className="flex flex-col gap-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`text-left text-xs font-medium py-1.5 px-3 rounded-md transition-colors ${
                      category === cat.value
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider block text-neutral-400 font-bold">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`w-10 h-10 flex items-center justify-center text-xs border rounded-full transition-all duration-300 font-mono ${
                      selectedSize === size
                        ? 'bg-black border-black text-white font-bold'
                        : 'border-neutral-200 bg-white hover:border-black text-neutral-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider block text-neutral-400 font-bold">Colors</label>
              <div className="flex flex-wrap gap-3">
                {colorsList.map((color) => (
                  <button
                    key={color.value}
                    title={color.name}
                    onClick={() => setSelectedColor(selectedColor === color.value ? '' : color.value)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      selectedColor === color.value
                        ? 'ring-2 ring-champagne-gold ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    } ${color.border ? 'border-neutral-300' : 'border-transparent'}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.value && (
                      <span className={`w-1.5 h-1.5 rounded-full ${color.value === 'white' ? 'bg-black' : 'bg-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider block text-neutral-400 font-bold">Price Range</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-3 text-xs outline-none focus:border-champagne-gold focus:bg-white transition-all placeholder:text-neutral-400"
                />
                <span className="text-neutral-400 font-light">—</span>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-3 text-xs outline-none focus:border-champagne-gold focus:bg-white transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading & Error State */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium animate-pulse">Loading Collection...</p>
        </div>
      ) : error ? (
        <div className="py-32 text-center bg-white rounded-2xl border border-neutral-200/50 p-8 max-w-md mx-auto shadow-sm">
          <p className="text-sm text-neutral-600 mb-4">{error}</p>
          <button
            onClick={clearAllFilters}
            className="bg-black text-white px-6 py-3 rounded-md text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : products.length > 0 ? (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/shop/${product.slug}`} 
              className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100/50 h-full"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-50">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300 text-xs uppercase tracking-widest">
                    No image available
                  </div>
                )}
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
        <div className="py-32 text-center bg-white rounded-2xl border border-neutral-200/50 p-8 max-w-lg mx-auto shadow-sm">
          <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-800 mb-2">No Garments Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mb-6">
            We couldn't find any items matching your selected criteria. Try adjusting search queries, clearing sizes, or expanding your price ranges.
          </p>
          <button
            onClick={clearAllFilters}
            className="bg-black text-white px-6 py-3 rounded-md text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
          >
            Reset Catalog
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="py-32 flex flex-col items-center justify-center space-y-4 bg-warm-ivory min-h-screen">
        <div className="w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Preparing Catalog...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
