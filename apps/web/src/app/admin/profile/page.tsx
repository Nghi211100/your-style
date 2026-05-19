'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function AdminProfile() {
  const { user, login } = useUserStore();
  
  // States
  const [name, setName] = useState(user?.name || 'Master Atelier Director');
  const [email, setEmail] = useState(user?.email || 'admin@maison.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    
    setTimeout(() => {
      setSavingProfile(false);
      if (user) {
        // Update user context dynamically
        login({ ...user, name, email }, 'first-admin-token');
      }
      setToastMessage('Administrator credentials successfully recorded.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password fields do not match.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setToastMessage('Security access keys successfully updated.');
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
      <div className="border-b border-[#C4A265]/10 pb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#C4A265]/20 flex items-center justify-center text-[#C4A265] font-bold text-2xl border border-[#C4A265]/30">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1814] uppercase">{name}</h1>
          <p className="text-sm text-[#8C7E6A] mt-1">Administrative Master Account • Active Session</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814] border-b border-[#C4A265]/10 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#C4A265]">manage_accounts</span>
            Atelier Account Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Director Profile Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Secure Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Administrative Role Privileges</label>
              <input
                type="text"
                value="MASTER ATELIER ADMINISTRATOR"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-500 text-sm outline-none cursor-not-allowed uppercase font-mono tracking-wider text-xs"
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-[#1A1814] hover:bg-[#C4A265] text-white font-bold py-2.5 px-6 rounded-lg text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-2"
            >
              {savingProfile ? 'Sealing Profile...' : 'Save Profile'}
            </button>
          </div>
        </form>

        {/* Security Password Card */}
        <form onSubmit={handleUpdatePassword} className="bg-white p-8 rounded-xl border border-[#C4A265]/15 shadow-whisper space-y-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1814] border-b border-[#C4A265]/10 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#C4A265]">key</span>
            Key Passcode Security
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Current Access Key</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">New Administrative Access Key</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong access key..."
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Confirm Access Key</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter access key..."
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-2.5 px-4 text-[#1A1814] text-sm outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-[#1A1814] hover:bg-[#C4A265] text-white font-bold py-2.5 px-6 rounded-lg text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-2"
            >
              {savingPassword ? 'Recoding Keys...' : 'Recode Access Keys'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
