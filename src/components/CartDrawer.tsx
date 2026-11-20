import React, { useState } from 'react';
import { CartItem } from '../types/marketplace';
import { AVAILABLE_COUPONS } from '../data/marketplaceData';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (appliedCouponCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    freeShipping?: boolean;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const baseDeliveryFee = items.length > 0 ? (subtotal > 400 ? 0 : 15) : 0;
  const isFreeDeliveryByCoupon = appliedCoupon?.freeShipping || false;
  const deliveryFee = isFreeDeliveryByCoupon ? 0 : baseDeliveryFee;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    const coupon = AVAILABLE_COUPONS[clean];
    if (coupon) {
      setAppliedCoupon({ code: clean, ...coupon });
      setCouponCode('');
    } else {
      setCouponError('Invalid voucher code. Try ZEDSTUDENT10 or FREESHIP');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#091024] border-l border-[#1e294b] shadow-2xl flex flex-col text-slate-100">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#1e294b] flex items-center justify-between bg-[#0b142d]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Campus Shopping Bag</h2>
                <p className="text-[11px] text-slate-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors cursor-pointer"
                  title="Clear all cart items"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-[#1e294b] flex items-center justify-center text-slate-500 mb-3">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Your bag is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Browse student textbooks, past papers, hostel essentials, tech gear, and campus meals.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
                >
                  Explore Campus Market
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-[#1e294b] flex gap-3 items-center group transition-all hover:border-slate-700"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-800 shrink-0 border border-[#1e294b]"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate mb-0.5">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mb-1">
                      {product.university.toUpperCase()} · @{product.sellerAlias}
                    </p>
                    <div className="text-xs font-bold text-emerald-400">
                      K{(product.price * quantity).toLocaleString()}
                      {quantity > 1 && (
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          (K{product.price} each)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-[#1e294b] rounded-lg bg-slate-950 overflow-hidden text-xs">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="px-2 py-0.5 text-slate-300 hover:bg-slate-800 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-0.5 font-bold text-white tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="px-2 py-0.5 text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Summary & Checkout) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#1e294b] bg-[#0b142d] space-y-3.5">
              {/* Promo code form */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <span className="font-mono font-bold text-emerald-300 uppercase">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {appliedCoupon.description}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-slate-400 hover:text-rose-400 text-xs px-1.5 py-0.5 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Student voucher code (e.g. ZEDSTUDENT10)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#1e294b] bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-[#1e294b] transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-rose-400 mt-1">{couponError}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-[#1e294b]/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Items Subtotal</span>
                  <span className="tabular-nums font-medium">K{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Student Discount</span>
                    <span className="tabular-nums font-medium">-K{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-slate-400" />
                    Campus Hostel Delivery
                  </span>
                  <span className="tabular-nums font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">FREE</span>
                    ) : (
                      `K${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1e294b]">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 font-extrabold text-base tabular-nums">
                    K{grandTotal.toLocaleString()} ZMW
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  onProceedToCheckout(appliedCoupon?.code);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Proceed to Campus Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Airtel & MTN MoMo Verified
                </span>
                <span>·</span>
                <span>Cash on Delivery Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
