import React, { useState, useMemo } from 'react';
import { Product, SiteConfig, formatGHC } from '../data/store';
import { ProductCard } from './ProductCard';
import { Search, Filter, RefreshCw, X } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  config: SiteConfig;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onWhatsAppOrder: (product: Product, size: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ products, config, onAddToCart, onWhatsAppOrder, onQuickView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [selectedSize, setSelectedSize] = useState<string>('All');

  const categories = ['All', 'Hoodies', 'Tees', 'Joggers', 'Accessories', 'Compression'];
  const sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const activeProducts = useMemo(() => products.filter(p => !p.archived), [products]);
  const filteredProducts = useMemo(() => {
    return activeProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = p.price <= maxPrice;
      const matchSize = selectedSize === 'All' || p.sizes.includes(selectedSize);
      return matchSearch && matchCat && matchPrice && matchSize;
    });
  }, [activeProducts, searchQuery, selectedCategory, maxPrice, selectedSize]);

  const resetFilters = () => { setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(600); setSelectedSize('All'); };

  const catImages: Record<string, string> = {
    Hoodies: config.categoryHoodiesImg, Tees: config.categoryTeesImg, Joggers: config.categoryJoggersImg,
    Accessories: config.categoryAccessoriesImg, Compression: config.categoryCompressionImg
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 animate-fadeIn space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[var(--gold)] text-xs font-bold tracking-[0.3em] uppercase">Full Catalog</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">Shop DFQ</h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">Premium athletic streetwear engineered for the relentless. Every piece tells a story of discipline and resilience.</p>
      </div>

      {/* Category Visual Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {categories.filter(c => c !== 'All').map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
            className={`relative h-24 sm:h-32 overflow-hidden group transition-all ${selectedCategory === cat ? 'ring-2 ring-[var(--gold)]' : 'opacity-70 hover:opacity-100'}`}>
            <img src={catImages[cat] || ''} alt={cat} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'brightness(0.4)' }} loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm tracking-[0.15em] uppercase">{cat}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-neutral-950 border border-neutral-800 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase"><Filter className="w-4 h-4 text-[var(--gold)]" /> Filters</div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500">{filteredProducts.length} of {activeProducts.length} products</span>
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-[var(--gold)] transition-colors font-semibold uppercase tracking-wider"><RefreshCw className="w-3 h-3" /> Reset</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-black border border-neutral-700 text-white text-xs focus:outline-none focus:border-[var(--gold)]" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase border transition-all ${selectedCategory === c ? 'bg-[var(--gold)] text-black border-[var(--gold)]' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}>{c}</button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} className={`px-2.5 py-1.5 text-[11px] font-bold tracking-wider uppercase border transition-all ${selectedSize === s ? 'bg-[var(--gold)] text-black border-[var(--gold)]' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}>{s}</button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <span>Max Price</span><span className="text-[var(--gold)]">{formatGHC(maxPrice)}</span>
            </div>
            <input type="range" min={150} max={600} step={20} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--gold)] h-1.5 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="text-neutral-400 text-lg font-bold">No products match your filters.</p>
          <button onClick={resetFilters} className="px-8 py-3 bg-[var(--gold)] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onWhatsAppOrder={onWhatsAppOrder} onQuickView={onQuickView} />)}
        </div>
      )}
    </div>
  );
};
