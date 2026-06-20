import React from 'react';
import { CartItem, formatGHC } from '../data/store';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenWhatsAppCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onOpenWhatsAppCheckout, onNavigateShop }) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const grandTotal = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[var(--gold)]" />
            <h2 className="text-lg font-extrabold text-white tracking-tight uppercase">Cart</h2>
            <span className="px-2 py-0.5 bg-neutral-800 text-[var(--gold)] text-[11px] font-bold">{cart.reduce((t, i) => t + i.quantity, 0)}</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16 space-y-5">
              <div className="w-16 h-16 border border-neutral-800 flex items-center justify-center text-neutral-700"><ShoppingBag className="w-8 h-8" /></div>
              <p className="text-neutral-400 font-bold">Your cart is empty</p>
              <p className="text-neutral-600 text-xs">Gear up with premium athletic streetwear.</p>
              <button onClick={() => { onClose(); onNavigateShop(); }} className="px-8 py-3 bg-[var(--gold)] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all">
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-black border border-neutral-800 hover:border-neutral-700 transition-colors">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-neutral-900 shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
                      <button onClick={() => onRemoveItem(item.id)} className="text-neutral-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">Size: <strong className="text-[var(--gold)]">{item.size}</strong> · {formatGHC(item.price)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-700 bg-neutral-950">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="w-7 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm font-extrabold text-white">{formatGHC(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-800 space-y-4 bg-black">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span className="text-white font-bold">{formatGHC(subtotal)}</span></div>
              <div className="flex justify-between text-neutral-400"><span>Shipping</span><span className="text-white font-bold">{formatGHC(shipping)}</span></div>
              <div className="flex justify-between text-white font-extrabold text-lg pt-2 border-t border-neutral-800"><span>Total</span><span className="text-[var(--gold)]">{formatGHC(grandTotal)}</span></div>
            </div>
            <button onClick={() => { onClose(); onOpenWhatsAppCheckout(); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-all">
              <MessageSquare className="w-5 h-5" /> Checkout via WhatsApp
            </button>
            <button onClick={onClose} className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-white uppercase tracking-widest text-center transition-colors">Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};
