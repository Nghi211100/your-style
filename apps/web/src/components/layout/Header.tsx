'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { getTotalItems, openCart, initializeSession } = useCartStore();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    setMounted(true);
    initializeSession();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-warm-ivory/95 backdrop-blur-md shadow-whisper border-b border-silk'
          : 'bg-warm-ivory/80 backdrop-blur-md border-b border-silk'
      }`}
    >
      <nav className="flex justify-between items-center w-full px-5 md:px-16 py-4 max-w-[1440px] mx-auto">
        {/* Left: Brand & Desktop Nav */}
        <div className="flex items-center gap-8">
          {/* Mobile Hamburger */}
          <button
            aria-label="Menu"
            className="md:hidden hover:opacity-60 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          
          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.2em] uppercase text-deep-espresso hidden md:block"
          >
            Your Style
          </Link>
          
          <div className="hidden md:flex gap-8 ml-4">
            <Link href="/shop" className="text-warm-stone font-medium hover:text-deep-espresso transition-colors duration-300">
              Shop
            </Link>
            <Link href="/about" className="text-warm-stone font-medium hover:text-deep-espresso transition-colors duration-300">
              About
            </Link>
            <Link href="/blog" className="text-warm-stone font-medium hover:text-deep-espresso transition-colors duration-300">
              Editorial
            </Link>
            <Link href="/contact" className="text-warm-stone font-medium hover:text-deep-espresso transition-colors duration-300">
              Contact
            </Link>
          </div>
        </div>

        {/* Center: Brand Logo (Mobile Only) */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] uppercase text-deep-espresso"
          >
            Your Style
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Link href="/search" className="hover:text-champagne-gold transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
          <Link
            href="/account"
            className="hover:text-champagne-gold transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
          <button
            onClick={openCart}
            className="hover:text-champagne-gold transition-colors duration-300 relative"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-2 bg-champagne-gold text-pure-linen text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
