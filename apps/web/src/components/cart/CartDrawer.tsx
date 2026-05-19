'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-outline-variant/30">
          <h2 className="font-headline-md text-[20px] text-deep-espresso uppercase tracking-widest">Your Bag</h2>
          <button 
            onClick={closeCart}
            className="text-warm-stone hover:text-deep-espresso transition-colors p-2"
          >
            <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="font-body-md text-warm-stone">Your bag is empty.</p>
              <button 
                onClick={closeCart}
                className="text-[12px] uppercase tracking-widest underline underline-offset-4 text-deep-espresso hover:text-champagne-gold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-outline-variant/30 pb-6">
                  <div className="relative w-[100px] aspect-[3/4] bg-surface-container rounded-sm overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-body-md text-[14px] text-deep-espresso pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-warm-stone hover:text-error transition-colors"
                        >
                          <svg fill="none" height="16" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <p className="font-label-xs text-[10px] text-warm-stone uppercase tracking-wider mt-1">
                        {item.color} | {item.size}
                      </p>
                      <p className="font-mono text-[14px] text-warm-stone mt-2">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border border-outline-variant/50 flex items-center justify-center text-warm-stone hover:text-deep-espresso hover:border-deep-espresso transition-colors rounded-full"
                      >
                        -
                      </button>
                      <span className="font-mono text-[12px] w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-outline-variant/50 flex items-center justify-center text-warm-stone hover:text-deep-espresso hover:border-deep-espresso transition-colors rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant/30 p-6 bg-surface">
            <div className="flex justify-between items-center mb-6">
              <span className="font-label-sm text-[12px] uppercase tracking-widest text-warm-stone">Subtotal</span>
              <span className="font-mono text-[18px] text-deep-espresso">${getTotalPrice().toFixed(2)}</span>
            </div>
            <p className="font-label-xs text-[10px] text-warm-stone mb-6">Shipping and taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center bg-deep-espresso text-white py-4 font-label-sm text-[12px] uppercase tracking-[0.2em] hover:bg-champagne-gold transition-colors duration-300"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
