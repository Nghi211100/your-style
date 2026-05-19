'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  orders: { id: string; total: number; status: string }[];
}

export default function AdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/users');
      if (!res.ok) throw new Error('Failed to fetch user directory.');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: 'ADMIN' | 'CUSTOMER') => {
    try {
      setUpdatingUserId(userId);
      const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update user role.');
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you absolutely sure you want to remove this client? All order history will remain linked, but the user profile will be permanently deleted.')) {
      return;
    }
    try {
      setDeletingUserId(userId);
      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove client account.');
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete client account.');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Calculations
  const totalSpent = (user: User) => {
    return user.orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0);
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRole = 
      roleFilter === 'ALL' || 
      user.role === roleFilter;

    return matchSearch && matchRole;
  });

  // Summary Metrics
  const totalCustomersCount = users.filter(u => u.role === 'CUSTOMER').length;
  const totalAdminsCount = users.filter(u => u.role === 'ADMIN').length;
  const vipCustomersCount = users.filter(u => totalSpent(u) >= 1500).length;
  const cumulativeRevenue = users.reduce((sum, u) => sum + totalSpent(u), 0);

  return (
    <div className="font-sans max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#C4A265]/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1814] uppercase">Client Directory</h1>
          <p className="text-sm text-[#8C7E6A] mt-1">Manage luxury shopper profiles, system administrators, and VIP privileges.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper hover:border-[#C4A265]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-[#8C7E6A] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Clientele</span>
            <span className="material-symbols-outlined text-xl text-[#C4A265]">group</span>
          </div>
          <div className="text-2xl font-bold text-[#1A1814]">{totalCustomersCount}</div>
          <div className="text-[10px] text-emerald-600 mt-2 font-medium">Registered customers</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper hover:border-[#C4A265]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-[#8C7E6A] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">VIP Patronage</span>
            <span className="material-symbols-outlined text-xl text-[#C4A265]">stars</span>
          </div>
          <div className="text-2xl font-bold text-[#1A1814]">{vipCustomersCount}</div>
          <div className="text-[10px] text-[#C4A265] mt-2 font-medium">Spent $1,500+ in atelier</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper hover:border-[#C4A265]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-[#8C7E6A] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Cumulative Spend</span>
            <span className="material-symbols-outlined text-xl text-[#C4A265]">payments</span>
          </div>
          <div className="text-2xl font-bold text-[#1A1814]">${cumulativeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-[#8C7E6A] mt-2 font-medium">From all active orders</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-[#C4A265]/15 shadow-whisper hover:border-[#C4A265]/40 transition-all duration-300">
          <div className="flex items-center justify-between text-[#8C7E6A] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Admins & Staff</span>
            <span className="material-symbols-outlined text-xl text-[#C4A265]">shield_person</span>
          </div>
          <div className="text-2xl font-bold text-[#1A1814]">{totalAdminsCount}</div>
          <div className="text-[10px] text-[#8C7E6A] mt-2 font-medium">Root administrative access</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch bg-white p-4 rounded-xl border border-[#C4A265]/10 shadow-sm">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#C4A265]/15 rounded-lg text-sm outline-none focus:border-[#C4A265] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7E6A]">Role Filter:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#FDFBF7] border border-[#C4A265]/15 rounded-lg text-sm text-[#1A1814] focus:border-[#C4A265] outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers Only</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-xl border border-[#C4A265]/15 overflow-hidden shadow-whisper">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-[#C4A265] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-[#8C7E6A]">Accessing atelier directories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-700 max-w-md mx-auto">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-semibold">{error}</p>
            <button onClick={fetchUsers} className="mt-4 text-xs font-bold uppercase tracking-wider text-[#C4A265] hover:underline">
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-[#8C7E6A]">
            <span className="material-symbols-outlined text-4xl mb-2">group_off</span>
            <p className="text-sm font-medium">No matching client files found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#1A1814] text-white border-b border-[#C4A265]/20 text-[10px] uppercase font-bold tracking-widest">
                  <th className="py-4 px-6">Client Info</th>
                  <th className="py-4 px-6">System Access</th>
                  <th className="py-4 px-6">Atelier Purchases</th>
                  <th className="py-4 px-6">Total Spent</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C4A265]/10 text-sm">
                {filteredUsers.map((user) => {
                  const spent = totalSpent(user);
                  const isVIP = spent >= 1500;
                  return (
                    <tr key={user.id} className="hover:bg-[#FDFBF7] transition-all duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#C4A265]/10 flex items-center justify-center text-[#C4A265] font-bold border border-[#C4A265]/25">
                            {user.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1A1814] flex items-center gap-2">
                              {user.name || 'Anonymous Client'}
                              {isVIP && (
                                <span className="inline-flex items-center gap-1 bg-[#C4A265]/10 text-[#C4A265] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#C4A265]/20">
                                  <span className="material-symbols-outlined text-[10px]">stars</span> VIP
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#8C7E6A]">{user.email}</div>
                            <div className="text-[10px] text-[#8C7E6A] mt-1 font-mono">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-[#1A1814] text-[#C4A265] border border-[#C4A265]/30'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <div className="text-[10px] text-[#8C7E6A] mt-1">
                          Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[#1A1814]">{user.orders.length} orders</span>
                        <div className="text-[10px] text-[#8C7E6A] mt-1">
                          Completed orders: {user.orders.filter(o => o.status === 'DELIVERED').length}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#1A1814]">${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRoleToggle(user.id, user.role)}
                            disabled={updatingUserId === user.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded border border-[#C4A265]/20 text-[#C4A265] hover:bg-[#C4A265] hover:text-white transition-all disabled:opacity-50"
                          >
                            {updatingUserId === user.id ? 'Updating...' : `Make ${user.role === 'ADMIN' ? 'Customer' : 'Admin'}`}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingUserId === user.id}
                            className="p-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                            title="Delete Client Profile"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
