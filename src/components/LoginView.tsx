import React, { useState } from 'react';
import { loginAdmin } from '../data/store';
import { Lock, User, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginAdmin(username, password)) {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#050505] relative overflow-hidden">
      {/* Dynamic background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-md w-full bg-[#111111] border border-zinc-800 p-8 rounded-lg shadow-2xl space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#FFD700] text-black font-black text-2xl flex items-center justify-center rounded-sm mx-auto shadow-xl shadow-[#FFD700]/20 transform -skew-x-12">
            DFQ
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight font-['Syne'] mt-4">
            Admin Security Gateway
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            Secure Authentication Required
          </div>
          <p className="text-xs text-zinc-400 font-medium tracking-wide">
            Log in to access the dedicated admin portal (`admin.html`) to manage products, execute direct device image uploads, update Ghana Cedi pricing (`GH₵`), and configure WhatsApp routing.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-950/80 border border-red-600 rounded text-red-400 text-xs font-bold animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-950/80 border border-emerald-500 rounded text-emerald-400 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Authentication complete. Initializing Admin Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
              Admin Username *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
              Admin Gateway Password *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#FFD700] text-black font-black text-sm tracking-widest uppercase rounded flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#FFD700]/20 active:translate-y-0.5"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </form>

        <div className="pt-6 border-t border-zinc-800 text-center space-y-2">
          <p className="text-[11px] text-zinc-500">
            Secure Session Management enabled. Unauthenticated visitors are automatically redirected here (`login.html`).
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs font-extrabold text-zinc-400 hover:text-[#FFD700] uppercase tracking-widest transition-colors underline"
          >
            ← Return to Public Storefront (`index.html`)
          </button>
        </div>
      </div>
    </div>
  );
};
