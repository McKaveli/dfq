import React, { useState } from 'react';
import { CartItem, Product, formatGHC } from '../data/store';
import { X, MessageSquare, User, Phone, CheckCircle } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  cart: CartItem[];
  singleOrderProduct?: { product: Product; size: string; quantity: number } | null;
  onClearCart: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
  cart,
  singleOrderProduct,
  onClearCart
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const isSingleOrder = !!singleOrderProduct;
  
  // Calculate totals and items list
  let itemsSummary = '';
  let subtotal = 0;
  const shipping = 50; // Flat GH₵50 shipping in Ghana

  if (isSingleOrder && singleOrderProduct) {
    const { product, size, quantity } = singleOrderProduct;
    subtotal = product.price * quantity;
    itemsSummary = `• Product Name: ${product.name}\n• Price: ${formatGHC(product.price)} each\n• Selected Size: ${size}\n• Quantity: ${quantity}\n• Item Total: ${formatGHC(subtotal)}`;
  } else {
    subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    itemsSummary = cart.map(item => `• Product Name: ${item.name}\n• Price: ${formatGHC(item.price)} each\n• Selected Size: ${item.size}\n• Quantity: ${item.quantity}\n• Item Total: ${formatGHC(item.price * item.quantity)}`).join('\n\n');
  }

  const grandTotal = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const message = `*🔥 DON'T FUCKING QUIT (DFQ) • OFFICIAL ORDER 🔥*\n\n` +
      `*Customer Information:*\n` +
      `👤 Customer Name: ${customerName}\n` +
      `📱 Customer Phone Number: ${customerPhone}\n\n` +
      `*Order Specifics:*\n` +
      `${itemsSummary}\n\n` +
      `*Pricing Breakdown:*\n` +
      `• Subtotal: ${formatGHC(subtotal)}\n` +
      `• Express Shipping: ${formatGHC(shipping)}\n` +
      `• *Grand Total:* ${formatGHC(grandTotal)}\n\n` +
      `_I am ready to confirm my payment and finalize express delivery for this premium athletic streetwear order!_`;

    const encodedMessage = encodeURIComponent(message);
    // Ensure clean number formatting for the exact requested format: https://wa.me/233535079557
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab/window
    window.open(whatsappUrl, '_blank');

    // Clear cart if this was a cart checkout
    if (!isSingleOrder) {
      onClearCart();
    }

    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-[#111111] border border-zinc-800 rounded-lg max-w-lg w-full p-6 sm:p-8 overflow-hidden shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-900/30 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white font-['Syne'] uppercase tracking-widest">
              Order Dispatched to WhatsApp!
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
              You have been redirected to the official WhatsApp dispatch (+233535079557) to coordinate swift delivery. Thank you for choosing Don't Fucking Quit (DFQ).
            </p>
            <div className="pt-4 border-t border-zinc-800/80">
              <button
                onClick={() => { setSent(false); onClose(); }}
                className="px-8 py-3.5 bg-[#FFD700] text-black font-black text-xs uppercase tracking-widest rounded hover:bg-white transition-all shadow-lg"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <MessageSquare className="w-7 h-7 text-emerald-500 fill-emerald-500" />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest font-['Syne']">
                  Order on WhatsApp
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Direct processing via official DFQ line (+233 53 507 9557)
                </p>
              </div>
            </div>

            {/* Order Summary Preview */}
            <div className="bg-[#161616] border border-zinc-800 rounded p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
                <span>Order Summary</span>
                <span>{isSingleOrder ? 'Direct Quick Order' : `${cart.reduce((t, i) => t + i.quantity, 0)} Items in Cart`}</span>
              </div>
              
              <div className="max-h-36 overflow-y-auto space-y-3 pr-2 text-xs">
                {isSingleOrder && singleOrderProduct ? (
                  <div className="flex justify-between items-start text-zinc-300">
                    <div>
                      <div className="font-bold text-white">{singleOrderProduct.product.name}</div>
                      <div className="text-zinc-500 mt-0.5">Size: <strong className="text-[#FFD700]">{singleOrderProduct.size}</strong> | Qty: {singleOrderProduct.quantity}</div>
                    </div>
                    <span className="font-black text-[#FFD700]">{formatGHC(singleOrderProduct.product.price * singleOrderProduct.quantity)}</span>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-zinc-300">
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-zinc-500 mt-0.5">Size: <strong className="text-[#FFD700]">{item.size}</strong> | Qty: {item.quantity}</div>
                      </div>
                      <span className="font-black text-[#FFD700]">{formatGHC(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-zinc-800 text-sm flex justify-between font-extrabold text-white">
                <span>Grand Total (with GH₵50 shipping)</span>
                <span className="text-base text-[#FFD700] font-['Syne'] font-black">{formatGHC(grandTotal)}</span>
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Customer Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-widest mb-1.5">
                  Customer Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +233 24 123 4567"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Ensure your phone number is correct so our Accra/Kumasi dispatch can confirm your shipment.
                </p>
              </div>
            </div>

            {/* Disclaimers & Submit */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-widest uppercase rounded transition-all shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-3 active:translate-y-0.5 focus:outline-none"
              >
                <MessageSquare className="w-5 h-5 text-white fill-white" />
                Open WhatsApp Checkout (wa.me)
              </button>

              <div className="text-[11px] text-zinc-500 text-center space-y-1">
                <p>Generates an instant pre-filled order summary with all specifics.</p>
                <p>Destination: <strong className="text-zinc-300">{whatsappNumber}</strong></p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
