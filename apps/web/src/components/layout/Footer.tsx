import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-deep-espresso text-warm-ivory px-5 md:px-16 py-20 border-t border-warm-ivory/10 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 max-w-7xl mx-auto">
        {/* Brand */}
        <div>
          <span className="text-xl font-bold tracking-widest uppercase mb-8 block">
            YOUR STYLE
          </span>
          <p className="text-xs opacity-60 leading-relaxed font-light">
            Quiet confidence. Impeccable craft. Intentional restraint.
            Redefining modern luxury for the global visionary.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm tracking-widest uppercase mb-8 font-light">Shop</h4>
          <ul className="space-y-4">
            <li>
              <Link
                href="/shop"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Women
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Men
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm tracking-widest uppercase mb-8 font-light">Help</h4>
          <ul className="space-y-4">
            <li>
              <Link
                href="/about"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-xs opacity-70 hover:text-champagne-gold transition-colors font-light"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow */}
        <div>
          <h4 className="text-sm tracking-widest uppercase mb-8 font-light">Follow</h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-warm-ivory/20 flex items-center justify-center hover:bg-warm-ivory hover:text-deep-espresso transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-warm-ivory/20 flex items-center justify-center hover:bg-warm-ivory hover:text-deep-espresso transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-warm-ivory/20 flex items-center justify-center hover:bg-warm-ivory hover:text-deep-espresso transition-all"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-warm-ivory/10 gap-6">
        <p className="text-xs opacity-50 font-light">
          © 2024 YOUR STYLE. All rights reserved.
        </p>
        <div className="flex gap-4 opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>
    </footer>
  );
}
