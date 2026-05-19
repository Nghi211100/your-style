'use client';

import React, { useState } from 'react';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '12M'>('30D');

  // Hardcoded premium analytics values with high fidelity representation
  const metrics = {
    revenue: timeRange === '7D' ? 12450.0 : timeRange === '30D' ? 54890.0 : 640230.0,
    orders: timeRange === '7D' ? 34 : timeRange === '30D' ? 148 : 1730,
    conversion: timeRange === '7D' ? 2.45 : timeRange === '30D' ? 2.82 : 2.65,
    sessions: timeRange === '7D' ? 1380 : timeRange === '30D' ? 5240 : 65200,
  };

  // SVG Area Chart points
  const points = {
    '7D': '0,180 50,150 100,120 150,140 200,90 250,70 300,50',
    '30D': '0,180 30,160 60,170 90,140 120,120 150,130 180,90 210,80 240,60 270,40 300,20',
    '12M': '0,180 25,170 50,150 75,155 100,120 125,115 150,90 175,85 200,60 225,50 250,30 275,25 300,10',
  };

  const chartLabels = {
    '7D': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '30D': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    '12M': ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
  };

  const topProducts = [
    { rank: 1, name: 'Silk Trench Blazer', category: 'Outerwear', sales: 42, revenue: 16380, conversion: '4.2%' },
    { rank: 2, name: 'Cashmere Ribbed Knit', category: 'Knitwear', sales: 38, revenue: 12160, conversion: '3.9%' },
    { rank: 3, name: 'Atelier Wide-Leg Trousers', category: 'Trousers', sales: 29, revenue: 8410, conversion: '3.1%' },
    { rank: 4, name: 'Monogram Leather Belt', category: 'Accessories', sales: 22, revenue: 4180, conversion: '2.8%' },
  ];

  return (
    <div className="font-sans max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#C4A265]/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1814] uppercase">Analytics & Intelligence</h1>
          <p className="text-sm text-[#8C7E6A] mt-1">Review haute couture sales performance, conversion channels, customer retention, and brand indicators.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          {(['7D', '30D', '12M'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                timeRange === r
                  ? 'bg-[#1A1814] text-white'
                  : 'bg-white text-[#8C7E6A] border border-[#C4A265]/15 hover:border-[#C4A265]/40'
              }`}
            >
              {r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : '12 Months'}
            </button>
          ))}
          <button
            onClick={() => window.print()}
            className="p-2 border border-[#C4A265]/15 hover:border-[#C4A265]/40 rounded-lg text-gray-500 hover:text-[#1A1814] bg-white transition-colors"
            title="Export Report"
          >
            <span className="material-symbols-outlined text-lg block">print</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Gross Revenue</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">
            ${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">↑ 12.4% from last period</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Total Orders</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">{metrics.orders}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">↑ 8.2% from last period</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Sales Conversion</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">{metrics.conversion}%</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">↑ 0.3% rate growth</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Atelier Visits</span>
          <div className="text-3xl font-bold text-[#1A1814] mt-2">{metrics.sessions.toLocaleString()}</div>
          <div className="text-[10px] text-red-600 font-medium mt-1">↓ 1.5% checkout funnel drop</div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Timeline chart */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814]">Revenue Timeline</h3>
            <span className="text-xs text-[#8C7E6A]">Value in USD ($)</span>
          </div>

          {/* SVG line graph */}
          <div className="relative w-full h-[220px] bg-[#FDFBF7] rounded-lg border border-[#C4A265]/10 p-4">
            <svg 
              viewBox="0 0 300 200" 
              className="w-full h-full" 
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="300" y2="50" stroke="#C4A265" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#C4A265" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />
              <line x1="0" y1="150" x2="300" y2="150" stroke="#C4A265" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />

              {/* Area Under Curve */}
              <polygon
                points={`${points[timeRange]} 300,200 0,200`}
                fill="url(#goldGradient)"
                opacity="0.1"
              />

              {/* Line Curve */}
              <polyline
                fill="none"
                stroke="#C4A265"
                strokeWidth="2.5"
                points={points[timeRange]}
              />

              {/* Gradients definitions */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C4A265" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Labels under SVG */}
          <div className="flex justify-between text-xs text-[#8C7E6A] font-semibold px-2">
            {chartLabels[timeRange].map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814]">Categories Share</h3>

          {/* Simple Donut SVG */}
          <div className="flex justify-center items-center h-[180px]">
            <svg viewBox="0 0 100 100" className="w-40 h-40">
              {/* Outer circle chunks */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1A1814" strokeWidth="15" strokeDasharray="100 150" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#C4A265" strokeWidth="15" strokeDasharray="60 190" strokeDashoffset="-100" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8C7E6A" strokeWidth="15" strokeDasharray="50 200" strokeDashoffset="-160" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E0D5" strokeWidth="15" strokeDasharray="41 209" strokeDashoffset="-210" />
            </svg>
          </div>

          {/* Legends */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1A1814]" />
              <span className="text-[#8C7E6A]">Blazers (40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C4A265]" />
              <span className="text-[#8C7E6A]">Knitwear (24%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8C7E6A]" />
              <span className="text-[#8C7E6A]">Trousers (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E6E0D5]" />
              <span className="text-[#8C7E6A]">Accessories (16%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing products and Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products Table */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814]">Bestselling Masterpieces</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#C4A265]/20 text-[#8C7E6A] font-bold uppercase tracking-wider py-2">
                  <th className="pb-3">Rank & Masterpiece</th>
                  <th className="pb-3">Collection</th>
                  <th className="pb-3">Items Sold</th>
                  <th className="pb-3">Total Value</th>
                  <th className="pb-3 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C4A265]/10">
                {topProducts.map((p) => (
                  <tr key={p.rank} className="hover:bg-[#FDFBF7] transition-all">
                    <td className="py-4 flex items-center gap-3">
                      <span className="font-mono font-bold text-[#C4A265] text-sm">0{p.rank}</span>
                      <span className="font-semibold text-[#1A1814]">{p.name}</span>
                    </td>
                    <td className="py-4 text-[#8C7E6A]">{p.category}</td>
                    <td className="py-4 font-semibold text-[#1A1814]">{p.sales} units</td>
                    <td className="py-4 font-bold text-[#1A1814]">${p.revenue.toLocaleString()}</td>
                    <td className="py-4 text-right text-emerald-600 font-semibold">{p.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Funnel conversion channel */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814]">Client Purchase Funnel</h3>
          <div className="space-y-4">
            {/* Step 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#1A1814]">1. Storefront Visitors</span>
                <span className="text-[#8C7E6A]">5,240 (100%)</span>
              </div>
              <div className="w-full bg-[#E6E0D5]/35 h-3 rounded-full overflow-hidden">
                <div className="bg-[#1A1814] h-full w-[100%]" />
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#1A1814]">2. Viewed Masterpieces</span>
                <span className="text-[#8C7E6A]">3,180 (60.6%)</span>
              </div>
              <div className="w-full bg-[#E6E0D5]/35 h-3 rounded-full overflow-hidden">
                <div className="bg-[#C4A265] h-full w-[60.6%]" />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#1A1814]">3. Added to Lookbook/Cart</span>
                <span className="text-[#8C7E6A]">840 (16.0%)</span>
              </div>
              <div className="w-full bg-[#E6E0D5]/35 h-3 rounded-full overflow-hidden">
                <div className="bg-[#8C7E6A] h-full w-[16%]" />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#1A1814]">4. Checked Out & Settled</span>
                <span className="text-[#8C7E6A]">148 (2.82%)</span>
              </div>
              <div className="w-full bg-[#E6E0D5]/35 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-700 h-full w-[2.82%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
