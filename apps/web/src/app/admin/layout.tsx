'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, login, logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Setup form states
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      const res = await fetch('http://localhost:3001/users/has-admin');
      if (res.ok) {
        const data = await res.json();
        setHasAdmin(data.hasAdmin);
      }
    } catch (err) {
      console.error('Failed to check admin status', err);
    } finally {
      setCheckingAdmin(false);
    }
  }

  async function handleSetupAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!setupName || !setupEmail) {
      setSetupError('Please fill out all fields.');
      return;
    }
    setSetupLoading(true);
    setSetupError('');
    try {
      const res = await fetch('http://localhost:3001/users/create-first-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: setupName,
          email: setupEmail,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to initialize administrator account.');
      }
      const createdUser = await res.json();
      // Log the user in
      login(createdUser, 'first-admin-token');
      setHasAdmin(true);
    } catch (err: any) {
      setSetupError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  }

  if (!mounted || checkingAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C4A265] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasAdmin) {
    return (
      <div className="min-h-screen bg-[#1A1814] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md w-full bg-[#25221C] p-10 rounded-xl shadow-2xl border border-[#C4A265]/20">
          <div className="w-16 h-16 rounded-full bg-[#C4A265]/10 flex items-center justify-center mx-auto mb-6 border border-[#C4A265]/30">
            <span className="material-symbols-outlined text-3xl text-[#C4A265]">app_registration</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#FDFBF7]">ATELIER SYSTEM INITIALIZATION</h1>
          <p className="text-[#8C7E6A] text-sm leading-relaxed mb-8">
            No system administrator detected. As the first visitor to the management portal, you are authorized to establish the master root administrator account.
          </p>

          {setupError && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded text-left">
              {setupError}
            </div>
          )}

          <form onSubmit={handleSetupAdmin} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C4A265] mb-2">
                Administrator Name
              </label>
              <input
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="e.g. Master Atelier Director"
                className="w-full bg-[#1A1814] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-white placeholder-[#8C7E6A] text-sm outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C4A265] mb-2">
                Secure Email Address
              </label>
              <input
                type="email"
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                placeholder="e.g. admin@maison.com"
                className="w-full bg-[#1A1814] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-white placeholder-[#8C7E6A] text-sm outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={setupLoading}
              className="w-full bg-[#C4A265] hover:bg-[#B39154] text-[#1A1814] font-bold py-3.5 px-6 rounded-lg text-sm tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              {setupLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A1814] border-t-transparent rounded-full animate-spin"></div>
                  <span>Initializing Master...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  <span>Initialize Administrator</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-[#8C7E6A] mt-6 leading-relaxed">
            Note: Once initialized, this portal setup is sealed. Subsequent administrative actions will require authorization credentials.
          </p>
        </div>
      </div>
    );
  }

  // Security check: must be logged in and ADMIN
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-12 rounded-xl shadow-whisper border border-[#C4A265]/20">
          <span className="material-symbols-outlined text-6xl text-[#C4A265] mb-6 animate-pulse">lock</span>
          <h1 className="font-sans text-3xl font-bold tracking-tight mb-4 text-[#1A1814]">MAISON SECURE PORTAL</h1>
          <p className="text-[#8C7E6A] font-sans text-sm leading-relaxed mb-8">
            Access to the management suite is restricted to authorized personnel. Please sign in with an administrator account.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/login?redirect=/admin"
              className="bg-[#1A1814] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#C4A265] transition-colors duration-300"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="text-[#1A1814] hover:text-[#C4A265] font-semibold text-sm transition-colors duration-300"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'monitoring' },
    { name: 'Products', path: '/admin/products', icon: 'inventory_2' },
    { name: 'Orders', path: '/admin/orders', icon: 'shopping_bag' },
    { name: 'Customers', path: '/admin/customers', icon: 'group' },
    { name: 'CMS Content', path: '/admin/cms', icon: 'article' },
    { name: 'Promotions', path: '/admin/promotions', icon: 'sell' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'leaderboard' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
    { name: 'Admin Profile', path: '/admin/profile', icon: 'account_circle' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1814] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-[#1A1814] text-white flex-col py-8 border-r border-[#C4A265]/10 z-50">
        <div className="px-8 mb-12">
          <h1 className="font-sans text-2xl font-bold tracking-widest text-[#FDFBF7]">MAISON</h1>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-50 mt-1 text-[#C4A265]">Management Suite</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 py-4 px-8 transition-all ${
                  isActive
                    ? 'text-[#C4A265] border-l-4 border-[#C4A265] bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-sans text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-6 px-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#C4A265]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#C4A265]/20 flex items-center justify-center text-[#C4A265] font-bold">
                {user.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold truncate">{user.name}</h4>
              <p className="text-xs text-[#C4A265] uppercase tracking-wider">ADMINISTRATOR</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">storefront</span>
              View Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-2 text-red-400 hover:text-red-300 transition-colors text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1814] text-white flex items-center justify-between px-6 z-50">
        <h1 className="font-sans text-xl font-bold tracking-widest text-[#FDFBF7]">MAISON</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-[#C4A265] transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#1A1814] text-white z-40 flex flex-col py-8 px-6">
          <nav className="space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all ${
                    isActive ? 'text-[#C4A265] bg-white/5' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="font-sans text-base font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-white/10 pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#C4A265]/20 flex items-center justify-center text-[#C4A265] font-bold">
                  {user.name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold">{user.name}</h4>
                <p className="text-xs text-[#C4A265] uppercase tracking-wider">ADMINISTRATOR</p>
              </div>
            </div>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">storefront</span>
              View Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-2 text-red-400 hover:text-red-300 transition-colors text-sm w-full text-left"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[280px] pt-16 lg:pt-0 min-h-screen flex flex-col">
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
