import React, { useState } from 'react';
import { Product, formatGHC } from '../data/store';
import { ShoppingBag, MessageSquare, Eye, Plus, Minus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onWhatsAppOrder: (product: Product, size: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onWhatsAppOrder,
  onQuickView
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hasMultipleImages = product.images && product.images.length > 1;
  const displayImage = hovered && hasMultipleImages ? product.images[1] : product.image;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.outOfStock) return;
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.outOfStock) return;
    onWhatsAppOrder(product, selectedSize, quantity);
  };

  return (
    <div
      className="group flex flex-col bg-neutral-950 border border-neutral-900 hover:border-neutral-700 transition-all duration-500 hover-lift overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] bg-neutral-900 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="px-6 py-2.5 bg-white text-black font-bold text-xs tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 hover:bg-[var(--gold)]"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            wishlisted ? 'bg-[var(--gold)] text-black scale-110' : 'bg-black/60 text-white/60 hover:text-white hover:bg-black/80 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.outOfStock && (
            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-[0.15em] uppercase">Sold Out</span>
          )}
          {product.newArrival && !product.outOfStock && (
            <span className="px-3 py-1 bg-[var(--gold)] text-black text-[10px] font-bold tracking-[0.15em] uppercase">New</span>
          )}
          {product.featured && !product.newArrival && !product.outOfStock && (
            <span className="px-3 py-1 bg-white text-black text-[10px] font-bold tracking-[0.15em] uppercase">Featured</span>
          )}
        </div>

        {/* Size preview strip on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex gap-1.5 justify-center">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                className={`w-9 h-9 text-[10px] font-bold flex items-center justify-center border transition-all ${
                  selectedSize === size
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/70 border-white/20 hover:border-white/60'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between" onClick={(e) => e.stopPropagation()}>
        <div>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 block mb-1.5">{product.category}</span>
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-white text-sm leading-tight cursor-pointer hover:text-[var(--gold)] transition-colors line-clamp-2"
          >
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-lg font-extrabold text-white">{formatGHC(product.price)}</span>
          </div>
        </div>

        {/* Quantity + Actions */}
        <div className="mt-5 space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">Qty</span>
            <div className="flex items-center border border-neutral-800 bg-black">
              <button onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(quantity - 1); }} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); if (quantity < 20) setQuantity(quantity + 1); }} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            disabled={product.outOfStock}
            onClick={handleAddClick}
            className={`w-full py-3 text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all ${
              product.outOfStock
                ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                : addedAnimation
                ? 'bg-green-600 text-white'
                : 'bg-white text-black hover:bg-[var(--gold)]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {product.outOfStock ? 'Sold Out' : addedAnimation ? 'Added ✓' : 'Add to Cart'}
          </button>

          <button
            disabled={product.outOfStock}
            onClick={handleWhatsAppClick}
            className={`w-full py-3 text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all ${
              product.outOfStock
                ? 'bg-neutral-900/50 text-neutral-700 cursor-not-allowed border border-neutral-900'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {product.outOfStock ? 'Unavailable' : 'Order on WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
};
