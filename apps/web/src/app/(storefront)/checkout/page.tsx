'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';

interface ShippingAddress {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Confirmation
  
  // Shipping form state
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  // Pre-populate shipping form with authenticated user details
  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(' ') : ['', ''];
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      setShippingForm(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
      }));
    }
  }, [user]);

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'nextday'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'cod'>('credit');
  
  // Payment card state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form field active styling state
  const [activeField, setActiveField] = useState<string | null>(null);

  // Hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fdf8f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-[60vh] bg-[#fdf8f7] flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-3xl tracking-wide text-neutral-900 mb-4 uppercase">Your Cart is Empty</h1>
        <p className="font-light text-neutral-500 mb-8 max-w-md text-center">
          You need to add some of our meticulously crafted luxury items before checking out.
        </p>
        <Link 
          href="/shop" 
          className="bg-black text-white px-8 py-4 rounded-md uppercase tracking-[0.2em] text-xs hover:bg-[#755a24] transition-colors duration-500"
        >
          Explore the Collection
        </Link>
      </div>
    );
  }

  const getShippingCost = () => {
    if (shippingMethod === 'express') return 15;
    if (shippingMethod === 'nextday') return 25;
    return 0;
  };

  const getTax = () => {
    return Math.round(getTotalPrice() * 0.08 * 100) / 100;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost() + getTax();
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate simple required fields
    const { email, phone, firstName, lastName, address, city, state, zipCode } = shippingForm;
    if (!email || !phone || !firstName || !lastName || !address || !city || !state || !zipCode) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSubmit = async () => {
    setIsSubmitting(true);
    const shippingCost = getShippingCost();
    const finalTotal = getFinalTotal();

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: shippingForm.email,
          name: `${shippingForm.firstName} ${shippingForm.lastName}`,
          total: finalTotal,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const createdOrder = await response.json();
      setOrderId(createdOrder.id);
      
      // Clear client state & Redis cart
      await clearCart();
      
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fdf8f7] text-[#1c1b1b] min-h-screen py-12 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Step Indicator */}
        <nav className="flex items-center justify-center space-x-8 mb-16">
          <button 
            onClick={() => step > 1 && step < 3 && setStep(1)}
            disabled={step === 3}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[#755a24]' : 'bg-neutral-300'}`} />
            <span className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${step >= 1 ? 'text-black font-bold' : 'text-neutral-400'}`}>
              1. Shipping
            </span>
          </button>
          <div className="w-12 h-[1px] bg-neutral-300/60" />
          <button 
            onClick={() => step === 2 && setStep(2)}
            disabled={step !== 2}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[#755a24]' : 'bg-neutral-300'}`} />
            <span className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${step >= 2 ? 'text-black font-bold' : 'text-neutral-400'}`}>
              2. Payment
            </span>
          </button>
          <div className="w-12 h-[1px] bg-neutral-300/60" />
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step === 3 ? 'bg-[#755a24]' : 'bg-neutral-300'}`} />
            <span className={`font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${step === 3 ? 'text-black font-bold' : 'text-neutral-400'}`}>
              3. Success
            </span>
          </div>
        </nav>

        {step !== 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-start">
            
            {/* Left Form Column */}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-100/50">
              {step === 1 ? (
                <div>
                  <h2 className="font-serif text-2xl tracking-wide uppercase mb-8 border-b pb-4 border-neutral-100 text-neutral-800">
                    Shipping Details
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'email' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={shippingForm.email}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'phone' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          value={shippingForm.phone}
                          onFocus={() => setActiveField('phone')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'firstName' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          First Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingForm.firstName}
                          onFocus={() => setActiveField('firstName')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'lastName' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          Last Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingForm.lastName}
                          onFocus={() => setActiveField('lastName')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'address' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          Street Address *
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingForm.address}
                          onFocus={() => setActiveField('address')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                          placeholder="House number and street name"
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'apartment' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          Apartment, suite, unit, etc. (optional)
                        </label>
                        <input
                          type="text"
                          value={shippingForm.apartment}
                          onFocus={() => setActiveField('apartment')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, apartment: e.target.value })}
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'city' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          City *
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingForm.city}
                          onFocus={() => setActiveField('city')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'state' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                            State *
                          </label>
                          <input
                            required
                            type="text"
                            value={shippingForm.state}
                            onFocus={() => setActiveField('state')}
                            onBlur={() => setActiveField(null)}
                            onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'zipCode' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                            ZIP Code *
                          </label>
                          <input
                            required
                            type="text"
                            value={shippingForm.zipCode}
                            onFocus={() => setActiveField('zipCode')}
                            onBlur={() => setActiveField(null)}
                            onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className={`text-[10px] uppercase tracking-wider block transition-colors ${activeField === 'country' ? 'text-[#755a24] font-semibold' : 'text-neutral-400'}`}>
                          Country *
                        </label>
                        <select
                          value={shippingForm.country}
                          onFocus={() => setActiveField('country')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>France</option>
                          <option>Japan</option>
                          <option>Vietnam</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-neutral-100">
                      <h3 className="font-serif text-lg tracking-wide uppercase mb-6 text-neutral-700">
                        Shipping Method
                      </h3>
                      <div className="space-y-4">
                        <label className={`flex items-center justify-between p-5 rounded-lg cursor-pointer border transition-all duration-300 ${shippingMethod === 'standard' ? 'border-black bg-neutral-50/80 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50/30'}`}>
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'standard'}
                              onChange={() => setShippingMethod('standard')}
                              className="text-black focus:ring-black h-4 w-4 accent-black"
                            />
                            <div>
                              <p className="font-semibold text-xs uppercase tracking-wider text-neutral-800">Standard Delivery</p>
                              <p className="text-[10px] text-neutral-400 uppercase mt-0.5">3-5 Business Days</p>
                            </div>
                          </div>
                          <span className="text-xs uppercase font-semibold text-[#755a24]">Free</span>
                        </label>

                        <label className={`flex items-center justify-between p-5 rounded-lg cursor-pointer border transition-all duration-300 ${shippingMethod === 'express' ? 'border-black bg-neutral-50/80 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50/30'}`}>
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'express'}
                              onChange={() => setShippingMethod('express')}
                              className="text-black focus:ring-black h-4 w-4 accent-black"
                            />
                            <div>
                              <p className="font-semibold text-xs uppercase tracking-wider text-neutral-800">Express Delivery</p>
                              <p className="text-[10px] text-neutral-400 uppercase mt-0.5">1-2 Business Days</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#755a24]">$15.00</span>
                        </label>

                        <label className={`flex items-center justify-between p-5 rounded-lg cursor-pointer border transition-all duration-300 ${shippingMethod === 'nextday' ? 'border-black bg-neutral-50/80 shadow-sm' : 'border-neutral-200 hover:bg-neutral-50/30'}`}>
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === 'nextday'}
                              onChange={() => setShippingMethod('nextday')}
                              className="text-black focus:ring-black h-4 w-4 accent-black"
                            />
                            <div>
                              <p className="font-semibold text-xs uppercase tracking-wider text-neutral-800">Next Day Arrival</p>
                              <p className="text-[10px] text-neutral-400 uppercase mt-0.5">Order by 2pm EST</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#755a24]">$25.00</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-5 rounded-md font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#755a24] transition-colors duration-500 mt-8 shadow-md"
                    >
                      Continue to Payment
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="font-serif text-2xl tracking-wide uppercase mb-8 border-b pb-4 border-neutral-100 text-neutral-800">
                    Payment Method
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4 mb-8">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit')}
                        className={`flex-1 py-4 border rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-300 ${paymentMethod === 'credit' ? 'border-black bg-neutral-50 font-bold' : 'border-neutral-200 hover:bg-neutral-50/40 text-neutral-400'}`}
                      >
                        Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex-1 py-4 border rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-300 ${paymentMethod === 'cod' ? 'border-black bg-neutral-50 font-bold' : 'border-neutral-200 hover:bg-neutral-50/40 text-neutral-400'}`}
                      >
                        Cash on Delivery
                      </button>
                    </div>

                    {paymentMethod === 'credit' ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Cardholder Name</label>
                          <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Card Number</label>
                          <input
                            required
                            type="text"
                            placeholder="•••• •••• •••• ••••"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                              const matches = v.match(/\d{4,16}/g);
                              const match = (matches && matches[0]) || '';
                              const parts = [];
                              for (let i = 0, len = match.length; i < len; i += 4) {
                                parts.push(match.substring(i, i + 4));
                              }
                              if (parts.length > 0) {
                                setCardNumber(parts.join(' '));
                              } else {
                                setCardNumber(v);
                              }
                            }}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">Expiration (MM/YY)</label>
                            <input
                              required
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                if (v.length > 2) {
                                  v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
                                }
                                setCardExpiry(v);
                              }}
                              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-400 block">CVV</label>
                            <input
                              required
                              type="password"
                              placeholder="•••"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md p-4 text-sm focus:border-[#755a24] focus:bg-white transition-all outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-md text-xs leading-relaxed text-neutral-500 font-light">
                        <p className="font-semibold uppercase tracking-wider text-neutral-800 mb-2">Cash On Delivery Terms</p>
                        Receive your exquisitely crafted garment directly at your doorstep and make payment in cash upon collection. Please ensure you inspect the packaging before signing off.
                      </div>
                    )}

                    <div className="flex gap-4 pt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border border-neutral-300 text-neutral-700 py-5 rounded-md font-mono text-xs uppercase tracking-[0.2em] hover:bg-neutral-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleOrderSubmit}
                        disabled={isSubmitting || (paymentMethod === 'credit' && (!cardName || !cardNumber || !cardExpiry || !cardCvv))}
                        className="flex-1 bg-black text-white py-5 rounded-md font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#755a24] transition-colors duration-500 disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          'Complete Order'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Column */}
            <aside className="sticky top-32 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-100/50">
                <h3 className="font-serif text-lg tracking-wide uppercase mb-6 text-neutral-800 border-b pb-3 border-neutral-100">
                  Order Summary
                </h3>
                
                {/* Cart Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-neutral-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-50 last:border-0 last:pb-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 object-cover rounded shadow-sm flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs uppercase tracking-tight text-neutral-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 uppercase mt-0.5">
                          {item.size && `Size ${item.size}`} {item.color && `| ${item.color}`}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-neutral-400">Qty: {item.quantity}</span>
                          <span className="text-xs font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Taxes */}
                <div className="border-t border-neutral-100 pt-6 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400 uppercase tracking-wider">Subtotal</span>
                    <span className="font-medium">${getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400 uppercase tracking-wider">Shipping</span>
                    <span className="font-medium text-[#755a24]">
                      {shippingMethod === 'standard' ? 'Free' : `$${getShippingCost().toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400 uppercase tracking-wider">Estimated Tax (8%)</span>
                    <span className="font-medium">${getTax().toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-neutral-100">
                    <span className="font-serif text-sm uppercase tracking-wide font-bold">Total</span>
                    <span className="font-serif text-base font-bold text-neutral-900">
                      ${getFinalTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Checkout Banner */}
              <div className="flex items-start gap-4 p-5 border border-neutral-200/50 rounded-xl bg-neutral-50/50">
                <svg className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Secure Data Transmission</p>
                  <p className="text-[9px] text-neutral-400 uppercase leading-relaxed mt-1">
                    Your luxury transaction is encrypted via advanced AES-256 protocols. Your credit card information is processed securely.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="max-w-2xl mx-auto bg-white p-8 md:p-16 rounded-2xl shadow-sm border border-neutral-100/50 text-center space-y-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-[#f7f3f1] rounded-full flex items-center justify-center mx-auto text-[#755a24] shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h2 className="font-serif text-3xl tracking-wide uppercase text-neutral-900">Order Confirmed</h2>
              <p className="text-sm font-light text-neutral-500 max-w-md mx-auto">
                Thank you for purchasing with us. Your luxury bespoke order has been successfully placed.
              </p>
            </div>

            <div className="p-6 bg-[#fdf8f7] rounded-xl border border-neutral-100/70 inline-block text-left space-y-2">
              <div className="flex justify-between gap-12 text-xs">
                <span className="text-neutral-400 uppercase tracking-widest">Order ID</span>
                <span className="font-mono font-bold text-neutral-800 select-all">{orderId}</span>
              </div>
              <div className="flex justify-between gap-12 text-xs">
                <span className="text-neutral-400 uppercase tracking-widest">Delivery Option</span>
                <span className="font-semibold uppercase tracking-wider text-[#755a24]">
                  {shippingMethod === 'standard' ? 'Standard (3-5 Days)' : shippingMethod === 'express' ? 'Express (1-2 Days)' : 'Next Day Arrival'}
                </span>
              </div>
              <div className="flex justify-between gap-12 text-xs">
                <span className="text-neutral-400 uppercase tracking-widest">Total Price</span>
                <span className="font-bold text-neutral-900">${getFinalTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop" 
                className="bg-black text-white px-8 py-4 rounded-md uppercase tracking-[0.2em] text-xs hover:bg-[#755a24] transition-colors duration-500 shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
