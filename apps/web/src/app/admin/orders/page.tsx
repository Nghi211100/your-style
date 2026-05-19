'use client';

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  images: string[];
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Order {
  id: string;
  userId: string;
  user?: User;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API_URL}/orders`);
      if (!res.ok) throw new Error('Failed to retrieve boutique order registrations');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Atelier API offline.');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`${process.env.API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to transition order status');

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C4A265] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-sans text-sm text-[#8C7E6A] tracking-wider uppercase">Retrieving Order registries...</p>
      </div>
    );
  }

  // Group columns
  const columns: { label: string; status: Order['status']; color: string; badge: string }[] = [
    { label: 'Pending', status: 'PENDING', color: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
    { label: 'Paid', status: 'PAID', color: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
    { label: 'Shipped', status: 'SHIPPED', color: 'bg-cyan-500', badge: 'bg-cyan-50 text-cyan-700' },
    { label: 'Delivered', status: 'DELIVERED', color: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  ];

  // Calculated stats
  const activeOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top appBar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-[#1A1814]">Order Logistics</h2>
          <p className="text-[#8C7E6A] font-sans text-sm">Fulfill orders, track payments, and update delivery pipelines.</p>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center gap-4">
          <div className="flex bg-[#F0EDE8] rounded-lg p-1 border border-[#C4A265]/10">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-xs font-semibold uppercase tracking-wider transition-all ${
                viewMode === 'board' ? 'bg-[#1A1814] text-white shadow-sm' : 'text-[#8C7E6A] hover:text-[#1A1814]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-xs font-semibold uppercase tracking-wider transition-all ${
                viewMode === 'table' ? 'bg-[#1A1814] text-white shadow-sm' : 'text-[#8C7E6A] hover:text-[#1A1814]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">table_rows</span>
              Table
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-[#1A1814] hover:bg-[#C4A265] text-white transition-all px-5 py-2.5 rounded-lg shadow-sm font-sans font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Print Registers
          </button>
        </div>
      </div>

      {/* Stats row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper">
          <span className="text-[#8C7E6A] font-sans text-xs uppercase tracking-wider font-semibold block mb-2">Total Boutique Sales</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#1A1814]">${totalRevenue.toLocaleString()}</span>
            <span className="text-[#8C7E6A] text-xs font-semibold font-sans">USD</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper">
          <div className="flex items-center gap-2 mb-2 font-sans">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[#8C7E6A] text-xs uppercase tracking-wider font-semibold">Pending Aquisitions</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-amber-600">{pendingCount}</span>
            <span className="text-gray-400 text-xs font-sans">Awaiting details</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper">
          <div className="flex items-center gap-2 mb-2 font-sans">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-[#8C7E6A] text-xs uppercase tracking-wider font-semibold">In Logistics Transit</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-cyan-600">{shippedCount}</span>
            <span className="text-gray-400 text-xs font-sans">Shipped</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/10 shadow-whisper">
          <span className="text-[#8C7E6A] font-sans text-xs uppercase tracking-wider font-semibold block mb-2">Order Count</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#1A1814]">{orders.length}</span>
            <span className="text-gray-400 text-xs font-sans">Invoices issued</span>
          </div>
        </div>
      </section>

      {/* Kanban Board View */}
      {viewMode === 'board' ? (
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-4 bg-[#F0EDE8]/30 p-4 rounded-xl border border-[#C4A265]/5 min-h-[60vh]">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    <h3 className="font-sans text-xs uppercase tracking-widest text-[#1A1814] font-bold">
                      {col.label}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                    {colOrders.length}
                  </span>
                </div>

                {colOrders.length === 0 ? (
                  <div className="border border-dashed border-[#C4A265]/20 rounded-xl p-8 text-center text-gray-400 text-xs py-12 font-sans">
                    Empty column
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-5 rounded-xl border border-[#C4A265]/10 shadow-whisper group hover:border-[#C4A265]/40 hover:-translate-y-1 transition-all duration-300 relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-[9px] font-bold text-gray-400 uppercase">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        {/* Status Shift selector */}
                        <div className="relative group/shift">
                          <button className="text-gray-400 hover:text-[#1A1814] p-1 rounded hover:bg-gray-100 transition-all flex items-center">
                            <span className="material-symbols-outlined text-sm">swap_horiz</span>
                          </button>
                          <div className="absolute right-0 top-6 bg-[#1A1814] text-white text-[10px] uppercase font-semibold rounded-lg shadow-lg border border-[#C4A265]/20 py-2 w-32 hidden group-hover/shift:block z-[99]">
                            {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => {
                              if (st === order.status) return null;
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(order.id, st as any)}
                                  className="w-full text-left px-4 py-1.5 hover:bg-[#C4A265] hover:text-[#1A1814] transition-colors"
                                >
                                  Shift to {st.toLowerCase()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <h4 className="font-sans text-xs font-bold text-[#1A1814] mb-3">
                        {order.user?.name || 'Guest Customer'}
                      </h4>

                      {/* Items previews */}
                      <div className="flex -space-x-3 mb-4 overflow-hidden py-1">
                        {order.items?.map((item) => (
                          <img
                            key={item.id}
                            alt="Product"
                            src={
                              item.product?.images?.[0] ||
                              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'
                            }
                            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                            title={`${item.product?.name || 'Item'} (x${item.quantity})`}
                          />
                        ))}
                      </div>

                      <div className="flex justify-between items-end border-t border-[#F0EDE8] pt-4 mt-2">
                        <div className="text-[9px] text-gray-400 leading-tight font-sans">
                          {order.items?.length || 0} items
                          <br />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <span className="font-mono text-sm font-bold text-[#C4A265]">
                          ${order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </section>
      ) : (
        /* Tabular List View */
        <section className="bg-white rounded-xl border border-[#C4A265]/10 shadow-whisper overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-[#F0EDE8] text-[10px] text-[#8C7E6A] uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Invoice</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Purchases</th>
                  <th className="py-4 px-6">Total Cost</th>
                  <th className="py-4 px-6">Acquired Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Transition Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8] font-sans text-xs">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8C7E6A]">
                      No orders registered.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FDFBF7] transition-all">
                      <td className="py-4 px-6 font-mono font-medium text-gray-500">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#1A1814] block">
                          {order.user?.name || 'Guest Customer'}
                        </span>
                        <span className="text-[10px] text-gray-400">{order.user?.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[#8C7E6A] font-semibold">{order.items?.length || 0} items</span>
                        <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                          {order.items?.map((item) => item.product?.name).join(', ')}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-[#C4A265]">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                      <td className="py-4 px-6 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#F0EDE8] bg-[#FDFBF7] text-[10px] uppercase font-semibold text-gray-600 focus:outline-none focus:border-[#C4A265] transition-colors font-sans"
                        >
                          {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
