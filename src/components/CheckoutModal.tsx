import React, { useState } from 'react';
import {
  CartItem,
  MarketplaceOrder,
  OrderCustomerDetails,
  PaymentMethodType,
  OrderStatus,
} from '../types/marketplace';
import { CurrentUser, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Banknote,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Truck,
  Sparkles,
  Check,
  AlertCircle,
  Copy,
  Receipt,
  RotateCcw,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: CurrentUser;
  appliedCouponCode?: string;
  onOrderComplete: (order: MarketplaceOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  appliedCouponCode,
  onOrderComplete,
}) => {
  // Checkout Multi-Step: 1: Delivery Details -> 2: Payment Method -> 3: Verification / Processing -> 4: Success & Tracking
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer & Campus Hostel Details
  const [customer, setCustomer] = useState<OrderCustomerDetails>({
    fullName: currentUser.realName || 'Student Buyer',
    studentId: 'STD-' + Math.floor(100000 + Math.random() * 900000),
    phone: '097' + Math.floor(1000000 + Math.random() * 9000000),
    university: currentUser.university || 'unza',
    hostelRoom: 'Kwacha Hall, Room 12',
    deliveryNotes: 'Please call when at hostel gate.',
  });

  // Step 2: Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('airtel_money');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('097' + Math.floor(1000000 + Math.random() * 9000000));
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('09/27');
  const [cardCvc, setCardCvc] = useState('883');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const baseDeliveryFee = items.length > 0 ? (subtotal > 400 ? 0 : 15) : 0;
  const isFreeShip = appliedCouponCode === 'FREESHIP';
  const deliveryFee = isFreeShip ? 0 : baseDeliveryFee;

  let discount = 0;
  if (appliedCouponCode === 'ZEDSTUDENT10') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedCouponCode === 'KWACHA20') {
    discount = Math.min(20, subtotal);
  } else if (appliedCouponCode === 'UNZA2025') {
    discount = Math.round(subtotal * 0.15);
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
  const bnplMonthlySplit = Math.round(grandTotal / 3);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.hostelRoom) {
      return;
    }
    setStep(2);
  };

  const handleAuthorizeOrder = () => {
    setIsProcessing(true);
    setStep(3);

    // Simulate Payment Gateway strong customer authentication & Order generation
    setTimeout(() => {
      const orderNum = 'ZED-ORD-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder: MarketplaceOrder = {
        id: 'ord-' + Date.now(),
        orderNumber: orderNum,
        items,
        subtotal,
        discount,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        customer,
        status: 'placed',
        createdAt: new Date().toISOString(),
        trackingSteps: [
          {
            title: 'Order Placed & Registered',
            description: `Order registered in ${customer.university.toUpperCase()} Campus Storefront`,
            timestamp: 'Just now',
            completed: true,
            current: false,
          },
          {
            title: paymentMethod === 'cash_on_delivery' ? 'COD Authorized' : 'Payment Verified & Secured',
            description:
              paymentMethod === 'cash_on_delivery'
                ? 'Payment payable in cash or MoMo at hostel handover'
                : `Verified via ${paymentMethod.replace('_', ' ').toUpperCase()} gateway`,
            timestamp: 'Just now',
            completed: true,
            current: true,
          },
          {
            title: 'Packing by Campus Seller',
            description: 'Seller notified to bag and prepare items for pickup runner',
            timestamp: 'Estimated 20-30 mins',
            completed: false,
          },
          {
            title: 'Campus Runner Dispatch',
            description: `Delivery en route to ${customer.hostelRoom}`,
            timestamp: 'Estimated 45-60 mins',
            completed: false,
          },
          {
            title: 'Delivered to Hostel Door',
            description: 'Package received and buyer signature confirmed',
            timestamp: 'Pending',
            completed: false,
          },
        ],
      };

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      setStep(4);
      onOrderComplete(newOrder);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0b1329] border border-[#1e294b] rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0e1733] border-b border-[#1e294b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Secure Campus Checkout</span>
                <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                  256-bit TLS Encrypted
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {step === 1 && 'Step 1 of 3: Campus & Hostel Delivery Destination'}
                {step === 2 && 'Step 2 of 3: Select Payment Method'}
                {step === 3 && 'Authorizing & Contacting Payment Gateway...'}
                {step === 4 && 'Order Confirmed & Campus Runner Dispatched'}
              </p>
            </div>
          </div>

          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 border-b border-[#1e294b] bg-slate-950/40 text-[11px] text-center">
          <div
            className={`py-2 px-1 border-r border-[#1e294b] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              step >= 1 ? 'text-emerald-400 bg-emerald-950/20' : 'text-slate-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
            <span>Delivery</span>
          </div>
          <div
            className={`py-2 px-1 border-r border-[#1e294b] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              step >= 2 ? 'text-emerald-400 bg-emerald-950/20' : 'text-slate-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
            <span>Payment</span>
          </div>
          <div
            className={`py-2 px-1 font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              step >= 4 ? 'text-emerald-400 bg-emerald-950/20' : 'text-slate-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* STEP 1: Delivery Details */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Student & Campus Room Delivery Info</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Kondwani Tembo"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Student ID / NRC Number
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.studentId}
                      onChange={(e) => setCustomer({ ...customer, studentId: e.target.value })}
                      placeholder="e.g. 21084920"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Contact WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="0971234567"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Campus University
                    </label>
                    <select
                      value={customer.university}
                      onChange={(e) => setCustomer({ ...customer, university: e.target.value as UniversityId })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {UNIVERSITIES.filter((u) => u.id !== 'all').map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} ({uni.shortName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Hostel Hall & Room Number / Campus Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.hostelRoom}
                    onChange={(e) => setCustomer({ ...customer, hostelRoom: e.target.value })}
                    placeholder="e.g. October Hall Room 24 / Goma Lakes Bench / Library Steps"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Special Delivery Instructions for Campus Courier (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={customer.deliveryNotes}
                    onChange={(e) => setCustomer({ ...customer, deliveryNotes: e.target.value })}
                    placeholder="e.g. Call my number when you reach the security checkpoint"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#1e294b] bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              {/* Order Quick Summary Preview */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[#1e294b] text-xs">
                <div className="flex justify-between items-center text-slate-300 mb-1">
                  <span>Items to be delivered:</span>
                  <span className="font-semibold text-white">{items.length} items</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-[#1e294b]/60">
                  <span>Grand Total to Pay:</span>
                  <span className="text-emerald-400 font-extrabold">K{grandTotal.toLocaleString()} ZMW</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950"
              >
                <span>Continue to Payment Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment Method Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Select Payment Method (Stripe & Mobile Money)</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Zero Transaction Fee</span>
                </h3>

                <div className="space-y-2">
                  {/* Option 1: Airtel Money */}
                  <label
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'airtel_money'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-[#1e294b] bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'airtel_money'}
                      onChange={() => setPaymentMethod('airtel_money')}
                      className="mt-1 text-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-red-500" />
                          Airtel Money
                        </span>
                        <span className="text-[10px] font-semibold text-red-400 bg-red-950/60 border border-red-800 px-1.5 py-0.2 rounded">
                          Instant USSD Push
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        A payment prompt PIN request will be sent directly to your Airtel Zambia phone.
                      </p>

                      {paymentMethod === 'airtel_money' && (
                        <div className="mt-3 pt-3 border-t border-[#1e294b]">
                          <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                            Airtel Zambia Phone Number
                          </label>
                          <input
                            type="tel"
                            value={mobileMoneyNumber}
                            onChange={(e) => setMobileMoneyNumber(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1e294b] bg-slate-950 text-white font-mono"
                            placeholder="0971234567"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 2: MTN MoMo */}
                  <label
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-[#1e294b] bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'mtn_momo'}
                      onChange={() => setPaymentMethod('mtn_momo')}
                      className="mt-1 text-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-yellow-400" />
                          MTN Mobile Money (MoMo)
                        </span>
                        <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-950/60 border border-yellow-800 px-1.5 py-0.2 rounded">
                          MoMo Pay
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Approve via *115# or the MTN MoMo app prompt.
                      </p>

                      {paymentMethod === 'mtn_momo' && (
                        <div className="mt-3 pt-3 border-t border-[#1e294b]">
                          <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                            MTN Zambia Phone Number
                          </label>
                          <input
                            type="tel"
                            value={mobileMoneyNumber}
                            onChange={(e) => setMobileMoneyNumber(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1e294b] bg-slate-950 text-white font-mono"
                            placeholder="0961234567"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 3: Cash on Delivery / Pay on Handover */}
                  <label
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-[#1e294b] bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="mt-1 text-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-400" />
                          Cash on Delivery (Pay at Hostel Room)
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.2 rounded">
                          No Prepayment
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pay cash or mobile money directly to the student runner upon inspecting your goods.
                      </p>
                    </div>
                  </label>

                  {/* Option 4: Debit/Credit Card (Stripe 3D-Secure) */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-[#1e294b] bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 text-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-400" />
                          Debit or Credit Card (Visa / Mastercard)
                        </span>
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800 px-1.5 py-0.2 rounded">
                          3D Secure
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Accepts Zambian & International cards with bank OTP authorization.
                      </p>

                      {paymentMethod === 'card' && (
                        <div className="mt-3 pt-3 border-t border-[#1e294b] space-y-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1e294b] bg-slate-950 text-white font-mono"
                              placeholder="4242 4242 4242 4242"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                                Expiry (MM/YY)
                              </label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1e294b] bg-slate-950 text-white font-mono"
                                placeholder="12/28"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                                CVC / Security Code
                              </label>
                              <input
                                type="password"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1e294b] bg-slate-950 text-white font-mono"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 5: Student BNPL (Klarna / Split in 3) */}
                  <label
                    onClick={() => setPaymentMethod('student_bnpl')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'student_bnpl'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-[#1e294b] bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'student_bnpl'}
                      onChange={() => setPaymentMethod('student_bnpl')}
                      className="mt-1 text-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-purple-400" />
                          Student Split (3 Monthly Payments of K{bnplMonthlySplit})
                        </span>
                        <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800 px-1.5 py-0.2 rounded">
                          0% Interest
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pay K{bnplMonthlySplit} today, and the rest across the next 2 student bursary/allowance cycles.
                      </p>
                    </div>
                  </label>

                  {/* Option 6: Direct Campus Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-[#1e294b] bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 text-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-teal-400" />
                          Zanaco / Stanbic / Atlas Mara Student Transfer
                        </span>
                        <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/60 border border-teal-800 px-1.5 py-0.2 rounded">
                          EFT / Bank App
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Transfer funds from your Zambian student bank account with reference.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[#1e294b] space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({items.length} items):</span>
                  <span>K{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Voucher:</span>
                    <span>-K{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Hostel Delivery Runner:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `K${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#1e294b]">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-400">K{grandTotal.toLocaleString()} ZMW</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-[#1e294b] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleAuthorizeOrder}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Authorize Payment</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing & Simulation */}
          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-emerald-950/60 flex items-center justify-center text-emerald-400">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Connecting to Secure Campus Gateway
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {paymentMethod === 'airtel_money' && 'Sending USSD prompt to your Airtel phone...'}
                  {paymentMethod === 'mtn_momo' && 'Authenticating MTN Mobile Money transaction...'}
                  {paymentMethod === 'cash_on_delivery' && 'Registering Cash on Delivery booking for runner dispatch...'}
                  {paymentMethod === 'card' && 'Performing 3D-Secure chip authentication with card network...'}
                  {paymentMethod === 'student_bnpl' && 'Approving student 3-split installment schedule...'}
                  {paymentMethod === 'bank_transfer' && 'Generating bank transfer reference...'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pondicherry & Stripe Verified Encryption</span>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Live Order Tracking */}
          {step === 4 && completedOrder && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-1.5">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Order Successfully Placed!</h3>
                <p className="text-xs text-emerald-300 font-mono">
                  Order Code: <span className="font-bold underline">{completedOrder.orderNumber}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  A receipt has been generated. Campus seller and hostel runner have been notified.
                </p>
              </div>

              {/* Live Tracking Timeline */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-[#1e294b]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Live Fulfillment & Campus Delivery Timeline</span>
                </h4>

                <div className="space-y-4 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1e294b]">
                  {completedOrder.trackingSteps.map((s, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          s.completed
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : s.current
                            ? 'bg-amber-500 border-amber-400 ring-4 ring-amber-500/20'
                            : 'bg-slate-900 border-slate-700'
                        }`}
                      />
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className={s.completed || s.current ? 'text-white' : 'text-slate-500'}>
                            {s.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Receipt Details */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-[#1e294b] text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-[#1e294b]/60">
                  <span className="font-semibold text-white">Destination:</span>
                  <span>{customer.university.toUpperCase()} · {customer.hostelRoom}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-[#1e294b]/60">
                  <span className="font-semibold text-white">Payment Mode:</span>
                  <span className="font-mono uppercase text-emerald-400">
                    {paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-white">Total Amount:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    K{completedOrder.total.toLocaleString()} ZMW
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  Done & Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
