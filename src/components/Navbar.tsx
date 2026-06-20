import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { isAdminLoggedIn, logoutAdmin } from '../data/store';

interface NavbarProps {
  currentTab: 'home' | 'shop' | 'admin' | 'login';
  setCurrentTab: (tab: 'home' | 'shop' | 'admin' | 'login') => void;
  cartCount: number;
  openCart: () => void;
  announcementText: string;
  brandLogoImage: string;
  scrollToAbout?: () => void;
  scrollToContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, cartCount, openCart, announcementText, brandLogoImage, scrollToAbout, scrollToContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loggedIn = isAdminLoggedIn();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const nav = (tab: 'home' | 'shop' | 'admin' | 'login') => { setCurrentTab(tab); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const scrollNav = (type: 'about' | 'contact') => {
    if (currentTab !== 'home') { setCurrentTab('home'); setTimeout(() => { if (type === 'about' && scrollToAbout) scrollToAbout(); if (type === 'contact' && scrollToContact) scrollToContact(); }, 100); }
    else { if (type === 'about' && scrollToAbout) scrollToAbout(); if (type === 'contact' && scrollToContact) scrollToContact(); }
    setMobileMenuOpen(false);
  };
  const handleLogout = (e: React.MouseEvent) => { e.stopPropagation(); logoutAdmin(); setCurrentTab('login'); setMobileMenuOpen(false); };

  const linkClass = (tab: string) => `relative text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors py-1 ${currentTab === tab ? 'text-white' : 'text-neutral-400 hover:text-white'}`;
  const underline = 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--gold)]';

  return (
    <>
      {announcementText && (
        <div className="bg-[var(--gold)] py-2 overflow-hidden select-none relative z-50">
          <div className="text-center text-black font-bold text-[11px] tracking-[0.15em] uppercase px-4">{announcementText}</div>
        </div>
      )}

      <nav className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/60 border-b border-neutral-800/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => nav('home')}>
              {brandLogoImage ? (
                <img src={brandLogoImage} alt="DFQ" className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity" />
              ) : (
                <span className="font-display text-3xl text-white tracking-wider group-hover:text-[var(--gold)] transition-colors">DFQ</span>
              )}
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => nav('home')} className={`${linkClass('home')} ${currentTab === 'home' ? underline : ''}`}>Home</button>
              <button onClick={() => nav('shop')} className={`${linkClass('shop')} ${currentTab === 'shop' ? underline : ''}`}>Shop</button>
              <button onClick={() => scrollNav('about')} className={linkClass('')}>About</button>
              <button onClick={() => scrollNav('contact')} className={linkClass('')}>Reviews</button>
              <button onClick={() => nav('admin')} className={`${linkClass('admin')} flex items-center gap-1.5 ${currentTab === 'admin' ? underline : ''}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" />Admin
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {loggedIn ? (
                <button onClick={handleLogout} className="hidden md:flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-xs font-semibold uppercase tracking-wider">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={() => nav('login')} className="hidden md:flex items-center gap-1 text-neutral-400 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider">
                  <LogIn className="w-3.5 h-3.5" />
                </button>
              )}

              <button onClick={openCart} className="relative p-2.5 text-neutral-300 hover:text-white transition-colors" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[var(--gold)] text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-neutral-300 hover:text-white" aria-label="Menu">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-neutral-800 animate-fadeIn">
            <div className="px-5 py-6 space-y-1">
              {[
                { label: 'Home', action: () => nav('home'), active: currentTab === 'home' },
                { label: 'Shop', action: () => nav('shop'), active: currentTab === 'shop' },
                { label: 'About', action: () => scrollNav('about'), active: false },
                { label: 'Reviews', action: () => scrollNav('contact'), active: false },
                { label: 'Admin', action: () => nav('admin'), active: currentTab === 'admin' },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  className={`w-full text-left py-3.5 px-4 text-base font-semibold tracking-wide transition-colors ${item.active ? 'text-[var(--gold)] bg-neutral-900' : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50'}`}>
                  {item.label}
                </button>
              ))}
              {loggedIn ? (
                <button onClick={handleLogout} className="w-full text-left py-3.5 px-4 text-base font-semibold text-red-400 hover:bg-red-950/30 transition-colors">Logout</button>
              ) : (
                <button onClick={() => nav('login')} className="w-full text-left py-3.5 px-4 text-base font-semibold text-neutral-400 hover:text-white transition-colors">Login</button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
