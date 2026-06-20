import React, { useState, useEffect } from 'react';
import { Product, formatGHC } from '../data/store';
import { X, ShoppingBag, MessageSquare, ShieldCheck, Truck, RefreshCw, Plus, Minus, ZoomIn } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onWhatsAppOrder: (product: Product, size: string, quantity: number) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose, onAddToCart, onWhatsAppOrder }) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  useEffect(() => { setActiveIdx(0); setSelectedSize(product.sizes[0] || 'M'); setQuantity(1); setZoomed(false); }, [product]);

  const handleAdd = () => { if (product.outOfStock) return; onAddToCart(product, selectedSize, quantity); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  const handleWA = () => { if (product.outOfStock) return; onWhatsAppOrder(product, selectedSize, quantity); onClose(); };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="relative bg-neutral-950 border border-neutral-800 max-w-5xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/70 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"><X className="w-5 h-5" /></button>

        {/* Image */}
        <div className="md:w-1/2 bg-black flex flex-col">
          <div className={`relative flex-1 overflow-hidden cursor-zoom-in min-h-[350px] ${zoomed ? 'cursor-zoom-out' : ''}`} onClick={() => setZoomed(!zoomed)}>
            <img src={gallery[activeIdx] || product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`} />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.outOfStock && <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase">Sold Out</span>}
              {product.newArrival && !product.outOfStock && <span className="px-3 py-1 bg-[var(--gold)] text-black text-[10px] font-bold tracking-widest uppercase">New</span>}
            </div>
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-black/50 flex items-center justify-center text-white/60"><ZoomIn className="w-4 h-4" /></div>
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-1 p-3 bg-black overflow-x-auto">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveIdx(i)} className={`w-16 h-16 shrink-0 overflow-hidden border-2 transition-all ${activeIdx === i ? 'border-[var(--gold)]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-2 block">{product.category}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pr-10">{product.name}</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-extrabold text-white">{formatGHC(product.price)}</span>
              <span className="text-xs text-neutral-500">Tax included • Ghana Express Dispatch</span>
            </div>
            <p className="mt-6 text-sm text-neutral-400 leading-relaxed border-t border-neutral-800 pt-6">{product.description}</p>

            {/* Size */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-300">Size: <span className="text-[var(--gold)]">{selectedSize}</span></span>
                <span className="text-[11px] text-neutral-500 underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[44px] h-11 px-3 text-xs font-bold border transition-all ${selectedSize === s ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-300">Quantity</span>
              <div className="flex items-center border border-neutral-700 bg-black">
                <button onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }} className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                <button onClick={() => { if (quantity < 20) setQuantity(quantity + 1); }} className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 bg-neutral-900 p-4 border border-neutral-800 text-center">
              {[{ icon: ShieldCheck, label: 'Authentic' }, { icon: Truck, label: 'Fast Delivery' }, { icon: RefreshCw, label: 'Easy Exchange' }].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <b.icon className="w-4 h-4 text-[var(--gold)]" />
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button disabled={product.outOfStock} onClick={handleAdd} className={`w-full py-4 text-sm font-extrabold tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all ${product.outOfStock ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' : added ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-[var(--gold)]'}`}>
              <ShoppingBag className="w-5 h-5" />{product.outOfStock ? 'Sold Out' : added ? 'Added to Cart ✓' : `Add ${quantity} to Cart`}
            </button>
            <button disabled={product.outOfStock} onClick={handleWA} className={`w-full py-4 text-sm font-extrabold tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all ${product.outOfStock ? 'bg-neutral-900 text-neutral-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
              <MessageSquare className="w-5 h-5" />{product.outOfStock ? 'Unavailable' : 'Order on WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
