import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  IdCard,
  Briefcase
} from 'lucide-react';
import { User as UserModel, UserRole } from '../types';
import { DEPARTMENTS, TALUKAS_LIST } from '../data/sampleProjects';
import { registerNewUser } from '../utils/storage';

interface RegisterViewProps {
  onRegisterSuccess: (user: UserModel) => void;
  onGoToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onGoToLogin
}) => {
  const [accountType, setAccountType] = useState<'public' | 'officer'>('public');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Citizen specific
  const [taluka, setTaluka] = useState('Bharuch');
  const [village, setVillage] = useState('');

  // Officer specific
  const [department, setDepartment] = useState(DEPARTMENTS[0].name);
  const [designation, setDesignation] = useState('Assistant Engineer');
  const [employeeId, setEmployeeId] = useState('');

  // Status & Error
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid official or personal email address.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (accountType === 'public' && !village.trim()) {
      setError('Please enter your village or town name.');
      return;
    }

    if (accountType === 'officer' && !employeeId.trim()) {
      setError('Please enter your Department Employee / Officer ID.');
      return;
    }

    setIsSubmitting(true);

    const newUser: UserModel = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: accountType === 'officer' ? 'officer' : 'citizen',
      department: accountType === 'officer' ? department : 'General Public',
      designation: accountType === 'officer' ? designation : `Citizen of ${village}`,
      phone: phone.trim(),
      village: accountType === 'public' ? village.trim() : 'District HQ',
      taluka: taluka,
      employeeId: accountType === 'officer' ? employeeId.trim() : undefined,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const result = registerNewUser(newUser);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMsg(result.message);
    setTimeout(() => {
      onRegisterSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-lg shadow-teal-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">SGDP GUJARAT</span>
            <span className="block text-[11px] text-teal-400 font-medium">Smart Gujarat Development Portal • Bharuch</span>
          </div>
        </div>
        <button
          onClick={onGoToLogin}
          className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Already have an account? Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Registration Form */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gujarat Seva First Innovation Challenge 2026–27</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create Your SGDP Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Register as a public citizen or verified department officer for centralized developmental works access.
            </p>
          </div>

          {/* Account Type Selector: Public vs Officer */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setAccountType('public'); setError(''); }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                accountType === 'public'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Public Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => { setAccountType('officer'); setError(''); }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                accountType === 'officer'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Department Officer</span>
            </button>
          </div>

          {/* Success or Error Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Common Fields: Name, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Moksh Patel"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  {accountType === 'officer' ? 'Official Gov Email *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={accountType === 'officer' ? 'officer@gujarat.gov.in' : 'citizen@example.com'}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Contact & Taluka */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98250 12345"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">District Jurisdiction / Taluka *</label>
                <select
                  value={taluka}
                  onChange={e => setTaluka(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {TALUKAS_LIST.filter(t => t !== 'All Talukas').map(t => (
                    <option key={t} value={t}>{t} (Bharuch District)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Public Citizen Specific: Village */}
            {accountType === 'public' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Your Village / Town / Gram Panchayat *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g. Vagra, Piraman, Suklatirth, Achhod..."
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Officer Specific: Department, Designation, Employee ID */}
            {accountType === 'officer' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Executing Department *</label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.code} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Official Designation *</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      placeholder="e.g. Executive Engineer / Taluka Development Officer"
                      required
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Government Employee / Officer ID *</label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={employeeId}
                      onChange={e => setEmployeeId(e.target.value)}
                      placeholder="e.g. RNB-EE-2041 or GUJ-DDO-892"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Create Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    required
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

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              <span>{isSubmitting ? 'Registering Account...' : `Register as ${accountType === 'officer' ? 'Department Officer' : 'Public Citizen'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login link */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            Already registered on SGDP Bharuch?{' '}
            <button
              onClick={onGoToLogin}
              className="text-teal-400 hover:underline font-bold cursor-pointer ml-1"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center py-2 text-xs text-slate-500 border-t border-slate-900">
        <p>Smart Gujarat Development Portal (SGDP) • District Development Office – Bharuch, Gujarat</p>
      </footer>
    </div>
  );
};
