import React, { useState } from 'react';
import {
  MarketplaceProduct,
  ProductCategory,
  ProductCondition,
  MarketplaceOrder,
} from '../types/marketplace';
import { CurrentUser, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Plus,
  Star,
  MapPin,
  CheckCircle2,
  Tag,
  Truck,
  ShieldCheck,
  Package,
  Clock,
  Filter,
  Check,
  X,
  BookOpen,
  Laptop,
  Home,
  Shirt,
  Utensils,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Receipt,
} from 'lucide-react';

interface CampusMarketplaceProps {
  products: MarketplaceProduct[];
  orders: MarketplaceOrder[];
  currentUser: CurrentUser;
  selectedUniversity: UniversityId;
  onSelectUniversity: (id: UniversityId) => void;
  onAddToCart: (product: MarketplaceProduct, quantity: number) => void;
  onOpenProductDetail: (product: MarketplaceProduct) => void;
  onOpenSellModal: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const CampusMarketplace: React.FC<CampusMarketplaceProps> = ({
  products,
  orders,
  currentUser,
  selectedUniversity,
  onSelectUniversity,
  onAddToCart,
  onOpenProductDetail,
  onOpenSellModal,
  onOpenCart,
  cartCount,
}) => {
  const [activeView, setActiveView] = useState<'catalog' | 'orders' | 'my_listings'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating' | 'newest'>('featured');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'textbooks', label: 'Textbooks & Past Papers', icon: <BookOpen className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'tech', label: 'Laptops & Gadgets', icon: <Laptop className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'hostel', label: 'Hostel & Bedspaces', icon: <Home className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'fashion', label: 'Merch & Wear', icon: <Shirt className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'food', label: 'Food & Meals', icon: <Utensils className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'services', label: 'Tutoring & Services', icon: <GraduationCap className="w-3.5 h-3.5 text-teal-400" /> },
  ];

