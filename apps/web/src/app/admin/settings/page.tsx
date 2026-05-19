'use client';

import React, { useState } from 'react';

export default function AdminSettings() {
  const [shopName, setShopName] = useState('MAISON YOUR STYLE');
  const [conciergeEmail, setConciergeEmail] = useState('concierge@maison.com');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(8);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500);
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  
  // Notification states
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToastMessage('Atelier system preferences successfully sealed.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="font-sans max-w-4xl mx-auto space-y-8 animate-fadeIn relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#1A1814] text-[#C4A265] border border-[#C4A265]/35 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slideIn">
          <span className="material-symbols-outlined text-xl text-[#C4A265]">verified</span>
          <span className="text-sm font-semibold tracking-wide uppercase">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#C4A265]/10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1814] uppercase">Atelier Settings</h1>
        <p className="text-sm text-[#8C7E6A] mt-1">Govern storefront policies, transaction currencies, tax rules, concierge routing, and gateways.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Brand Profile */}
        <div className="bg-white p-8 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814] border-b border-[#C4A265]/10 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#C4A265]">storefront</span>
            Boutique Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">House Brand Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Concierge Routing Email</label>
              <input
                type="email"
                value={conciergeEmail}
                onChange={(e) => setConciergeEmail(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Monetary & Taxation */}
        <div className="bg-white p-8 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814] border-b border-[#C4A265]/10 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#C4A265]">payments</span>
            Monetary & Taxation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Base Settlement Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm font-semibold outline-none transition-all"
              >
                <option value="USD">USD ($) — American Dollar</option>
                <option value="EUR">EUR (€) — Euro Dollar</option>
                <option value="VND">VND (₫) — Vietnamese Dong</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">VAT / Sales Tax rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min={0}
                max={50}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm font-semibold outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Complimentary VIP Shipping ($)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                min={0}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm font-semibold outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Transaction Gateways */}
        <div className="bg-white p-8 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814] border-b border-[#C4A265]/10 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#C4A265]">credit_card</span>
            Active Settlement Channels
          </h3>
          <div className="space-y-4">
            {/* Stripe */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#FDFBF7] border border-[#C4A265]/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-indigo-600">account_balance</span>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1814]">Secure Credit/Debit settlements (Stripe API)</h4>
                  <p className="text-xs text-[#8C7E6A]">Support Visa, MasterCard, Apple Pay, and secure dynamic bank wires.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={stripeEnabled}
                onChange={(e) => setStripeEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-[#C4A265]/30 accent-[#C4A265] cursor-pointer"
              />
            </div>

            {/* COD */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#FDFBF7] border border-[#C4A265]/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-[#C4A265]">local_shipping</span>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1814]">Cash on Atelier Delivery (COD)</h4>
                  <p className="text-xs text-[#8C7E6A]">Permit cash payment to local couture courier upon handoff.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-[#C4A265]/30 accent-[#C4A265] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save actions */}
        <div className="flex justify-end pt-4 border-t border-[#C4A265]/10">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1A1814] hover:bg-[#C4A265] text-white font-bold py-3.5 px-10 rounded-lg text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sealing Preferances...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>Seal Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
