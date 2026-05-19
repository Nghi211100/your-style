'use client';

import React, { useState, useEffect } from 'react';

interface Promo {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minSpend: number;
  expiryDate: string;
  active: boolean;
  usageCount: number;
}

const DEFAULT_PROMOS: Promo[] = [
  {
    id: 'promo-1',
    code: 'MAISONVIP',
    type: 'PERCENTAGE',
    value: 15,
    minSpend: 500,
    expiryDate: '2026-12-31',
    active: true,
    usageCount: 42,
  },
  {
    id: 'promo-2',
    code: 'ATELIER10',
    type: 'PERCENTAGE',
    value: 10,
    minSpend: 0,
    expiryDate: '2026-08-30',
    active: true,
    usageCount: 128,
  },
  {
    id: 'promo-3',
    code: 'WELCOME200',
    type: 'FIXED',
    value: 200,
    minSpend: 1500,
    expiryDate: '2026-06-15',
    active: false,
    usageCount: 15,
  },
];

export default function AdminPromotions() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState(10);
  const [minSpend, setMinSpend] = useState(0);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Load from local storage or set defaults
    const stored = localStorage.getItem('maison_promotions');
    if (stored) {
      setPromos(JSON.parse(stored));
    } else {
      setPromos(DEFAULT_PROMOS);
      localStorage.setItem('maison_promotions', JSON.stringify(DEFAULT_PROMOS));
    }
  }, []);

  const savePromos = (newPromos: Promo[]) => {
    setPromos(newPromos);
    localStorage.setItem('maison_promotions', JSON.stringify(newPromos));
  };

  const handleCopy = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(promoCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = (promoId: string) => {
    const updated = promos.map(p => 
      p.id === promoId ? { ...p, active: !p.active } : p
    );
    savePromos(updated);
  };

  const handleDelete = (promoId: string) => {
    if (!confirm('Are you sure you want to retire this coupon code?')) return;
    const updated = promos.filter(p => p.id !== promoId);
    savePromos(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newPromo: Promo = {
      id: `promo-${Date.now()}`,
      code: code.toUpperCase().replace(/\s+/g, ''),
      type,
      value: Number(value),
      minSpend: Number(minSpend),
      expiryDate,
      active,
      usageCount: 0,
    };

    savePromos([newPromo, ...promos]);
    setIsModalOpen(false);

    // Reset Form
    setCode('');
    setType('PERCENTAGE');
    setValue(10);
    setMinSpend(0);
    setExpiryDate('2026-12-31');
    setActive(true);
  };

  return (
    <div className="font-sans max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#C4A265]/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1814] uppercase">Promotions & Privileges</h1>
          <p className="text-sm text-[#8C7E6A] mt-1">Configure premium boutique coupon codes, VIP perks, seasonal promotions, and discount suites.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1A1814] hover:bg-[#C4A265] text-white font-bold py-2.5 px-6 rounded-lg text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Generate Promo Code</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Active Campaigns</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">{promos.filter(p => p.active).length}</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Currently redeemable by clients</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Total Redeemed</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">{promos.reduce((sum, p) => sum + p.usageCount, 0)} times</div>
          <p className="text-[10px] text-[#8C7E6A] font-medium mt-1">Across all order checkouts</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Max VIP Offer</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">15% OFF</div>
          <p className="text-[10px] text-[#C4A265] font-medium mt-1">Code: MAISONVIP</p>
        </div>
      </div>

      {/* Grid of promotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div 
            key={promo.id} 
            className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-whisper transition-all duration-300 relative flex flex-col justify-between ${
              promo.active ? 'border-[#C4A265]/20' : 'border-gray-200 opacity-70'
            }`}
          >
            {/* Top accent line */}
            <div className={`h-1.5 w-full ${promo.active ? 'bg-[#C4A265]' : 'bg-gray-400'}`} />

            {/* Body */}
            <div className="p-6 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold text-[#8C7E6A] uppercase tracking-wider">Campaign Code</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-bold text-xl text-[#1A1814] tracking-widest">{promo.code}</span>
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className="text-gray-400 hover:text-[#C4A265] transition-colors"
                      title="Copy Code"
                    >
                      <span className="material-symbols-outlined text-base">
                        {copiedCode === promo.code ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  promo.active 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {promo.active ? 'Active' : 'Expired'}
                </span>
              </div>

              {/* Value and Conditions */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C7E6A]">Benefit Value</span>
                  <span className="font-bold text-[#1A1814]">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}% Off` : `$${promo.value} Off`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C7E6A]">Minimum Purchase</span>
                  <span className="font-medium text-[#1A1814]">
                    {promo.minSpend > 0 ? `$${promo.minSpend}` : 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C7E6A]">Expiration Date</span>
                  <span className="font-medium text-[#1A1814] font-mono text-xs">{promo.expiryDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C7E6A]">Usage Counter</span>
                  <span className="font-bold text-[#1A1814]">{promo.usageCount} checkouts</span>
                </div>
              </div>
            </div>

            {/* Actions bottom bar */}
            <div className="border-t border-[#C4A265]/10 px-6 py-4 bg-[#FDFBF7] flex justify-between items-center">
              <button
                onClick={() => handleToggleActive(promo.id)}
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  promo.active 
                    ? 'text-red-500 hover:text-red-700' 
                    : 'text-[#C4A265] hover:text-[#B39154]'
                }`}
              >
                {promo.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="text-gray-400 hover:text-red-500 transition-all flex items-center"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-[#C4A265]/20 shadow-2xl max-w-md w-full p-8 space-y-6 animate-scaleIn"
          >
            <div className="flex justify-between items-center border-b border-[#C4A265]/10 pb-4">
              <h3 className="font-bold text-lg text-[#1A1814] uppercase tracking-wider">Generate Promo Code</h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-[#1A1814]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Campaign Code</label>
                <input
                  type="text"
                  placeholder="e.g. AUTUMN25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] placeholder-[#8C7E6A] text-sm outline-none transition-all uppercase font-mono tracking-widest"
                  required
                />
              </div>

              {/* Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Benefit Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                {/* Value */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Min spend */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Minimum Order Value ($)</label>
                <input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  min={0}
                  className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all"
                />
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Campaign Expiration Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end border-t border-[#C4A265]/10 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-[#C4A265]/30 text-xs font-bold uppercase tracking-wider text-[#1A1814] hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C4A265] hover:bg-[#B39154] text-xs font-bold uppercase tracking-wider text-[#1A1814] rounded-lg transition-colors"
              >
                Seal & Release Code
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
