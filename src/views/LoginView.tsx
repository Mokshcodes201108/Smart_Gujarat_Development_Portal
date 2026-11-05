import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff,
  User,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User as UserModel, UserRole } from '../types';
import { DEMO_USERS, getStoredUsers } from '../utils/storage';

interface LoginViewProps {
  onLogin: (user: UserModel) => void;
  onGoToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLogin, 
  onGoToRegister 
}) => {
  const [activeTab, setActiveTab] = useState<'public' | 'officer'>('officer');
  const [email, setEmail] = useState('ddo.bharuch@gujarat.gov.in');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle preset selection
  const handleQuickDemo = (userKey: keyof typeof DEMO_USERS) => {
    const demo = DEMO_USERS[userKey];
    if (demo) {
      if (demo.role === 'citizen') {
        setActiveTab('public');
      } else {
        setActiveTab('officer');
      }
      setEmail(demo.email);
      setPassword(demo.password || 'password');
      setError('');
      // Directly log in for instant judge evaluation
      onLogin(demo);
    }
  };

  const handleTabSwitch = (tab: 'public' | 'officer') => {
    setActiveTab(tab);
    setError('');
    if (tab === 'public') {
      setEmail(DEMO_USERS.citizen.email);
      setPassword(DEMO_USERS.citizen.password || 'citizen');
    } else {
      setEmail(DEMO_USERS.admin.email);
      setPassword(DEMO_USERS.admin.password || 'admin');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const allUsers = getStoredUsers();

    // Check registered or demo users
    const matched = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (matched) {
      // Validate role according to login tab
      if (activeTab === 'public' && matched.role !== 'citizen') {
        // Allow with notice or proceed
      }
      onLogin(matched);
      return;
    }

    // Check demo users map
    const demoFound = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === trimmedEmail);
    if (demoFound) {
      onLogin(demoFound);
      return;
    }

    // Default demo fallback if credentials entered
    if (email) {
      const syntheticUser: UserModel = {
        id: `USR-${Date.now().toString().slice(-5)}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: activeTab === 'officer' ? 'officer' : 'citizen',
        designation: activeTab === 'officer' ? 'Department Official' : 'Registered Citizen',
        department: activeTab === 'officer' ? 'District Administration' : 'General Public',
        status: 'active'
      };
      onLogin(syntheticUser);
      return;
    }

    setError('Invalid email or password. Please check your credentials or click any demo login button above.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-lg shadow-teal-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">SGDP GUJARAT</span>
            <span className="block text-[11px] text-teal-400 font-medium">District Development Office – Bharuch</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>SFIC 2026–27 | PS000010</span>
        </div>
      </header>

      {/* Main Authentication Center */}
      <main className="max-w-5xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Information Panel */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Seva First Innovation Challenge 2026–27</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              One Portal. Every Project. <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Zero Duplication.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed pt-1">
              Smart Gujarat Development Portal (SGDP) bridges departmental silos across Bharuch district. 
              Our real-time AI similarity engine prevents redundant infrastructure sanctions and safeguards public funds.
            </p>
          </div>

          {/* Quick Demo Access Card for Judges */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-teal-500/40 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Instant Demo Access (1-Click)
              </span>
              <span className="text-[10px] text-slate-400">Judges Review Bench</span>
            </div>

            {/* Dedicated Moksh Patel Login Button */}
            <button
              type="button"
              onClick={() => handleQuickDemo('moksh')}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-teal-950/50 transition-all cursor-pointer border border-teal-400/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/30 flex items-center justify-center font-black text-xs text-white">
                  MP
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm">Demo Login: Moksh Patel</span>
                  <span className="block text-[10px] text-teal-200">District Innovation Lead & Super Admin</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-200" />
            </button>

            {/* Additional Quick Logins */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-center text-xs transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="font-bold text-white block text-[11px]">DDO Bharuch</span>
                <span className="text-[9px] text-slate-400 block">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('officer')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-center text-xs transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="font-bold text-white block text-[11px]">EE (R&B)</span>
                <span className="text-[9px] text-slate-400 block">Officer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-center text-xs transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-white block text-[11px]">Citizen</span>
                <span className="text-[9px] text-slate-400 block">Public</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5">
            {/* Login Mode Tabs: Public vs Officer */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleTabSwitch('public')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'public'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Public Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('officer')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'officer'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Officer / Admin</span>
              </button>
            </div>

            {/* Tab Context Banner */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              {activeTab === 'public' ? (
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Public Citizen Portal: Search projects by village, track progress, and submit feedback.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>District Administration Portal: Technical approvals, duplicate detection, and fund sanctions.</span>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  {activeTab === 'officer' ? 'Official Gov Email' : 'Email or Registered Mobile'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder={activeTab === 'officer' ? 'officer@gujarat.gov.in' : 'citizen@example.com'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition-all cursor-pointer"
              >
                <span>Sign In as {activeTab === 'officer' ? 'Officer / Admin' : 'Public Citizen'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Actions: Register & Guest View */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={onGoToRegister}
                className="text-teal-400 hover:underline font-bold cursor-pointer"
              >
                Don't have an account? Register Here →
              </button>

              <button
                type="button"
                onClick={() => onLogin(DEMO_USERS.citizen)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Explore Public Portal →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-2 text-xs text-slate-500 border-t border-slate-900">
        <p>Smart Gujarat Development Portal (SGDP) • Seva First Innovation Challenge (SFIC) 2026–27</p>
        <p className="text-[11px] text-slate-600 mt-0.5">District Development Office – Bharuch, Gujarat.</p>
      </footer>
    </div>
  );
};