  const handleQuickAdd = (product: MarketplaceProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // University filter
    if (selectedUniversity !== 'all' && prod.university !== selectedUniversity) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }
    // Condition filter
    if (selectedCondition !== 'all' && prod.condition !== selectedCondition) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchSeller = prod.sellerAlias.toLowerCase().includes(q);
      const matchLocation = prod.campusLocation.toLowerCase().includes(q);
      const matchTags = prod.tags && prod.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSeller && !matchLocation && !matchTags) {
        return false;
      }
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0; // featured default
  });

  const myListings = products.filter(
    (p) => p.sellerAlias.toLowerCase() === currentUser.alias.toLowerCase()
  );

  return (
    <div className="space-y-5">
      {/* Marketplace Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b142d] via-[#0d1a3a] to-[#08221c] border border-[#1e294b] p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>ZedStore · Campus E-Commerce & Exchange</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Buy & Sell with Peers at <span className="text-emerald-400">Student Rates</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Past exam packs, laptops, calculators, mattresses, hoodies, and warm hostel food delivered directly to your room or campus pickup point.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Student Sellers</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Hostel Runner Delivery</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Airtel & MTN MoMo / COD</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenSellModal}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Sell an Item</span>
            </button>

            <button
              onClick={onOpenCart}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-[#1e294b] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>My Bag</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher: Storefront Catalog vs My Orders vs My Listings */}
      <div className="flex items-center justify-between border-b border-[#1e294b] pb-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'catalog'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Storefront Catalog</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'orders'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>My Orders & Tracking</span>
            {orders.length > 0 && (
              <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('my_listings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'my_listings'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>My Listings</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
              {myListings.length}
            </span>
          </button>
        </div>

        {activeView === 'catalog' && (
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-[#1e294b] bg-slate-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Student Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: CATALOG */}
      {activeView === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Quick Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, textbooks, calculators, hoodies..."
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* University Selector */}
            <div className="w-full sm:w-56 shrink-0">
              <select
                value={selectedUniversity}
                onChange={(e) => onSelectUniversity(e.target.value as UniversityId)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Zambian Campuses</option>
                {UNIVERSITIES.filter((u) => u.id !== 'all').map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.shortName} - {uni.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="w-full sm:w-36 shrink-0">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Any Condition</option>
                <option value="brand_new">Brand New</option>
                <option value="like_new">Like New</option>
                <option value="gently_used">Gently Used</option>
              </select>
            </div>
          </div>

          {/* Category Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-[#1e294b] hover:border-slate-700'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Results Count & Active Filter Pills */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing <span className="font-bold text-white">{sortedProducts.length}</span>{' '}
              {sortedProducts.length === 1 ? 'item' : 'items'}
              {selectedUniversity !== 'all' && (
                <span className="ml-1 text-emerald-400">
                  at {selectedUniversity.toUpperCase()}
                </span>
              )}
            </div>

            {(searchQuery || selectedCategory !== 'all' || selectedCondition !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                }}
                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="py-14 rounded-2xl bg-slate-900/40 border border-[#1e294b] text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-[#1e294b] flex items-center justify-center text-slate-500 mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">No items found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your active search and category filters. Be the first to list an item or broaden your query.
              </p>
              <button
                onClick={onOpenSellModal}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                List Item for Sale
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map((product) => {
                const isJustAdded = addedAnimationId === product.id;

                return (
                  <div
                    key={product.id}
                    onClick={() => onOpenProductDetail(product)}
                    className="group rounded-2xl bg-[#0b1329] border border-[#1e294b] hover:border-slate-600 transition-all shadow-md flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Product Image Header */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-slate-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {product.category}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-semibold text-white bg-slate-950/80 border border-[#1e294b] px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {product.university.toUpperCase()}
                          </span>
                        </div>

                        {product.stock <= 2 && (
                          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-rose-600/90 px-1.5 py-0.2 rounded backdrop-blur-xs">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1 text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{product.rating.toFixed(1)}</span>
                            <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400">
                            <span>@{product.sellerAlias}</span>
                            {product.isVerifiedSeller && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                          {product.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{product.campusLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="p-4 pt-3 border-t border-[#1e294b] bg-slate-950/40 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Price</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-black text-emerald-400">
                            K{product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">ZMW</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={product.stock <= 0}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60'
                          } disabled:opacity-40`}
                          title="Add to shopping cart"
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ORDERS & TRACKING */}
      {activeView === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Campus Orders & Live Delivery Tracker</span>
            </h2>
            <span className="text-xs text-slate-400">{orders.length} total orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="py-14 rounded-2xl bg-slate-900/40 border border-[#1e294b] text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-[#1e294b] flex items-center justify-center text-slate-500 mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">No active orders placed yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once you order textbooks, past papers, hostel items, or meals, your live courier tracking timeline and receipts will show here.
              </p>
              <button
                onClick={() => setActiveView('catalog')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                Browse Storefront
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-[#0b1329] border border-[#1e294b] p-5 space-y-4 shadow-lg"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1e294b]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                          {order.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Delivering to: <span className="text-slate-200">{order.customer.fullName}</span> · {order.customer.university.toUpperCase()} ({order.customer.hostelRoom})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Paid</span>
                      <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                        K{order.total.toLocaleString()} ZMW
                      </span>
                    </div>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="space-y-2">
                    {order.items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 text-xs">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{product.title}</p>
                          <p className="text-[10px] text-slate-400">
                            Qty: {quantity} · Seller: @{product.sellerAlias}
                          </p>
                        </div>
                        <span className="font-bold text-emerald-400 shrink-0">
                          K{(product.price * quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Timeline */}
                  <div className="pt-3 border-t border-[#1e294b]">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      {order.trackingSteps.slice(0, 4).map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border ${
                            step.completed
                              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                              : step.current
                              ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                              : 'bg-slate-900/40 border-[#1e294b] text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-1 font-semibold text-[11px] mb-0.5">
                            {step.completed ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span className="truncate">{step.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {step.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: MY LISTINGS */}
      {activeView === 'my_listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Items You Have Listed for Sale</span>
            </h2>
            <button
              onClick={onOpenSellModal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Another Item</span>
            </button>
          </div>

          {myListings.length === 0 ? (
            <div className="py-14 rounded-2xl bg-slate-900/40 border border-[#1e294b] text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-[#1e294b] flex items-center justify-center text-slate-500 mx-auto">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">No active listings yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start making money on campus by selling textbooks you no longer need, gadgets, study materials, or dorm items.
              </p>
              <button
                onClick={onOpenSellModal}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-[#0b1329] border border-[#1e294b] p-4 space-y-3 shadow-md"
                >
                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-900">
                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white truncate">{prod.title}</h3>
                    <p className="text-xs font-bold text-emerald-400 mt-1">
                      K{prod.price.toLocaleString()} ZMW · {prod.stock} in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
