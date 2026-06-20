import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  headline: string;
  subheadline: string;
  image: string;
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ headline, subheadline, image, onShopClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    setLoaded(true);
    const dur = 2000;
    const steps = 60;
    const targets = [12500, 8400, 35000];
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / steps, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount1(Math.floor(targets[0] * ease));
      setCount2(Math.floor(targets[1] * ease));
      setCount3(Math.floor(targets[2] * ease));
      if (frame >= steps) clearInterval(interval);
    }, dur / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={image || 'https://images.pexels.com/photos/17956260/pexels-photo-17956260.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920'}
          alt="DFQ Hero"
          className={`w-full h-full object-cover object-center transition-all duration-[2s] ${loaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
          style={{ filter: 'brightness(0.3) contrast(1.2) saturate(0.8)' }}
        />
        {/* Multi-layer overlays for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        {/* Subtle gold accent light leak */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-32 md:py-40 w-full">
        <div className="max-w-4xl space-y-8">
          {/* Eyebrow */}
          <div className={`transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-flex items-center gap-2 text-[var(--gold)] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase">
              <span className="w-8 h-px bg-[var(--gold)]" />
              The Mindset Brand
            </span>
          </div>

          {/* Main Headline — Display typography */}
          <h1 className={`transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="font-display text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] leading-[0.85] text-white block tracking-wide">
              {headline || "DON'T FUCKING QUIT."}
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`text-base sm:text-xl md:text-2xl text-neutral-400 max-w-2xl font-medium leading-relaxed transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {subheadline || "The mindset that separates winners from everyone else."}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={onShopClick}
              className="group relative px-10 py-4 bg-[var(--gold)] text-black font-extrabold text-sm tracking-[0.15em] uppercase overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(212,160,23,0.3)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Shop Collection
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className="absolute inset-0 flex items-center justify-center gap-3 text-black font-extrabold text-sm tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 z-20">
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <a
              href="#brand-story"
              className="px-10 py-4 border border-white/20 text-white font-bold text-sm tracking-[0.15em] uppercase text-center hover:bg-white/5 hover:border-white/40 transition-all"
            >
              Join The Movement
            </a>
          </div>
        </div>

        {/* Animated Statistics — Social Proof */}
        <div className={`mt-20 md:mt-28 grid grid-cols-3 gap-6 md:gap-12 max-w-3xl transition-all duration-700 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="border-l border-[var(--gold)]/40 pl-4 md:pl-6">
            <div className="font-display text-3xl sm:text-4xl md:text-5xl text-white">{count1.toLocaleString()}+</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 font-semibold tracking-[0.15em] uppercase mt-1">Athletes Inspired</div>
          </div>
          <div className="border-l border-[var(--gold)]/40 pl-4 md:pl-6">
            <div className="font-display text-3xl sm:text-4xl md:text-5xl text-white">{count2.toLocaleString()}+</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 font-semibold tracking-[0.15em] uppercase mt-1">Products Sold</div>
          </div>
          <div className="border-l border-[var(--gold)]/40 pl-4 md:pl-6">
            <div className="font-display text-3xl sm:text-4xl md:text-5xl text-white">{count3.toLocaleString()}+</div>
            <div className="text-[11px] sm:text-xs text-neutral-500 font-semibold tracking-[0.15em] uppercase mt-1">Community Members</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-700 delay-[1.2s] ${loaded ? 'opacity-60' : 'opacity-0'}`}>
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-semibold">Scroll</span>
        <ChevronDown className="w-5 h-5 text-neutral-500 animate-bounce" />
      </div>
    </section>
  );
};
