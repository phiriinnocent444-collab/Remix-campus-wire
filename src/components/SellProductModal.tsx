import React, { useState } from 'react';
import { MarketplaceProduct, ProductCategory, ProductCondition } from '../types/marketplace';
import { CurrentUser, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import {
  X,
  Upload,
  Plus,
  DollarSign,
  Tag,
  MapPin,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onAddProduct: (product: MarketplaceProduct) => void;
}

const PRESET_IMAGES: { label: string; url: string }[] = [
  {
    label: 'Textbooks & Past Papers',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Laptop / Tech',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Campus Hoodie / Merch',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Scientific Calculator',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Hostel Mattress / Room',
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Campus Food & Meals',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
];

export const SellProductModal: React.FC<SellProductModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddProduct,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('textbooks');
  const [condition, setCondition] = useState<ProductCondition>('like_new');
  const [university, setUniversity] = useState<UniversityId>(currentUser.university || 'unza');
  const [campusLocation, setCampusLocation] = useState(
    currentUser.campus ? `${currentUser.campus} Campus` : 'Main Campus Goma Lakes'
  );
  const [stock, setStock] = useState('1');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [tagsInput, setTagsInput] = useState('');
  const [phone, setPhone] = useState('097' + Math.floor(1000000 + Math.random() * 9000000));
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (!title.trim()) {
      setError('Please provide a listing title.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please provide a valid price in ZMW.');
      return;
    }
    if (isNaN(parsedStock) || parsedStock <= 0) {
      setError('Please enter a valid stock count.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newProduct: MarketplaceProduct = {
      id: 'prod-' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'No additional description provided.',
      price: parsedPrice,
      currency: 'ZMW',
      category,
      condition,
      university,
      campusLocation: campusLocation.trim() || 'Campus Center',
      images: [imageUrl || PRESET_IMAGES[0].url],
      sellerAlias: currentUser.alias || 'CampusHustler',
      sellerUniversity: currentUser.university || 'unza',
      sellerPhone: phone.trim(),
      isVerifiedSeller: !currentUser.isGhostMode,
      stock: parsedStock,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      tags: tags.length > 0 ? tags : [category, university],
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#0b1329] border border-[#1e294b] rounded-2xl shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-[#0e1733] border-b border-[#1e294b]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Sell an Item on Campus</h2>
              <p className="text-[11px] text-slate-400">
                List textbooks, electronics, dorm essentials, or campus food
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Item Title / Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UNZA Economics Past Papers 2024 / HP Charger 65W"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="textbooks">Textbooks & Academic Packs</option>
                <option value="tech">Laptops & Electronics</option>
                <option value="hostel">Hostel & Room Essentials</option>
                <option value="fashion">Merch & Campus Wear</option>
                <option value="food">Hostel Food & Groceries</option>
                <option value="services">Tutoring & Student Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Item Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="brand_new">Brand New (Unopened/Original)</option>
                <option value="like_new">Like New (Pristine condition)</option>
                <option value="gently_used">Gently Used (Minor cosmetic signs)</option>
                <option value="fair">Fair (Functional with wear)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price in Zambian Kwacha (ZMW) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                  K
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Units in Stock *
              </label>
              <input
                type="number"
                required
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Campus University *
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value as UniversityId)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {UNIVERSITIES.filter((u) => u.id !== 'all').map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} ({uni.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pickup / Room Location *
              </label>
              <input
                type="text"
                required
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                placeholder="e.g. October Hall Room 12 / Goma Lakes"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Photo selection with quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Item Photo (URL or Preset)</span>
              <span className="text-[10px] text-slate-400">Click a preset below or paste image link</span>
            </label>

            <div className="grid grid-cols-3 gap-2 mb-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageUrl === preset.url
                      ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'border-[#1e294b] bg-slate-900/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt=""
                    className="w-6 h-6 rounded object-cover shrink-0"
                  />
                  <span className="text-[10px] text-slate-300 truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, reason for selling, whether charger/accessories are included..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seller WhatsApp / Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0971234567"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="unza, exams, pastpapers"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e294b] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#1e294b] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish Listing to Campus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
