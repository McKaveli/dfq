import React from 'react';
import { Product, SiteConfig } from '../data/store';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';
import { ArrowRight, Star, Zap, Globe, Heart, Shield, Truck, RefreshCw, MessageSquare, Users, Package } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  config: SiteConfig;
  onNavigateShop: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onWhatsAppOrder: (product: Product, size: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ products, config, onNavigateShop, onAddToCart, onWhatsAppOrder, onQuickView }) => {
  const active = products.filter(p => !p.archived);
  const featured = active.filter(p => p.featured && !p.outOfStock).slice(0, 6);
  const display = featured.length >= 4 ? featured : active.slice(0, 6);

  const mindsetQuotes = [
    "DISCIPLINE BEATS MOTIVATION.",
    "WINNERS KEEP GOING WHEN OTHERS STOP.",
    "EXCUSES DON'T BUILD RESULTS.",
    "DON'T FUCKING QUIT.",
    "PAIN IS TEMPORARY. QUITTING LASTS FOREVER.",
    "BE RELENTLESS OR BE FORGOTTEN.",
  ];

  const testimonials = [
    { quote: "The 520gsm hoodie is insane. I've worn luxury brands that don't feel half this heavy. DFQ is the real deal — this is armor, not clothing.", author: "Kwame B.", location: "Kumasi, Ghana", role: "Powerlifter", stars: 5, avatar: config.testimonialAvatar1 },
    { quote: "Ordering via WhatsApp was seamless. The dispatch team helped me pick the perfect size and delivered same day in Accra. Outstanding service.", author: "Grace A.", location: "Accra, Ghana", role: "Fitness Coach", stars: 5, avatar: config.testimonialAvatar2 },
    { quote: "The DFQ ethos pushes me through my toughest sets. Premium fabric, zero shrinkage, bold gold lettering. This brand understands athletes.", author: "Tariq O.", location: "Tema, Ghana", role: "CrossFit Athlete", stars: 5, avatar: config.testimonialAvatar3 },
  ];

  return (
    <div className="space-y-0">
      {/* ═══ HERO ═══ */}
      <Hero headline={config.heroHeadline} subheadline={config.heroSubheadline} image={config.heroImage} onShopClick={onNavigateShop} />

      {/* ═══ MARQUEE TICKER ═══ */}
      <div className="bg-[var(--gold)] py-3 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
          {[...mindsetQuotes, ...mindsetQuotes].map((q, i) => (
            <span key={i} className="font-display text-black text-lg sm:text-xl tracking-wider flex items-center gap-8">
              {q} <span className="text-black/40">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ WHAT IS DFQ? — BRAND STORY ═══ */}
      <section id="brand-story" className="bg-black py-24 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--gold)]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8 animate-fadeUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <span className="inline-flex items-center gap-3 text-[var(--gold)] text-[11px] font-bold tracking-[0.3em] uppercase">
                <span className="w-10 h-px bg-[var(--gold)]" /> The DFQ Movement
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
                More Than <br/>Clothing. <span className="text-[var(--gold)]">A Mindset.</span>
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-xl">
                DFQ was born out of the relentless pursuit of greatness. We don't sell fabric — we sell <strong className="text-white">discipline, consistency, mental toughness, and resilience</strong>. Every stitch carries the weight of a promise: you will not quit.
              </p>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xl">
                From midnight training sessions in Accra to cold mornings in Kumasi, DFQ is the armor worn by those who choose pain over comfort, execution over excuses. This is not fast fashion. This is relentless execution, woven into heavyweight premium fabric.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 text-[var(--gold)] font-extrabold text-lg"><Zap className="w-5 h-5" /> 520gsm Premium</div>
                  <p className="text-xs text-neutral-500 mt-1">Custom-milled heavyweight organic fleece. Built to last decades, not seasons.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[var(--gold)] font-extrabold text-lg"><Globe className="w-5 h-5" /> Ghana Dispatch</div>
                  <p className="text-xs text-neutral-500 mt-1">Express delivery nationwide. Direct WhatsApp coordination for every order.</p>
                </div>
              </div>
              <blockquote className="border-l-2 border-[var(--gold)] pl-6 text-xl sm:text-2xl text-white font-extrabold italic leading-snug mt-4">
                "Don't Fucking Quit — for those who refuse to blend in."
              </blockquote>
            </div>

            <div className="grid grid-cols-5 gap-3 h-[500px]">
              <div className="col-span-2 overflow-hidden">
                <img src={config.brandStoryImage1} alt="DFQ Vibe" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" loading="lazy" />
              </div>
              <div className="col-span-3 overflow-hidden relative">
                <img src={config.brandStoryImage2} alt="DFQ Premium" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-6">
                  <div className="font-display text-5xl text-[var(--gold)]">RELENTLESS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED COLLECTION ═══ */}
      <section className="bg-neutral-950 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-flex items-center gap-3 text-[var(--gold)] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
                <span className="w-10 h-px bg-[var(--gold)]" /> Featured Collection
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Engineered for the Relentless</h2>
            </div>
            <button onClick={onNavigateShop} className="group flex items-center gap-2 text-sm font-bold tracking-[0.15em] uppercase text-[var(--gold)] hover:text-white transition-colors shrink-0">
              View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {display.map(p => (
              <div key={p.id} className="animate-fadeUp" style={{ animationFillMode: 'both' }}>
                <ProductCard product={p} onAddToCart={onAddToCart} onWhatsAppOrder={onWhatsAppOrder} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <button onClick={onNavigateShop} className="group inline-flex items-center gap-3 px-12 py-5 bg-[var(--gold)] text-black font-extrabold text-sm tracking-[0.15em] uppercase hover:bg-white transition-all">
              Explore All {active.length} Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ COLLECTION BANNERS ═══ */}
      <section className="bg-black">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {[{ img: config.collectionBanner1, title: 'Heavyweight Hoodies', sub: '520gsm Premium Warmth' }, { img: config.collectionBanner2, title: 'Combat Compression', sub: 'Performance Under Pressure' }].map((c, i) => (
            <div key={i} onClick={onNavigateShop} className="relative h-[400px] md:h-[550px] overflow-hidden cursor-pointer group">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(0.4)' }} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-8 sm:left-12 z-10 space-y-3">
                <span className="text-[var(--gold)] text-xs font-bold tracking-[0.2em] uppercase">{c.sub}</span>
                <h3 className="font-display text-5xl sm:text-6xl text-white">{c.title.toUpperCase()}</h3>
                <span className="inline-flex items-center gap-2 text-white text-xs font-bold tracking-[0.15em] uppercase group-hover:text-[var(--gold)] transition-colors pt-2">
                  Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DFQ MINDSET — MOTIVATIONAL TYPOGRAPHY ═══ */}
      <section className="bg-black py-24 md:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center space-y-6">
          <span className="text-[var(--gold)] text-xs font-bold tracking-[0.3em] uppercase block">The DFQ Mindset</span>
          <div className="space-y-2">
            {mindsetQuotes.slice(0, 4).map((q, i) => (
              <div key={i} className={`font-display text-4xl sm:text-6xl md:text-7xl tracking-wider ${i % 2 === 0 ? 'text-white' : 'text-neutral-800'} transition-colors hover:text-[var(--gold)] cursor-default`}>
                {q}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF — TESTIMONIALS ═══ */}
      <section id="testimonials" className="bg-neutral-950 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[var(--gold)] text-xs font-bold tracking-[0.3em] uppercase">Verified Reviews</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Trusted by Athletes Nationwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-black border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors hover-lift">
                <div>
                  <div className="flex gap-1 mb-6">{[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-[var(--gold)] fill-current" />)}</div>
                  <p className="text-neutral-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-neutral-800">
                  <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover border border-neutral-700" loading="lazy" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.author}</h4>
                    <span className="text-xs text-neutral-500">{t.role} • <span className="text-[var(--gold)]">{t.location}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Metrics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Package, val: '8,400+', label: 'Orders Fulfilled' },
              { icon: Heart, val: '12,500+', label: 'Happy Customers' },
              { icon: MessageSquare, val: '25,000+', label: 'WhatsApp Inquiries' },
              { icon: Users, val: '35,000+', label: 'Community Members' },
            ].map((m, i) => (
              <div key={i} className="text-center p-6 bg-black border border-neutral-800 hover:border-[var(--gold)]/30 transition-colors">
                <m.icon className="w-6 h-6 text-[var(--gold)] mx-auto mb-3" />
                <div className="font-display text-3xl text-white">{m.val}</div>
                <div className="text-xs text-neutral-500 font-semibold tracking-[0.15em] uppercase mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOOKBOOK / UGC GALLERY ═══ */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[var(--gold)] text-xs font-bold tracking-[0.3em] uppercase">#WearDFQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">The DFQ Community</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[config.galleryImage1, config.galleryImage2, config.galleryImage3, config.galleryImage4].map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden group cursor-pointer relative">
                <img src={img} alt={`DFQ Community ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROMO BANNER ═══ */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden">
        <img src={config.bannerImage} alt="DFQ Collection" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.25)' }} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24 w-full">
          <div className="max-w-2xl space-y-6">
            <span className="px-4 py-1.5 bg-[var(--gold)] text-black font-bold text-xs tracking-[0.15em] uppercase inline-block">Exclusive Drop</span>
            <h3 className="font-display text-5xl sm:text-7xl text-white">NEW SEASON. SAME GRIND.</h3>
            <p className="text-neutral-300 text-base max-w-lg">The latest collection has arrived. Engineered with next-gen athletic fabrics for those who never stop pushing.</p>
            <button onClick={onNavigateShop} className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-extrabold text-sm tracking-[0.15em] uppercase hover:bg-[var(--gold)] transition-all">
              Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ TRUST & CREDIBILITY BADGES ═══ */}
      <section className="bg-black py-20 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Shield, title: 'Secure Ordering', desc: 'End-to-end encrypted WhatsApp checkout' },
            { icon: Truck, title: 'Ghana-Wide Delivery', desc: 'Express dispatch to Accra, Kumasi & beyond' },
            { icon: Star, title: 'Premium Quality', desc: '520gsm heavyweight organic fabrics' },
            { icon: RefreshCw, title: 'Easy Exchanges', desc: 'Hassle-free size exchanges within 7 days' },
          ].map((b, i) => (
            <div key={i} className="space-y-3 p-6">
              <b.icon className="w-8 h-8 text-[var(--gold)] mx-auto" />
              <h4 className="font-bold text-white text-sm">{b.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
