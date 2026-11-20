import { UniversityId } from './index';

export type ProductCategory =
  | 'all'
  | 'textbooks'
  | 'tech'
  | 'hostel'
  | 'fashion'
  | 'food'
  | 'services';

export type ProductCondition = 'brand_new' | 'like_new' | 'gently_used' | 'fair';

export interface MarketplaceProduct {
  id: string;
  title: string;
  description: string;
  price: number; // in Zambian Kwacha (ZMW)
  currency: 'ZMW';
  category: ProductCategory;
  condition: ProductCondition;
  university: UniversityId;
  campusLocation: string; // e.g. "UNZA Main Campus, Goma Lakes"
  images: string[];
  sellerAlias: string;
  sellerUniversity: UniversityId;
  sellerPhone?: string;
  isVerifiedSeller: boolean;
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  tags: string[];
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export type PaymentMethodType =
  | 'airtel_money'
  | 'mtn_momo'
  | 'cash_on_delivery'
  | 'card'
  | 'student_bnpl'
  | 'bank_transfer';

export interface OrderCustomerDetails {
  fullName: string;
  studentId: string;
  phone: string;
  university: UniversityId;
  hostelRoom: string;
  deliveryNotes?: string;
}

export type OrderStatus = 'placed' | 'verified' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending' | 'authorized';
  customer: OrderCustomerDetails;
  status: OrderStatus;
  createdAt: string;
  trackingSteps: OrderTrackingStep[];
}
