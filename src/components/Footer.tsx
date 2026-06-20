import React, { useState } from 'react';
import { MessageSquare, Globe, Share2, Radio, MessageCircle, PhoneCall, ArrowRight, Mail } from 'lucide-react';

interface FooterProps {
  whatsappNumber: string;
  onNavigateTab: (tab: 'home' | 'shop' | 'admin' | 'login') => void;
}

export const Footer: React.FC<FooterProps> = ({ whatsappNumber, onNavigateTab }) => {
  const [email, setEmail] = useState('');
  const cleanNum = whatsappNumber.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanNum}?text=Hi%20DFQ%20team,%20I'd%20like%20to%20know%20more%20about%20your%20premium%20sportswear!`;

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { alert(`Thank you for subscribing to the DFQ movement!`); setEmail(''); }
  };

  return (
    <footer className="bg-black border-t border-neutral-800 text-neutral-400">
      {/* Newsletter Banner */}
      <div className="bg-[var(--gold)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl sm:text-4xl text-black tracking-wider">JOIN THE MOVEMENT</h3>
            <p className="text-black/70 text-sm font-medium mt-1">Get exclusive drops, early access, and motivational content. Don't quit.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full md:w-auto max-w-md">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-4 py-3.5 bg-black/10 border border-black/20 text-black placeholder-black/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/30" />
            </div>
            <button type="submit" className="px-6 py-3.5 bg-black text-[var(--gold)] font-extrabold text-xs tracking-[0.15em] uppercase hover:bg-neutral-900 transition-colors flex items-center gap-2">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-5 md:col-span-1">
            <span className="font-display text-4xl text-white tracking-wider">DFQ</span>
            <p className="text-xs text-neutral-500 leading-relaxed">Don't Fucking Quit. Premium athletic streetwear engineered for the relentless. Built in Ghana, worn by winners worldwide.</p>
            <div className="flex gap-3 pt-2">
              {[Share2, Globe, Radio, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {['Hoodies', 'Tees', 'Joggers', 'Compression', 'Accessories'].map(c => (
                <li key={c}><button onClick={() => onNavigateTab('shop')} className="text-neutral-500 hover:text-white transition-colors">{c}</button></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[['About DFQ', () => onNavigateTab('home')], ['Admin Portal', () => onNavigateTab('admin')], ['Size Guide', () => {}], ['Shipping Info', () => {}], ['Returns', () => {}]].map(([label, fn], i) => (
                <li key={i}><button onClick={fn as any} className="text-neutral-500 hover:text-white transition-colors">{label as string}</button></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-500"><PhoneCall className="w-4 h-4 text-emerald-500" /><span>{whatsappNumber}</span></div>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-[0.1em] uppercase transition-all w-full justify-center">
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} Don't Fucking Quit (DFQ). All rights reserved.</span>
          <div className="flex gap-6 text-neutral-600">
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
