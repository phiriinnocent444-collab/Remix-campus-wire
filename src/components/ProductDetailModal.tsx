import React, { useState } from 'react';
import { MarketplaceProduct } from '../types/marketplace';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShoppingCart,
  Zap,
  Tag,
  AlertCircle,
  Share2,
  Clock,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: MarketplaceProduct | null;
  onClose: () => void;
  onAddToCart: (product: MarketplaceProduct, quantity: number) => void;
  onBuyNow: (product: MarketplaceProduct, quantity: number) => void;
  onContactSeller?: (sellerAlias: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onContactSeller,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const conditionLabels: Record<string, { label: string; color: string }> = {
    brand_new: { label: 'Brand New', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    like_new: { label: 'Like New (Pristine)', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    gently_used: { label: 'Gently Used', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    fair: { label: 'Fair Condition', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  };

  const conditionInfo = conditionLabels[product.condition] || conditionLabels.like_new;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0b1329] border border-[#1e294b] rounded-2xl shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#0b1329]/95 backdrop-blur-md border-b border-[#1e294b]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Item #{product.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Share listing link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close product view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Column Layout */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-900 border border-[#1e294b] flex items-center justify-center">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-all"
              />
              <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${conditionInfo.color}`}>
                {conditionInfo.label}
              </span>
              {product.stock <= 2 && product.stock > 0 && (
                <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-600/90 text-white backdrop-blur-md">
                  Only {product.stock} left in stock!
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-102'
                        : 'border-[#1e294b] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Buyer Trust & Safety Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[#1e294b] flex flex-col gap-2.5 text-xs text-slate-300 mt-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>ZedWhisper Campus Buyer Protection</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Meetups or campus room deliveries are verified by student IDs. Funds can be held in escrow or paid upon receipt via Mobile Money or Cash on Delivery.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-[#1e294b]/60">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Student Seller</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hostel Room Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Info, Price, Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {product.university.toUpperCase()} Campus
                </span>
                <span className="text-slate-600">·</span>
                <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                {product.title}
              </h1>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 mb-4 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Campus Price</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      K{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-500/80">ZMW</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Stock Availability</span>
                  <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Location & Seller card */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-[#1e294b] mb-4 space-y-2.5">
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Campus Pickup & Delivery Point</span>
                    <span className="text-slate-400 text-[11px]">{product.campusLocation}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e294b] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {product.sellerAlias.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-white">@{product.sellerAlias}</span>
                        {product.isVerifiedSeller && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Verified Campus Seller</span>
                    </div>
                  </div>

                  {onContactSeller && (
                    <button
                      onClick={() => {
                        onContactSeller(product.sellerAlias);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Seller</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Product Details & Notes
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/40 p-3 rounded-xl border border-[#1e294b]/60">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-[#1e294b]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="pt-4 border-t border-[#1e294b] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Quantity</span>
                <div className="flex items-center border border-[#1e294b] rounded-lg bg-slate-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-[#1e294b] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Checkout</span>
                </button>
              </div>

              {copiedLink && (
                <p className="text-[11px] text-center text-emerald-400 animate-in fade-in">
                  Listing link copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
