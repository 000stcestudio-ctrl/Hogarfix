export type CategoryType = 'plomeria' | 'electricidad' | 'cerrajeria' | 'aseo' | 'obra' | 'mantenimiento';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Professional {
  id: string;
  name: string;
  trade: string; // ej. "Plomero y Fontanero Hidráulico"
  category: CategoryType;
  rating: number;
  reviewCount: number;
  visitRate: string; // ej. "$35.000 COP tarifa base"
  isOnline: boolean;
  isVerified: boolean;
  isSubscribed: boolean; // Membresía mensual activa
  avatarUrl: string;
  bio: string;
  experienceYears: number;
  phone: string;
  location: string;
  completedJobs: number;
  servicesOffered: string[];
  reviews: Review[];
}

export interface ServiceCategory {
  id: CategoryType;
  name: string;
  iconName: string;
  color: string;
  tagQuery: string;
}

export type PaymentMethod = 'Efectivo al finalizar' | 'Transferencia Nequi / Daviplata' | 'A convenir en visita';

export type AppointmentStatus = 'agendado' | 'en_curso' | 'finalizado';

export interface Appointment {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  trade: string;
  date: string;
  timeSlot: string;
  paymentMethod: PaymentMethod;
  status: AppointmentStatus;
  notes?: string;
  ratingGiven?: number;
}

export interface ChatMessage {
  id: string;
  proId: string;
  sender: 'user' | 'pro' | 'system';
  text: string;
  timestamp: string;
  isAppointmentCard?: boolean;
  appointmentData?: Partial<Appointment>;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  frequency?: string;
  urgentServices?: string[];
  sameDayPreference?: string;
}

export type UserRole = 'client' | 'provider';
export type AuthStatus = 'unauthenticated' | 'guest' | 'authenticated';
export type AuthProvider = 'google' | 'apple' | 'guest' | 'email';
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'canceled';

export interface PaymentCardDetails {
  brand: string; // Visa, Mastercard, American Express
  last4: string;
  expiry: string;
  cardholderName: string;
}

export interface SubscriptionDetails {
  status: SubscriptionStatus;
  amount: number; // 10 USD
  currency: string; // 'USD'
  renewsAt?: string;
  paymentMethod?: PaymentCardDetails;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  title?: string;
}

export interface ProviderPublication {
  id: string;
  name: string;
  avatarUrl: string;
  trade: string;
  category: CategoryType;
  bio: string;
  experienceYears: number;
  visitRate: string;
  phone: string;
  location: string;
  servicesOffered: string[];
  portfolioPhotos: string[];
  additionalMedia: MediaItem[];
}

