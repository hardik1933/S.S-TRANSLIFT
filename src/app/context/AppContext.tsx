import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../../../utils/supabase/client';
import { toast } from 'sonner';
import {
  login as authLogin,
  logout as authLogout,
  signup as authSignup,
} from '../../../utils/supabase/auth';
import { supabase } from '../../../utils/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'worker';
  phone?: string;
}

interface Worker {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  totalEntries: number;
  joinedDate: string;
}

/** Normalized from Supabase `transport_requests` (camelCase). */
interface TransportRequest {
  id: string;
  customerName?: string;
  companyName?: string;
  status: string;
  freightAmount?: number;
  phoneNumber?: string;
  pickupLocation?: string;
  dropLocation?: string;
  billNumber?: string;
  partyName?: string;
  brokerName?: string;
  portName?: string;
  containerType?: string;
  vehicleNumber?: string;
  containerNumber?: string;
  loadWeight?: string;
  cargoDescription?: string;
  serviceDate?: string;
  date?: string;
  notes?: string;
  addedBy?: string;
  createdAt?: string;
  parkingCharges?: number;
  truckFreight?: number;
  companyMargin?: number;
  advancePayment?: number;
  balancePayment?: number;
  paymentMode?: string;
}

interface AppContextType {
  user: User | null;
  workers: Worker[];
  requests: TransportRequest[];
  loading: boolean;
  darkMode: boolean;
  notifications: Array<{id: string, message: string, read: boolean}>;
  login: (email: string, password: string, role: 'admin' | 'worker') => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    companyName: string,
    phone: string,
    role?: 'admin' | 'worker'
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  addWorker: (worker: {
    name: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
  }) => Promise<void>;
  addRequest: (data: Record<string, unknown>) => Promise<void>;
  updateRequestStatus: (id: string, status: string) => Promise<void>;
  bulkImportRequests: (file: File) => Promise<void>;
  toggleDarkMode: () => void;
  markNotificationRead: (id: string) => void;
}

const Context = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, read: boolean}>>([]);

  useEffect(() => {
    loadUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySessionUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const applySessionUser = (sessionUser: any | null) => {
    if (!sessionUser) {
      setUser(null);
      setWorkers([]);
      setRequests([]);
      setLoading(false);
      return;
    }

    const role = (sessionUser.user_metadata?.role as 'admin' | 'worker' | undefined) ?? 'worker';
    const name =
      (sessionUser.user_metadata?.name as string | undefined) ??
      sessionUser.email?.split('@')[0] ??
      'User';

    setUser({
      id: sessionUser.id,
      email: sessionUser.email ?? '',
      name,
      role,
      phone: sessionUser.user_metadata?.phone as string | undefined,
    });

    loadData();
  };

  const loadUser = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    applySessionUser(data.session?.user ?? null);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [wData, rData] = await Promise.all([api.getWorkers(), api.getRequests()]);
      setWorkers(Array.isArray(wData) ? (wData as Worker[]) : []);
      setRequests(Array.isArray(rData) ? (rData as TransportRequest[]) : []);
    } catch (error) {
      console.warn('Failed to load data from Supabase:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not load workers or requests. Check Supabase tables and RLS policies.',
      );
      setWorkers([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AppContextType = {
    user,
    workers,
    requests,
    loading,
    darkMode,
    notifications,
  async login(email: string, password: string, role: 'admin' | 'worker') {
      const result = await authLogin(email, password, role);
      if (!result.success) {
        toast.error(result.error ?? 'Invalid email or password');
        return false;
      }
      await loadUser();
      return true;
    },
    async signup(name, email, password, companyName, phone, role = 'worker') {
      const result = await authSignup({
        name,
        email,
        password,
        companyName,
        phone,
        role,
      });

      if (!result.success) {
        toast.error(result.error ?? 'Failed to create account');
        return false;
      }

      toast.success('Signup successful. Check your email for verification.');
      return true;
    },
    logout: async () => {
      await authLogout();
      setUser(null);
      setWorkers([]);
      setRequests([]);
    },

    async addWorker(workerData) {
      const created = await api.createWorker(workerData as unknown as Record<string, unknown>);
      setWorkers((prev) => [created as Worker, ...prev]);
    },
    async addRequest(data) {
      if (!user?.name) {
        toast.error('You must be logged in to submit an entry.');
        throw new Error('Not logged in');
      }
      const newRequest = await api.createRequest(data, user.name);
      setRequests((prev) => [newRequest as TransportRequest, ...prev]);
    },
    async updateRequestStatus(id: string, status: string) {
      const updated = await api.updateRequest(id, { status });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...(updated ? (updated as TransportRequest) : {}), status } : r,
        ),
      );
    },
    async bulkImportRequests(file: File) {
      // TODO: implement XLSX parsing
      console.log('Bulk import:', file);
    },
    toggleDarkMode: () => setDarkMode(prev => !prev),
    markNotificationRead: (id) => {
      setNotifications(nots => nots.map(n => n.id === id ? {...n, read: true} : n));
    },
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export const useApp = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
