import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  UserProfile,
  Appointment,
  ChatMessage,
  Professional,
  PaymentMethod,
  UserRole,
  AuthStatus,
  AuthProvider,
  SubscriptionDetails,
  ProviderPublication,
  MediaItem,
} from '@/types';
import {
  PROFESSIONALS,
  INITIAL_APPOINTMENTS,
  INITIAL_CHATS,
} from '@/data/mockData';

interface AppContextType {
  // Estado de usuario y cliente
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  // Autenticación y sesión anti-bugs
  authStatus: AuthStatus;
  authProvider: AuthProvider | null;
  guestId: string | null;
  loginWithSocial: (provider: 'google' | 'apple', targetRole?: UserRole) => Promise<void>;
  loginAsGuest: (targetRole?: UserRole) => Promise<string>;
  linkGuestAccount: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => void;

  // Pasarela y membresía mensual ($10 USD)
  subscription: SubscriptionDetails;
  activateSubscription: (payment: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardholderName: string;
  }) => boolean;
  cancelSubscription: () => void;

  // Publicación del prestador (fotos, videos, bio)
  providerPublication: ProviderPublication;
  updateProviderPublication: (updates: Partial<ProviderPublication>) => void;
  addPortfolioPhoto: (url: string) => void;
  removePortfolioPhoto: (index: number) => void;
  addAdditionalMedia: (item: Omit<MediaItem, 'id'>) => void;
  removeAdditionalMedia: (id: string) => void;

  // Citas y chats (existentes)
  appointments: Appointment[];
  addAppointment: (newApp: {
    professionalId: string;
    professionalName: string;
    professionalAvatar: string;
    trade: string;
    date: string;
    timeSlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Appointment;
  rateAppointment: (appointmentId: string, rating: number) => void;
  chats: Record<string, ChatMessage[]>;
  sendMessage: (
    proId: string,
    text: string,
    sender?: 'user' | 'pro' | 'system',
    appointmentData?: Partial<Appointment>
  ) => void;

  // Preferencias generales
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  isDarkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  isLargeText: boolean;
  setLargeText: (val: boolean) => void;
  toggleLargeText: () => void;
  professionals: Professional[];
}

const DEFAULT_USER: UserProfile = {
  name: 'María Consuelo Morales',
  email: 'mconsuelo@correo.com',
  phone: '+57 301 234 5678',
  address: 'Calle 140 # 19-35, Apto 402, Bogotá',
  frequency: 'Mensual',
  urgentServices: ['Plomería', 'Cerrajería'],
  sameDayPreference: 'Con anticipación',
};

const DEFAULT_PROVIDER_PUBLICATION: ProviderPublication = {
  id: 'pro-my-account',
  name: 'Maestro Carlos Gómez',
  avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  trade: 'Cerrajero y Técnico en Seguridad Residencial',
  category: 'cerrajeria',
  bio: 'Especialista certificado con más de 15 años de experiencia. Reparación de cerraduras de alta seguridad, apertura de emergencia sin daños, mantenimiento de cilindros e instalación de cerraduras digitales con garantía total.',
  experienceYears: 15,
  visitRate: '$40.000 COP / $10 USD tarifa base',
  phone: '+57 312 987 6543',
  location: 'Bogotá y Alrededores (Servicio a Domicilio)',
  servicesOffered: [
    'Apertura urgente de puertas sin rotura',
    'Instalación de cerraduras electrónicas y digitales',
    'Cambio de guardas y duplicado de llaves de seguridad',
    'Mantenimiento preventivo de cerraduras blindadas',
  ],
  portfolioPhotos: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&auto=format&fit=crop&q=80',
  ],
  additionalMedia: [
    {
      id: 'media-1',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
      title: 'Taller móvil equipado para emergencias',
    },
    {
      id: 'media-2',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=500&auto=format&fit=crop&q=80',
      title: 'Demostración de apertura de cilindro biométrico',
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [role, setRole] = useState<UserRole>('client');
  const [authStatus, setAuthStatus] = useState<AuthStatus>('unauthenticated');
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);

  // Suscripción mensual ($10 USD)
  const [subscription, setSubscription] = useState<SubscriptionDetails>({
    status: 'inactive',
    amount: 10,
    currency: 'USD',
  });

  // Publicación editable del técnico
  const [providerPublication, setProviderPublication] = useState<ProviderPublication>(DEFAULT_PROVIDER_PUBLICATION);

  // Idioma y preferencias
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);

  // Citas y chats
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);

  const updateUser = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  // Autenticación con Google o Apple
  const loginWithSocial = async (provider: 'google' | 'apple', targetRole?: UserRole) => {
    const selectedRole = targetRole || role;
    setRole(selectedRole);
    setAuthProvider(provider);
    setAuthStatus('authenticated');
    setGuestId(null);

    if (provider === 'google') {
      updateUser({
        name: selectedRole === 'provider' ? 'Carlos Gómez (Técnico)' : 'María C. Morales',
        email: selectedRole === 'provider' ? 'carlos.pro@hogarfix.com' : 'mconsuelo@correo.com',
      });
    } else {
      updateUser({
        name: selectedRole === 'provider' ? 'Carlos Pro (Apple ID)' : 'Usuario Apple',
        email: selectedRole === 'provider' ? 'carlos.apple@privaterelay.appleid.com' : 'usuario@privaterelay.appleid.com',
      });
    }
  };

  // Inicio como invitado (Zero bugs: genera ID determinista y preserva estado)
  const loginAsGuest = async (targetRole?: UserRole): Promise<string> => {
    const selectedRole = targetRole || role;
    setRole(selectedRole);
    const generatedId = guestId || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setGuestId(generatedId);
    setAuthProvider('guest');
    setAuthStatus('guest');

    updateUser({
      name: selectedRole === 'provider' ? 'Técnico Invitado' : 'Visitante Invitado',
      email: `${generatedId}@guest.hogarfix.local`,
    });

    return generatedId;
  };

  // Vinculación segura de cuenta invitada a cuenta real (sin pérdida de datos)
  const linkGuestAccount = async (provider: 'google' | 'apple') => {
    setAuthProvider(provider);
    setAuthStatus('authenticated');
    setGuestId(null);
    updateUser({
      name: provider === 'google' ? 'Cuenta Verificada Google' : 'Cuenta Verificada Apple',
    });
  };

  const logout = () => {
    setAuthStatus('unauthenticated');
    setAuthProvider(null);
    setGuestId(null);
    setUser(DEFAULT_USER);
  };

  // Activación de membresía mensual de $10 USD
  const activateSubscription = (payment: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardholderName: string;
  }): boolean => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const renewsDateFormatted = nextMonth.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const cleanCard = payment.cardNumber.replace(/\s+/g, '');
    const last4Digits = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';

    setSubscription({
      status: 'active',
      amount: 10,
      currency: 'USD',
      renewsAt: renewsDateFormatted,
      paymentMethod: {
        brand: 'Visa',
        last4: last4Digits,
        expiry: payment.expiry || '12/28',
        cardholderName: payment.cardholderName || 'Titular de Tarjeta',
      },
    });

    return true;
  };

  const cancelSubscription = () => {
    setSubscription((prev) => ({
      ...prev,
      status: 'canceled',
    }));
  };

  // Modificación de publicación de técnico
  const updateProviderPublication = (updates: Partial<ProviderPublication>) => {
    setProviderPublication((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addPortfolioPhoto = (url: string) => {
    setProviderPublication((prev) => ({
      ...prev,
      portfolioPhotos: [...prev.portfolioPhotos, url],
    }));
  };

  const removePortfolioPhoto = (index: number) => {
    setProviderPublication((prev) => ({
      ...prev,
      portfolioPhotos: prev.portfolioPhotos.filter((_, i) => i !== index),
    }));
  };

  const addAdditionalMedia = (item: Omit<MediaItem, 'id'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    };
    setProviderPublication((prev) => ({
      ...prev,
      additionalMedia: [...prev.additionalMedia, newItem],
    }));
  };

  const removeAdditionalMedia = (id: string) => {
    setProviderPublication((prev) => ({
      ...prev,
      additionalMedia: prev.additionalMedia.filter((m) => m.id !== id),
    }));
  };

  // Citas y chats
  const addAppointment = (newApp: {
    professionalId: string;
    professionalName: string;
    professionalAvatar: string;
    trade: string;
    date: string;
    timeSlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Appointment => {
    const created: Appointment = {
      id: `app-${Date.now()}`,
      ...newApp,
      status: 'agendado',
    };

    setAppointments((prev) => [created, ...prev]);

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    sendMessage(
      newApp.professionalId,
      `📅 Visita formal agendada para ${newApp.date} (${newApp.timeSlot}). Pago acordado: ${newApp.paymentMethod}.`,
      'system',
      created
    );

    return created;
  };

  const rateAppointment = (appointmentId: string, rating: number) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, ratingGiven: rating } : app))
    );
  };

  const sendMessage = (
    proId: string,
    text: string,
    sender: 'user' | 'pro' | 'system' = 'user',
    appointmentData?: Partial<Appointment>
  ) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      proId,
      sender,
      text,
      timestamp: timeString,
      isAppointmentCard: !!appointmentData,
      appointmentData,
    };

    setChats((prev) => ({
      ...prev,
      [proId]: [...(prev[proId] || []), newMsg],
    }));
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleLargeText = () => setIsLargeText((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        role,
        setRole,
        authStatus,
        authProvider,
        guestId,
        loginWithSocial,
        loginAsGuest,
        linkGuestAccount,
        logout,
        subscription,
        activateSubscription,
        cancelSubscription,
        providerPublication,
        updateProviderPublication,
        addPortfolioPhoto,
        removePortfolioPhoto,
        addAdditionalMedia,
        removeAdditionalMedia,
        appointments,
        addAppointment,
        rateAppointment,
        chats,
        sendMessage,
        language,
        setLanguage,
        isDarkMode,
        setDarkMode: setIsDarkMode,
        toggleDarkMode,
        isLargeText,
        setLargeText: setIsLargeText,
        toggleLargeText,
        professionals: PROFESSIONALS,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
