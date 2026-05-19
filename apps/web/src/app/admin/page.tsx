'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Order {
  id: string;
  userId: string;
  user: User;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:3001/orders'),
          fetch('http://localhost:3001/products'),
        ]);

        if (!ordersRes.ok || !productsRes.ok) {
          throw new Error('Failed to fetch data from Atelier Server');
        }

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        setOrders(ordersData);
        setProducts(productsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Atelier API offline. Make sure NestJS is running on port 3001.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C4A265] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-sans text-sm text-[#8C7E6A] tracking-wider uppercase">Loading Atelier Deck...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <h3 className="font-sans font-bold text-lg">System Connection Failure</h3>
        </div>
        <p className="font-sans text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#1A1814] text-white font-sans text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-[#C4A265] transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Calculate Metrics
  const activeOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-12">
      {/* Top Header */}
      <div>
        <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#1A1814]">Atelier Command Deck</h2>
        <p className="text-[#8C7E6A] font-sans text-sm">Real-time metrics, system statuses, and boutique activities.</p>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper hover:border-[#C4A265]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#8C7E6A] font-sans text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
            <span className="material-symbols-outlined text-[#C4A265] bg-[#C4A265]/10 p-2 rounded-lg">payments</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold tracking-tight text-[#1A1814]">{formattedRevenue}</span>
            <span className="text-green-600 text-xs font-semibold font-sans flex items-center bg-green-50 px-2 py-0.5 rounded">
              Active Sales
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper hover:border-[#C4A265]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#8C7E6A] font-sans text-xs uppercase tracking-wider font-semibold">Total Orders</span>
            <span className="material-symbols-outlined text-[#C4A265] bg-[#C4A265]/10 p-2 rounded-lg">shopping_bag</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold tracking-tight text-[#1A1814]">{totalOrders}</span>
            <span className="text-amber-600 text-xs font-semibold font-sans flex items-center bg-amber-50 px-2 py-0.5 rounded">
              {pendingOrdersCount} Pending
            </span>
          </div>
        </div>

        {/* Catalog Size */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper hover:border-[#C4A265]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#8C7E6A] font-sans text-xs uppercase tracking-wider font-semibold">Catalog Size</span>
            <span className="material-symbols-outlined text-[#C4A265] bg-[#C4A265]/10 p-2 rounded-lg">inventory_2</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold tracking-tight text-[#1A1814]">{products.length}</span>
            <span className="text-[#8C7E6A] text-xs font-semibold font-sans">Products live</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper hover:border-[#C4A265]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#8C7E6A] font-sans text-xs uppercase tracking-wider font-semibold">Low Stock Alerts</span>
            <span className="material-symbols-outlined text-red-500 bg-red-50 p-2 rounded-lg">warning</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`font-mono text-3xl font-bold tracking-tight ${lowStockProducts.length > 0 ? 'text-red-600 animate-pulse' : 'text-[#1A1814]'}`}>
              {lowStockProducts.length}
            </span>
            <span className={`text-xs font-semibold font-sans px-2 py-0.5 rounded ${lowStockProducts.length > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {lowStockProducts.length > 0 ? 'Action Needed' : 'Inventory stable'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Performance Chart & Low Stock */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Performance Area Chart */}
        <div className="bg-white p-8 rounded-xl border border-[#C4A265]/10 shadow-whisper lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-sans text-lg font-bold text-[#1A1814]">Revenue Streams</h3>
              <p className="text-xs text-[#8C7E6A]">Visual distribution of boutique revenue over time.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-[#8C7E6A]">
              <span className="w-2 h-2 bg-[#C4A265] rounded-full"></span>
              Gross Sales (Daily)
            </div>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="relative h-64 w-full flex flex-col justify-between">
            {/* SVG Plot */}
            <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C4A265" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C4A265" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Backgrid */}
              <line x1="0" y1="25" x2="500" y2="25" stroke="#F0EDE8" strokeDasharray="3,3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F0EDE8" strokeDasharray="3,3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#F0EDE8" strokeDasharray="3,3" />
              {/* Spline Area */}
              <path
                d="M 0,90 Q 75,50 150,75 T 300,30 T 450,45 L 500,20 L 500,100 L 0,100 Z"
                fill="url(#chartGrad)"
              />
              {/* Spline Outline */}
              <path
                d="M 0,90 Q 75,50 150,75 T 300,30 T 450,45 L 500,20"
                fill="none"
                stroke="#C4A265"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Plot points */}
              <circle cx="150" cy="75" r="4" fill="#1A1814" stroke="#C4A265" strokeWidth="1.5" />
              <circle cx="300" cy="30" r="4" fill="#1A1814" stroke="#C4A265" strokeWidth="1.5" />
              <circle cx="500" cy="20" r="4" fill="#1A1814" stroke="#C4A265" strokeWidth="1.5" />
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between border-t border-[#F0EDE8] pt-3 text-[10px] font-mono text-[#8C7E6A] uppercase">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Column */}
        <div className="bg-white p-8 rounded-xl border border-[#C4A265]/10 shadow-whisper flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-sans text-lg font-bold text-[#1A1814]">Low Inventory</h3>
              <p className="text-xs text-[#8C7E6A]">Action required to replenish stock.</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#C4A265] hover:text-[#1A1814] transition-colors uppercase tracking-wider font-sans"
            >
              Catalog
            </Link>
          </div>

          <div className="flex-1 space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar">
            {lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#8C7E6A] py-8">
                <span className="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                <p className="text-xs">All inventories are fully provisioned.</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#C4A265]/10 rounded-lg hover:border-[#C4A265]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md border border-[#F0EDE8]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1814] truncate max-w-[120px]">{product.name}</h4>
                      <p className="text-[10px] text-[#8C7E6A] uppercase tracking-wider">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-red-600 block">{product.stock} left</span>
                    <span className="text-[10px] text-[#8C7E6A] uppercase">restock now</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Orders Section */}
      <section className="bg-white p-8 rounded-xl border border-[#C4A265]/10 shadow-whisper">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-sans text-lg font-bold text-[#1A1814]">Boutique Order Register</h3>
            <p className="text-xs text-[#8C7E6A]">Listing of the most recent acquisitions made by customers.</p>
          </div>
          <Link
            href="/admin/orders"
            className="bg-[#1A1814] text-[#FDFBF7] hover:bg-[#C4A265] py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
          >
            Manage Board
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F0EDE8] text-[10px] text-[#8C7E6A] uppercase tracking-wider font-semibold">
                <th className="py-4">Order ID</th>
                <th className="py-4">Customer</th>
                <th className="py-4">Purchased Items</th>
                <th className="py-4">Total Amount</th>
                <th className="py-4">Aquisition Date</th>
                <th className="py-4 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8] font-sans text-xs">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8C7E6A]">
                    No orders have been recorded in the boutique yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFBF7] transition-all">
                    <td className="py-4 font-mono font-medium text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="py-4 font-semibold text-[#1A1814]">
                      {order.user?.name || 'Guest Customer'}
                      <span className="block text-[10px] text-gray-400 font-normal">{order.user?.email}</span>
                    </td>
                    <td className="py-4 text-[#8C7E6A]">
                      {order.items?.length || 0} items
                      <span className="block text-[10px] truncate max-w-[180px]">
                        {order.items?.map((item) => item.product?.name).join(', ') || 'Various apparel'}
                      </span>
                    </td>
                    <td className="py-4 font-mono font-bold text-[#C4A265]">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="py-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-block font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-50 text-green-700'
                          : order.status === 'SHIPPED'
                          ? 'bg-cyan-50 text-cyan-700'
                          : order.status === 'PAID'
                          ? 'bg-blue-50 text-blue-700'
                          : order.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
