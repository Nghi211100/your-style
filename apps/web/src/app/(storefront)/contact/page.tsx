'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      setStatus('sent');
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });

      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  const faqs = [
    {
      q: 'Shipping & Delivery',
      a: 'We offer complimentary worldwide shipping on all orders over $500. Standard shipping times range from 3-5 business days domestically and 7-10 business days internationally. Each order is tracked and insured.',
    },
    {
      q: 'Return Policy',
      a: 'Items must be returned within 14 days of receipt in their original condition with all tags attached. Returns are complimentary for store credit, or subject to a small processing fee for refunds to the original payment method.',
    },
    {
      q: 'Atelier Sizing Guide',
      a: 'Our garments are tailored to European sizing. We recommend visiting our Size Guide for detailed measurements or booking a virtual consultation with one of our stylists for a personalized fit assessment.',
    },
    {
      q: 'Garment Care Instructions',
      a: 'Luxury materials require specialized care. Most of our silk and cashmere items are dry-clean only. Please refer to the specific care label found inside each garment for detailed preservation instructions.',
    },
    {
      q: 'Payment Methods & Options',
      a: 'We accept all major credit cards, PayPal, and Apple Pay. For your convenience, we also offer interest-free installments through our partners at Klarna and Affirm for eligible regions.',
    },
  ];

  return (
    <div className="bg-warm-ivory text-[#1c1b1b] min-h-screen">
      {/* Header */}
      <header className="bg-[#f3ece9]/70 flex flex-col items-center justify-center text-center py-20 px-6">
        <span className="text-[10px] text-champagne-gold uppercase tracking-[0.3em] font-semibold mb-3">
          CONTACT
        </span>
        <h1 className="font-serif text-4xl md:text-[56px] text-neutral-900 mb-6 font-bold tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm font-light text-neutral-500 max-w-lg leading-relaxed">
          We would love to hear from you. Our dedicated team is here to assist
          with any inquiries.
        </p>
      </header>

      {/* Two-Column Contact Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Form */}
          <div className="space-y-8">
            <h2 className="text-xs tracking-[0.2em] font-bold uppercase text-neutral-800">
              SEND US A MESSAGE
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider ml-1">
                    First Name
                  </label>
                  <input
                    required
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full bg-[#fcf8f6] border border-neutral-200 rounded-lg p-4 text-sm outline-none focus:border-champagne-gold transition-colors placeholder:text-neutral-300"
                    placeholder="Enter first name"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider ml-1">
                    Last Name
                  </label>
                  <input
                    required
                    value={formState.lastName}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    className="w-full bg-[#fcf8f6] border border-neutral-200 rounded-lg p-4 text-sm outline-none focus:border-champagne-gold transition-colors placeholder:text-neutral-300"
                    placeholder="Enter last name"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <input
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-[#fcf8f6] border border-neutral-200 rounded-lg p-4 text-sm outline-none focus:border-champagne-gold transition-colors placeholder:text-neutral-300"
                  placeholder="example@email.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider ml-1">
                  Subject
                </label>
                <select
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full bg-[#fcf8f6] border border-neutral-200 rounded-lg p-4 text-sm outline-none focus:border-champagne-gold transition-colors appearance-none cursor-pointer"
                >
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Returns</option>
                  <option>Press</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider ml-1">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-[#fcf8f6] border border-neutral-200 rounded-lg p-4 text-sm outline-none focus:border-champagne-gold transition-colors resize-none placeholder:text-neutral-300"
                  placeholder="How can we help?"
                />
              </div>
              <button
                disabled={status !== 'idle'}
                className={`w-full text-white py-5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md ${
                  status === 'sent'
                    ? 'bg-[#755a24]'
                    : status === 'sending'
                    ? 'bg-neutral-500 cursor-not-allowed'
                    : 'bg-black hover:bg-neutral-800'
                }`}
                type="submit"
              >
                {status === 'sent'
                  ? 'MESSAGE SENT'
                  : status === 'sending'
                  ? 'SENDING...'
                  : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

          {/* Right Column: Information Cards */}
          <div className="space-y-8 lg:pl-6">
            {/* Visit Card */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-200/50 shadow-sm space-y-6 hover:-translate-y-1 transition-all duration-500">
              <h3 className="font-serif text-xl font-bold text-neutral-800">
                VISIT OUR ATELIER
              </h3>
              <p className="text-neutral-500 font-light text-sm leading-relaxed">
                128 Rue du Faubourg Saint-Honoré
                <br />
                75008 Paris, France
              </p>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100">
                <img
                  className="w-full h-full object-cover grayscale opacity-60"
                  alt="Minimalist boutique exterior"
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2940&auto=format&fit=crop"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#755a24] text-white p-3 rounded-full shadow-lg">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex justify-between text-xs uppercase tracking-wider font-light">
                <span className="text-neutral-400">Mon — Fri</span>
                <span className="text-neutral-800 font-semibold">10:00 AM — 7:00 PM</span>
              </div>
            </div>

            {/* Reach Out Card */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-200/50 shadow-sm hover:-translate-y-1 transition-all duration-500">
              <h3 className="font-serif text-xl font-bold text-neutral-800 mb-6">
                REACH OUT
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 group">
                  <div className="p-3 bg-[#fdf8f7] text-[#755a24] rounded-full group-hover:bg-[#755a24] group-hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-600 font-light">+33 1 45 61 90 00</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="p-3 bg-[#fdf8f7] text-[#755a24] rounded-full group-hover:bg-[#755a24] group-hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-600 font-light">concierge@yourstyle.com</span>
                </li>
              </ul>
            </div>

            {/* Social Follow */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-200/50 shadow-sm hover:-translate-y-1 transition-all duration-500">
              <h3 className="font-serif text-xl font-bold text-neutral-800 mb-6">
                FOLLOW OUR ATELIER
              </h3>
              <div className="flex gap-4">
                {['Instagram', 'Pinterest', 'Vogue Pro', 'Atelier Plus'].map((social) => (
                  <button
                    key={social}
                    className="px-4 py-2.5 rounded-full border border-neutral-200 text-neutral-600 text-xs font-semibold hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f3ece9]/40 border-t border-silk py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <h2 className="font-serif text-3xl text-center text-neutral-900 mb-16 uppercase tracking-wider">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border border-neutral-200/50 shadow-sm overflow-hidden transition-all duration-300"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer font-serif text-base font-bold text-neutral-800 list-none outline-none">
                  {faq.q}
                  <span className="text-xs transition-transform duration-300 group-open:rotate-180 text-neutral-400">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 text-neutral-500 font-light text-sm leading-relaxed border-t border-neutral-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
