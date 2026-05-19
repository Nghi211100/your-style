'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Order, OrderStatus } from '@/types';
import { useUserStore } from '@/store/useUserStore';

// Luxury Mock Wishlist Items
const INITIAL_WISHLIST = [
  {
    id: 'wish-1',
    name: 'Cashmere Trench Coat',
    price: 890,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    category: 'OUTERWEAR'
  },
  {
    id: 'wish-2',
    name: 'Minimalist Silk Blouse',
    price: 320,
    image: 'https://images.unsplash.com/photo-1548624149-f7b31668831a?q=80&w=600&auto=format&fit=crop',
    category: 'SHIRTS'
  }
];

// Luxury Mock Addresses
const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'Shipping Address (Default)',
    name: 'Sarah Mitchell',
    street: '842 Luxury Lane, Apt 4B',
    cityStateZip: 'New York, NY 10013',
    country: 'United States',
    phone: '+1 (212) 555-0198'
  },
  {
    id: 'addr-2',
    type: 'Billing Address',
    name: 'Sarah Mitchell',
    street: '72 Wall Street, Floor 18',
    cityStateZip: 'New York, NY 10005',
    country: 'United States',
    phone: '+1 (212) 555-4422'
  }
];

export default function AccountPage() {
  const { user: storeUser, isAuthenticated, logout } = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'settings'>('orders');
  
  // Modals & Forms State
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  
  // Interactive Mock Lists State
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  
  // Bespoke Appointment State
  const [bookingOpen, setBookingOpen] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactor: true,
    darkModeProfile: false
  });

  const [supportMessage, setSupportMessage] = useState<string>('');
  const [supportSent, setSupportSent] = useState<boolean>(false);
  const [invoiceDownloading, setInvoiceDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccountData() {
      if (!isAuthenticated || !storeUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Step 1: Fetch profile from backend
        const userRes = await fetch(`http://localhost:3001/users/email?email=${storeUser.email}`);
        if (!userRes.ok) {
          throw new Error('Failed to load profile');
        }
        const userData: User = await userRes.json();
        setUser(userData);
        setEditName(userData.name || '');
        setEditEmail(userData.email);

        // Step 2: Fetch Orders for the user
        const ordersRes = await fetch(`http://localhost:3001/orders/user/${userData.id}`);
        if (ordersRes.ok) {
          const ordersData: Order[] = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (err: any) {
        console.error('Error loading account:', err);
        setError(err.message || 'Atelier connection offline');
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [isAuthenticated, storeUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSavingProfile(true);
      const res = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (!res.ok) {
        throw new Error('Failed to update profile info');
      }
      const updatedUser: User = await res.json();
      setUser(updatedUser);
      setEditModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Could not update profile information');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: 'bg-green-50/80', text: 'text-green-700', border: 'border-green-100', dot: 'bg-green-600' };
      case 'SHIPPED':
        return { bg: 'bg-blue-50/80', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-600' };
      case 'PENDING':
        return { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-600' };
      default:
        return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', dot: 'bg-neutral-600' };
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingOpen(false);
      setBookingConfirmed(false);
      setBookingDate('');
      setBookingTime('');
    }, 3000);
  };

  const handleDownloadInvoice = (orderId: string) => {
    setInvoiceDownloading(orderId);
    setTimeout(() => {
      setInvoiceDownloading(null);
      alert(`Invoice for order #${orderId.substring(0, 8).toUpperCase()} downloaded successfully as PDF.`);
    }, 1500);
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-2 border-champagne-gold/20 border-t-champagne-gold rounded-full animate-spin"></div>
        <p className="text-[14px] uppercase tracking-widest text-warm-stone font-light">Loading Atelier Profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !storeUser) {
    return (
      <div className="bg-warm-ivory min-h-[70vh] text-[#1c1b1b] flex flex-col justify-center items-center px-6 pt-[140px] pb-24">
        <div className="max-w-[420px] w-full bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/50 shadow-md text-center space-y-6">
          <span className="text-[10px] text-champagne-gold uppercase tracking-[0.25em] font-semibold block">
            SECURE PORTAL
          </span>
          <h2 className="font-serif text-2xl font-bold text-neutral-900 leading-tight">
            Atelier Account
          </h2>
          <p className="text-xs font-light text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
            Please sign in to view your dynamic order status, bespoke scheduling, and favorites.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/login"
              className="w-full bg-neutral-900 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-champagne-gold transition-colors duration-300"
            >
              Sign In to Profile
            </Link>
            <Link
              href="/register"
              className="w-full border border-neutral-950 text-neutral-950 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              Register Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center max-w-md mx-auto text-center px-6">
        <h2 className="text-[24px] font-bold text-deep-espresso mb-4">Atelier Offline</h2>
        <p className="text-warm-stone mb-8">Unable to connect to the backend server. Please verify PostgreSQL, Redis, and NestJS services are running.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-deep-espresso text-warm-ivory uppercase font-sans text-[12px] tracking-widest hover:bg-champagne-gold transition-colors duration-300"
        >
          Try Connection Again
        </button>
      </div>
    );
  }

  return (
    <main className="pt-[140px] pb-section-gap px-6 md:px-16 max-w-[1440px] mx-auto w-full">
      {/* Profile Header */}
      {user && (
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 bg-pure-linen p-8 md:p-10 rounded-2xl shadow-whisper border border-champagne-gold/5">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-cashmere-gray flex items-center justify-center border border-champagne-gold/15 relative">
                <img
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-pure-linen p-2 rounded-full shadow-md border border-champagne-gold/20">
                <svg className="w-4 h-4 text-warm-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1.5">
              <h1 className="text-[32px] font-bold text-deep-espresso leading-none">{user.name || 'Valued Guest'}</h1>
              <p className="text-[14px] text-warm-stone font-light">{user.email}</p>
              <p className="text-[10px] text-champagne-gold uppercase tracking-[0.25em] font-semibold">
                MEMBER SINCE {new Date(user.createdAt).getFullYear()}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex-grow md:flex-grow-0 px-6 py-3 rounded-full border border-deep-espresso hover:bg-deep-espresso hover:text-warm-ivory transition-all duration-300 font-sans text-[10px] font-bold uppercase tracking-widest hover:shadow-sm"
            >
              EDIT PROFILE
            </button>
            <button
              onClick={() => logout()}
              className="px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-red-700 transition-colors font-sans text-[10px] font-bold uppercase tracking-widest"
            >
              LOGOUT
            </button>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Tab contents */}
        <div className="lg:col-span-8">
          {/* Tab Navigation */}
          <nav className="flex gap-8 border-b border-champagne-gold/15 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide pb-0">
            {(['orders', 'wishlist', 'addresses', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${
                  activeTab === tab
                    ? 'border-champagne-gold text-deep-espresso font-semibold'
                    : 'border-transparent text-warm-stone hover:text-deep-espresso'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              {orders.length === 0 ? (
                <div className="bg-pure-linen rounded-2xl p-12 text-center border border-champagne-gold/5 shadow-whisper">
                  <p className="text-warm-stone text-[14px] font-light mb-6">You have no order history yet.</p>
                  <a
                    href="/shop"
                    className="inline-block px-8 py-3.5 bg-deep-espresso text-warm-ivory uppercase text-[11px] font-bold tracking-widest rounded-full hover:bg-champagne-gold transition-colors duration-300"
                  >
                    EXPLORE SHOP
                  </a>
                </div>
              ) : (
                orders.map((order) => {
                  const statusInfo = getStatusStyles(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-pure-linen rounded-2xl p-8 shadow-whisper border border-champagne-gold/5 hover:border-champagne-gold/20 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 border-b border-cashmere-gray pb-6">
                        <div>
                          <span className="font-mono text-[14px] text-deep-espresso font-semibold">
                            #{order.id.substring(0, 10).toUpperCase()}
                          </span>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[11px] text-warm-stone font-light">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-[22px] font-bold text-deep-espresso">${order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Product Thumbnail Grid */}
                      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                        {order.items.map((item) => (
                          <div key={item.id} className="relative w-20 h-24 rounded-lg overflow-hidden border border-champagne-gold/10 bg-cashmere-gray/20 shrink-0">
                            {item.product.images && item.product.images[0] ? (
                              <Image
                                alt={item.product.name}
                                className="object-cover"
                                src={item.product.images[0]}
                                fill
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-xs text-warm-stone">
                                Item
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-8 pt-4">
                        <button
                          onClick={() => setSelectedOrderDetail(order)}
                          className="text-champagne-gold font-sans text-[11px] font-bold uppercase tracking-widest hover:text-deep-espresso transition-colors duration-300 underline underline-offset-4 decoration-1"
                        >
                          VIEW DETAILS
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="text-warm-stone font-sans text-[11px] font-bold uppercase tracking-widest hover:text-deep-espresso transition-colors duration-300"
                        >
                          {invoiceDownloading === order.id ? 'DOWNLOADING...' : 'DOWNLOAD INVOICE'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fade-in">
              {wishlist.length === 0 ? (
                <div className="bg-pure-linen rounded-2xl p-12 text-center border border-champagne-gold/5 shadow-whisper">
                  <p className="text-warm-stone text-[14px] font-light">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-pure-linen p-6 rounded-2xl border border-champagne-gold/5 shadow-whisper flex gap-6 group hover:border-champagne-gold/15 transition-all duration-300 relative"
                    >
                      <button
                        onClick={() => handleRemoveWishlist(item.id)}
                        className="absolute top-4 right-4 text-warm-stone hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="w-24 h-32 relative rounded-lg overflow-hidden bg-cashmere-gray shrink-0 shadow-sm">
                        <Image alt={item.name} className="object-cover" src={item.image} fill />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] text-champagne-gold font-bold uppercase tracking-widest mb-1.5">
                          {item.category}
                        </span>
                        <h4 className="text-[16px] font-bold text-deep-espresso mb-2 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[14px] font-mono text-warm-stone mb-4">${item.price}</p>
                        <a
                          href="/shop"
                          className="text-[11px] font-bold uppercase tracking-widest text-deep-espresso hover:text-champagne-gold transition-colors duration-300"
                        >
                          SHOP NOW
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-pure-linen p-8 rounded-2xl border border-champagne-gold/10 whisper-shadow relative hover:border-champagne-gold/30 transition-all duration-300"
                  >
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-champagne-gold mb-4">
                      {addr.type}
                    </h4>
                    <p className="text-[16px] font-bold text-deep-espresso mb-2">{addr.name}</p>
                    <p className="text-[14px] text-warm-stone font-light mb-1">{addr.street}</p>
                    <p className="text-[14px] text-warm-stone font-light mb-1">{addr.cityStateZip}</p>
                    <p className="text-[14px] text-warm-stone font-light mb-4">{addr.country}</p>
                    <p className="text-[12px] text-deep-espresso font-mono">{addr.phone}</p>
                    <button className="absolute bottom-8 right-8 text-[11px] font-bold uppercase tracking-widest text-warm-stone hover:text-deep-espresso transition-colors">
                      EDIT
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-pure-linen p-8 rounded-2xl border border-champagne-gold/5 shadow-whisper space-y-8 animate-fade-in">
              <div>
                <h3 className="text-[18px] font-bold text-deep-espresso mb-1">Preferences</h3>
                <p className="text-[13px] text-warm-stone font-light">Manage your interaction guidelines with our atelier.</p>
              </div>
              
              <div className="space-y-6 divide-y divide-cashmere-gray">
                <div className="flex justify-between items-center py-4">
                  <div>
                    <label className="text-[14px] font-bold text-deep-espresso uppercase tracking-wider block">Email Notifications</label>
                    <span className="text-[12px] text-warm-stone font-light">Receive invitations to runway collections and digital diaries.</span>
                  </div>
                  <button
                    onClick={() => setSettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.emailNotifications ? 'bg-champagne-gold' : 'bg-cashmere-gray'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-6 pb-4">
                  <div>
                    <label className="text-[14px] font-bold text-deep-espresso uppercase tracking-wider block">SMS Notifications</label>
                    <span className="text-[12px] text-warm-stone font-light">Instant delivery updates on bespoke commissions.</span>
                  </div>
                  <button
                    onClick={() => setSettings((prev) => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.smsNotifications ? 'bg-champagne-gold' : 'bg-cashmere-gray'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${settings.smsNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-6 pb-4">
                  <div>
                    <label className="text-[14px] font-bold text-deep-espresso uppercase tracking-wider block">Two-Factor Authentication</label>
                    <span className="text-[12px] text-warm-stone font-light">Strengthen profile protection with security passkeys.</span>
                  </div>
                  <button
                    onClick={() => setSettings((prev) => ({ ...prev, twoFactor: !prev.twoFactor }))}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.twoFactor ? 'bg-champagne-gold' : 'bg-cashmere-gray'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${settings.twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions & Bespoke Promotion */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Quick Actions */}
          <div className="bg-pure-linen p-8 rounded-2xl border border-champagne-gold/5 shadow-whisper">
            <h3 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-deep-espresso mb-8 border-b border-cashmere-gray pb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-4">
              {/* Support Interactive Action */}
              <div className="rounded-xl border border-champagne-gold/5 bg-cashmere-gray/20 p-4 transition-all">
                <button
                  onClick={() => setSupportSent(false)}
                  className="w-full flex items-center justify-between font-sans text-[11px] font-bold uppercase tracking-widest text-deep-espresso hover:text-champagne-gold transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Contact Support
                  </span>
                </button>
                
                {supportSent ? (
                  <p className="mt-3 text-[11px] text-green-600 font-semibold uppercase tracking-wider animate-fade-in">Message transmitted successfully</p>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask the concierge..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="flex-grow bg-white border border-warm-stone/20 rounded-lg px-3 py-2 text-xs outline-none focus:border-champagne-gold transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (!supportMessage) return;
                        setSupportSent(true);
                        setSupportMessage('');
                      }}
                      className="bg-deep-espresso text-white px-3 py-2 rounded-lg text-xs hover:bg-champagne-gold transition-colors font-bold uppercase"
                    >
                      SEND
                    </button>
                  </div>
                )}
              </div>

              {/* Reorder Quick Action */}
              <button
                onClick={() => alert('Add items from your latest order directly back into cart.')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-cashmere-gray/20 border border-champagne-gold/5 hover:border-champagne-gold/30 hover:text-champagne-gold transition-all duration-300 group"
              >
                <span className="flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-widest">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                  </svg>
                  Quick Reorder
                </span>
                <span className="transform group-hover:translate-x-1 transition-transform text-xs">→</span>
              </button>
            </div>
          </div>

          {/* Bespoke Promotion banner */}
          <div className="bg-deep-espresso p-8 rounded-2xl text-white shadow-whisper relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-champagne-gold/10 via-transparent to-transparent"></div>
            <div className="relative z-10">
              <h4 className="text-[24px] font-bold mb-2 tracking-tight">Bespoke Fitting</h4>
              <p className="text-[13px] opacity-80 mb-6 font-light leading-relaxed">
                Schedule your seasonal consultation with our atelier masters in New York.
              </p>
              <button
                onClick={() => setBookingOpen(true)}
                className="text-white border-b border-champagne-gold pb-1 text-[11px] font-bold uppercase tracking-widest hover:text-champagne-gold transition-colors duration-300"
              >
                BOOK ATELIER APPOINTMENT
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.04] scale-150 rotate-12 text-white">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </div>
        </aside>
      </div>

      {/* --- MODALS --- */}

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-deep-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-pure-linen rounded-3xl p-8 max-w-md w-full shadow-whisper border border-champagne-gold/15 relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-6 right-6 text-warm-stone hover:text-deep-espresso transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6">
              <h3 className="text-[24px] font-bold text-deep-espresso mb-1">Edit Atelier Profile</h3>
              <p className="text-[12px] text-warm-stone font-light">Update your profile parameters.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-deep-espresso uppercase tracking-wider block mb-2">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-cashmere-gray/20 border border-warm-stone/20 focus:border-champagne-gold rounded-full px-5 py-3 text-sm text-deep-espresso outline-none"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-deep-espresso uppercase tracking-wider block mb-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-cashmere-gray/20 border border-warm-stone/20 focus:border-champagne-gold rounded-full px-5 py-3 text-sm text-deep-espresso outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full mt-6 bg-deep-espresso text-white rounded-full py-3.5 text-[11px] font-bold uppercase tracking-widest hover:bg-champagne-gold transition-colors duration-300 disabled:opacity-50"
              >
                {savingProfile ? 'SAVING CHANGES...' : 'SAVE PROFILE PARAMETERS'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-deep-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-pure-linen rounded-3xl p-8 max-w-2xl w-full shadow-whisper border border-champagne-gold/15 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrderDetail(null)}
              className="absolute top-6 right-6 text-warm-stone hover:text-deep-espresso transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-8 border-b border-cashmere-gray pb-6">
              <span className="text-[10px] text-champagne-gold font-bold uppercase tracking-[0.2em] block mb-1">ATELIER RECEIPT</span>
              <h3 className="text-[26px] font-bold text-deep-espresso mb-1">
                Order #{selectedOrderDetail.id.substring(0, 10).toUpperCase()}
              </h3>
              <p className="text-[12px] text-warm-stone font-light">
                Issued on {new Date(selectedOrderDetail.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Order Items Table */}
            <div className="space-y-6 mb-8">
              {selectedOrderDetail.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-20 relative rounded-lg overflow-hidden border border-cashmere-gray bg-cashmere-gray/20 shrink-0">
                    {item.product.images && item.product.images[0] ? (
                      <Image alt={item.product.name} className="object-cover" src={item.product.images[0]} fill />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs">Item</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-[15px] font-bold text-deep-espresso leading-snug">{item.product.name}</h4>
                    <p className="text-[11px] text-warm-stone font-light uppercase tracking-wider mt-0.5">
                      {item.color && `Color: ${item.color}`} {item.size && `• Size: ${item.size}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-mono font-bold text-deep-espresso">${item.price.toFixed(2)}</p>
                    <p className="text-[11px] text-warm-stone font-light">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-cashmere-gray pt-6 space-y-3 font-sans text-sm">
              <div className="flex justify-between text-warm-stone font-light">
                <span>Subtotal</span>
                <span className="font-mono">${selectedOrderDetail.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-warm-stone font-light">
                <span>Atelier Shipping</span>
                <span className="font-mono text-green-600 font-semibold uppercase tracking-wider text-xs">Complimentary</span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-deep-espresso pt-3 border-t border-cashmere-gray">
                <span>Total Amount</span>
                <span className="font-mono">${selectedOrderDetail.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="flex-grow bg-deep-espresso text-white rounded-full py-3.5 text-[11px] font-bold uppercase tracking-widest hover:bg-champagne-gold transition-colors duration-300"
              >
                CLOSE ATELIER RECEIPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bespoke Appointment Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 bg-deep-espresso/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-pure-linen rounded-3xl p-8 max-w-md w-full shadow-whisper border border-champagne-gold/15 relative">
            <button
              onClick={() => setBookingOpen(false)}
              className="absolute top-6 right-6 text-warm-stone hover:text-deep-espresso transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="text-[10px] text-champagne-gold font-bold uppercase tracking-[0.2em] block mb-1">BESPOKE CONCIERGE</span>
              <h3 className="text-[24px] font-bold text-deep-espresso mb-1">Atelier Appointment</h3>
              <p className="text-[12px] text-warm-stone font-light">Schedule a personal seasonal fitting with our masters.</p>
            </div>

            {bookingConfirmed ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-2 animate-scale-up">
                <svg className="w-8 h-8 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-[14px] font-bold uppercase tracking-wider">APPOINTMENT REGISTERED</h4>
                <p className="text-[12px] opacity-80">Our personal valet will email confirmation and logistics shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-deep-espresso uppercase tracking-wider block mb-2">SELECT DATE</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-cashmere-gray/20 border border-warm-stone/20 focus:border-champagne-gold rounded-full px-5 py-3 text-sm text-deep-espresso outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-deep-espresso uppercase tracking-wider block mb-2">SELECT TIME</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-cashmere-gray/20 border border-warm-stone/20 focus:border-champagne-gold rounded-full px-5 py-3 text-sm text-deep-espresso outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-deep-espresso text-white rounded-full py-3.5 text-[11px] font-bold uppercase tracking-widest hover:bg-champagne-gold transition-colors duration-300"
                >
                  REQUEST RESERVATION
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
