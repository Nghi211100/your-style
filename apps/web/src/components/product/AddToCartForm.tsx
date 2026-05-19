'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

interface AddToCartFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    colors: string[];
    sizes: string[];
    stock: number;
  };
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      color: selectedColor,
      size: selectedSize || 'One Size',
      quantity: 1,
    });
  };

  return (
    <div className="space-y-8 mb-16">
      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-widest font-light">Color</span>
            <span className="text-[12px] text-warm-stone">{selectedColor}</span>
          </div>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button 
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border ${selectedColor === color ? 'border-deep-espresso p-1' : 'border-transparent hover:border-warm-stone p-1'} transition-all`}
              >
                <div 
                  className="w-full h-full rounded-full" 
                  style={{ backgroundColor: color.toLowerCase() === 'espresso' ? '#1A1814' : color.toLowerCase() === 'ivory' ? '#FDFBF7' : color.toLowerCase() === 'stone' ? '#8C7E6A' : color.toLowerCase() === 'charcoal' ? '#2C2C2E' : color.toLowerCase() === 'navy' ? '#1D2A44' : color.toLowerCase() === 'camel' ? '#A68966' : '#E5E5E5' }}
                  title={color}
                ></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-widest font-light">Size</span>
            <button className="text-[12px] underline text-warm-stone hover:text-deep-espresso transition-colors">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map((size) => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 border ${selectedSize === size ? 'border-deep-espresso bg-deep-espresso text-white' : 'border-deep-espresso/20 text-center hover:border-deep-espresso'} text-[12px] tracking-wider transition-colors`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={handleAddToCart}
        className="w-full bg-deep-espresso text-white py-4 px-6 text-[12px] uppercase tracking-[0.2em] hover:bg-champagne-gold transition-colors duration-300 disabled:bg-warm-stone disabled:cursor-not-allowed mb-8"
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? `Add to Cart — $${product.price}` : 'Out of Stock'}
      </button>
    </div>
  );
}
