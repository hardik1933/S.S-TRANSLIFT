import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, api } from '../../../utils/supabase/client';
import { toast } from 'sonner';

export interface TransportRequest {
  id: string;
  // Basic Info
  date: string;
  billNumber: string;
  customerName: string;
  companyName: string;
  phoneNumber: string;
  
  // Transport Details
  partyName: string;
  brokerName: string;
  pickupLocation: string;
  dropLocation: string;
  portName: string; // Any port (not just JNPT)
  
  // Container & Vehicle
  containerType: '20-Foot Standard' | '40-Foot Standard' | '40-Foot High Cube' | 'Reefer Container' | 'Flat Rack Container' | 'ODC Container';
  vehicleNumber: string;
  containerNumber: string;
  loadWeight: string;
  cargoDescription: string;
  
  // Financial
  parkingCharges: number;
  freightAmount: number;
  truckFreight: number;
  companyMargin: number;
  advancePayment: number;
  balancePayment: number;
  paymentMode: 'Cash' | 'NEFT' | 'UPI' | 'Cheque';
  
  // Status & Notes
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed';
  notes: string;
  createdAt: string;
  serviceDate: string;
  addedBy: string; // Worker who added this entry
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  phoneNumber: string;
  role: string; // e.g., "Transport Coordinator", "Field Officer"
  status: string;
  joinedDate: string;
  totalEntries: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: 'worker_entry' | 'status_update' | 'admin_action' | 'payment' | 'general';
  workerName?: string;
  requestId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'admin';
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: 'worker' | 'admin') => boolean;
  logout: () => void;
  addWorker: (worker: Omit<Worker, 'id' | 'joinedDate' | 'totalEntries' | 'isActive'>) => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  requests: TransportRequest[];
  workers: Worker[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  bulkImportRequests: (importedRequests: Omit<TransportRequest, 'id' | 'createdAt'>[]) => Promise<void>;
  updateRequestStatus: (id: string, status: TransportRequest['status']) => Promise<void>;
  updateRequest: (id: string, request: Partial<TransportRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock data for initial load if Supabase is unavailable
const mockRequests: TransportRequest[] = [
  {
    id: 'REQ001',
    date: '2026-03-05',
    billNumber: 'BILL001',
    customerName: 'Rajesh Kumar',
    companyName: 'Mumbai Logistics Pvt Ltd',
    phoneNumber: '+91 98765 43210',
    partyName: 'Party A',
    brokerName: 'Broker X',
    pickupLocation: 'JNPT Port, Navi Mumbai',
    dropLocation: 'Turbhe Industrial Area',
    portName: 'JNPT Port',
    containerType: '40-Foot Standard',
    vehicleNumber: 'MH12 ABC 1234',
    containerNumber: 'CONT001',
    loadWeight: '15000 kg',
    cargoDescription: 'Machinery parts',
    parkingCharges: 500,
    freightAmount: 10000,
    truckFreight: 2000,
    companyMargin: 1500,
    advancePayment: 5000,
    balancePayment: 5000,
    paymentMode: 'NEFT',
    status: 'In Progress',
    notes: 'Handle with care - machinery parts',
    createdAt: '2026-03-05T10:30:00Z',
    serviceDate: '2026-03-10',
    addedBy: 'Worker1',
  },
  {
    id: 'REQ002',
    date: '2026-03-06',
    billNumber: 'BILL002',
    customerName: 'Priya Sharma',
    companyName: 'Nhava Sheva Exports',
    phoneNumber: '+91 98234 56789',
    partyName: 'Party B',
    brokerName: 'Broker Y',
    pickupLocation: 'Nhava Sheva Port',
    dropLocation: 'Kalamboli MIDC',
    portName: 'Nhava Sheva Port',
    containerType: '20-Foot Standard',
    vehicleNumber: 'MH12 DEF 5678',
    containerNumber: 'CONT002',
    loadWeight: '25000 kg',
    cargoDescription: 'Electronics',
    parkingCharges: 300,
    freightAmount: 12000,
    truckFreight: 2500,
    companyMargin: 1800,
    advancePayment: 6000,
    balancePayment: 6000,
    paymentMode: 'UPI',
    status: 'Pending',
    notes: 'Container loading required',
    createdAt: '2026-03-06T14:20:00Z',
    serviceDate: '2026-03-12',
    addedBy: 'Worker2',
  },
  {
    id: 'REQ003',
    date: '2026-03-01',
    billNumber: 'BILL003',
    customerName: 'Amit Desai',
    companyName: 'Turbhe Engineering Works',
    phoneNumber: '+91 99876 54321',
    partyName: 'Party C',
    brokerName: 'Broker Z',
    pickupLocation: 'Kalamboli',
    dropLocation: 'Panvel Industrial Zone',
    portName: 'JNPT Port',
    containerType: 'ODC Container',
    vehicleNumber: 'MH12 GHI 9012',
    containerNumber: 'CONT003',
    loadWeight: '8000 kg',
    cargoDescription: 'Steel beams',
    parkingCharges: 400,
    freightAmount: 8000,
    truckFreight: 1500,
    companyMargin: 1200,
    advancePayment: 4000,
    balancePayment: 4000,
    paymentMode: 'Cash',
    status: 'Completed',
    notes: 'Early morning pickup preferred',
    createdAt: '2026-03-01T09:15:00Z',
    serviceDate: '2026-03-08',
    addedBy: 'Worker3',
  },
];

const mockWorkers: Worker[] = [
  {
    id: 'WORK001',
    name: 'Worker1',
    email: 'worker1@example.com',
    phone: '+91 98765 43210',
    phoneNumber: '+91 98765 43210',
    role: 'Transport Coordinator',
    status: 'active',
    joinedDate: '2025-06-15',
    totalEntries: 5,
    isActive: true,
  },
  {
    id: 'WORK002',
    name: 'Worker2',
    email: 'worker2@example.com',
    phone: '+91 98234 56789',
    phoneNumber: '+91 98234 56789',
    role: 'Field Officer',
    status: 'active',
    joinedDate: '2025-08-22',
    totalEntries: 3,
    isActive: true,
  },
  {
    id: 'WORK003',
    name: 'Worker3',
    email: 'worker3@example.com',
    phone: '+91 99876 54321',
    phoneNumber: '+91 99876 54321',
    role: 'Transport Coordinator',
    status: 'active',
    joinedDate: '2025-04-10',
    totalEntries: 7,
    isActive: true,
  },
];

// Helper functions to convert between camelCase and snake_case
const toSnakeCase = (obj: any): any => {
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (obj[key] !== undefined && obj[key] !== null) {
      result[snakeKey] = obj[key];
    }
  }
  return result;
};

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
    return result;
  }
  return obj;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [requests, setRequests] = useState<TransportRequest[]>(mockRequests);
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'New transport request from Rajesh Kumar', time: '2 hours ago', read: false, type: 'worker_entry', workerName: 'Worker1' },
    { id: '2', message: 'Payment received for REQ003', time: '5 hours ago', read: false, type: 'payment', requestId: 'REQ003' },
    { id: '3', message: 'Request REQ001 status updated to In Progress', time: '1 day ago', read: true, type: 'status_update', requestId: 'REQ001' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Try to load from Supabase - transport requests
        const supabaseRequests = await api.getRequests();
        if (supabaseRequests && supabaseRequests.length > 0) {
          const mappedRequests = supabaseRequests.map((req: any) => {
            // Map snake_case from DB to camelCase for app
            return {
              id: req.id || `REQ${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              date: req.pickup_date || req.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              billNumber: req.bill_number || `BILL${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
              customerName: req.customer_name || '',
              companyName: req.company_name || '',
              phoneNumber: req.phone_number || '',
              partyName: req.party_name || '',
              brokerName: req.broker_name || '',
              pickupLocation: req.pickup_location || '',
              dropLocation: req.delivery_location || '',
              portName: req.port_name || '',
              containerType: req.container_type || '20-Foot Standard',
              vehicleNumber: req.vehicle_number || '',
              containerNumber: req.container_number || '',
              loadWeight: req.load_weight || '',
              cargoDescription: req.cargo_description || '',
              parkingCharges: req.parking_charges || 0,
              freightAmount: req.freight_amount || 0,
              truckFreight: req.truck_freight || 0,
              companyMargin: req.company_margin || 0,
              advancePayment: req.advance_payment || 0,
              balancePayment: req.balance_payment || 0,
              paymentMode: req.payment_mode || 'Cash',
              status: req.status || 'Pending',
              notes: req.special_instructions || '',
              createdAt: req.created_at || new Date().toISOString(),
              serviceDate: req.pickup_date || '',
              addedBy: req.added_by || 'System',
            };
          });
          setRequests(mappedRequests);
          console.log('Loaded requests from Supabase:', mappedRequests.length);
        }
        
        // Try to load from Supabase - workers
        const supabaseWorkers = await api.getWorkers();
        if (supabaseWorkers && supabaseWorkers.length > 0) {
          const mappedWorkers = supabaseWorkers.map((worker: any) => {
            // Map snake_case from DB to camelCase for app
            return {
              id: worker.id || `WORK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              name: worker.name || '',
              email: worker.email || '',
              phone: worker.phone || '',
              phoneNumber: worker.phone || '',
              role: worker.role || 'worker',
              status: worker.status || 'active',
              joinedDate: worker.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              totalEntries: worker.total_entries || 0,
              isActive: worker.status === 'active',
            };
          });
          setWorkers(mappedWorkers);
          console.log('Loaded workers from Supabase:', mappedWorkers.length);
        }
      } catch (error) {
        console.warn('Supabase not available, using local data:', error);
        // Continue with mock data
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Load user preferences
    const savedUser = localStorage.getItem('ss-translift-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedDarkMode = localStorage.getItem('ss-translift-darkmode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const login = (email: string, password: string, role: 'worker' | 'admin') => {
    // Mock authentication
    const mockUser: User = {
      id: role === 'admin' ? 'admin1' : 'worker1',
      name: role === 'admin' ? 'Admin User' : 'Worker User',
      email,
      role,
    };
    setUser(mockUser);
    localStorage.setItem('ss-translift-user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ss-translift-user');
  };

  const addWorker = async (worker: Omit<Worker, 'id' | 'joinedDate' | 'totalEntries' | 'isActive'>) => {
    setIsLoading(true);
    
    // Save to Supabase first
    let supabaseWorkerId: string | null = null;
    try {
      const supabaseData = {
        name: worker.name,
        email: worker.email,
        phone: worker.phoneNumber || worker.phone,
        role: worker.role.toLowerCase().includes('admin') ? 'admin' : 'worker',
        status: 'active',
      };
      
      console.log('Attempting to save worker to Supabase:', supabaseData);
      
      const result = await api.createWorker(supabaseData);
      console.log('Worker saved to Supabase:', result);
      
      if (result && result.id) {
        supabaseWorkerId = result.id;
        toast.success('Worker saved to database!');
      } else {
        // If no result but no error, still use the data
        supabaseWorkerId = `WORK${String(workers.length + 1).padStart(3, '0')}`;
        console.warn('No ID returned from Supabase, using local ID:', supabaseWorkerId);
      }
    } catch (error) {
      console.error('Failed to save worker to Supabase:', error);
      // Use local ID as fallback
      supabaseWorkerId = `WORK${String(workers.length + 1).padStart(3, '0')}`;
      toast.error('Failed to save worker to database. Saved locally only.');
    }
    
    // Create worker object with the Supabase ID (or fallback to local ID)
    const newWorker: Worker = {
      ...worker,
      id: supabaseWorkerId || `WORK${String(workers.length + 1).padStart(3, '0')}`,
      phone: worker.phoneNumber || worker.phone || '',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      totalEntries: 0,
      isActive: true,
    };
    
    setWorkers([newWorker, ...workers]);
    setIsLoading(false);
    
    // Add notification
    setNotifications([
      {
        id: String(Date.now()),
        message: `New worker added: ${worker.name}`,
        time: 'Just now',
        read: false,
        type: 'admin_action',
      },
      ...notifications,
    ]);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('ss-translift-darkmode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addRequest = async (request: Omit<TransportRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: TransportRequest = {
      ...request,
      id: `REQ${String(requests.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Save to Supabase - Include ALL fields
    try {
      const supabaseData = {
        // Basic Info
        date: request.date,
        bill_number: request.billNumber,
        customer_name: request.customerName,
        company_name: request.companyName,
        phone_number: request.phoneNumber,
        
        // Transport Details
        party_name: request.partyName,
        broker_name: request.brokerName,
        pickup_location: request.pickupLocation,
        delivery_location: request.dropLocation,
        port_name: request.portName,
        
        // Container & Vehicle
        container_type: request.containerType,
        vehicle_number: request.vehicleNumber,
        container_number: request.containerNumber,
        load_weight: request.loadWeight,
        cargo_description: request.cargoDescription,
        
        // Financial
        parking_charges: request.parkingCharges,
        freight_amount: request.freightAmount,
        truck_freight: request.truckFreight,
        company_margin: request.companyMargin,
        advance_payment: request.advancePayment,
        balance_payment: request.balancePayment,
        payment_mode: request.paymentMode,
        
        // Status & Notes
        status: 'Pending',
        special_instructions: request.notes,
        pickup_date: request.serviceDate || request.date,
        delivery_date: request.serviceDate || null,
        added_by: request.addedBy,
      };
      
      console.log('Saving transport request to Supabase:', supabaseData);
      await api.createRequest(supabaseData);
      toast.success('Request saved to database!');
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
      toast.warning('Request saved locally (database sync failed)');
    }

    setRequests([newRequest, ...requests]);
    
    // Add notification
    setNotifications([
      {
        id: String(Date.now()),
        message: `New transport request from ${request.customerName}`,
        time: 'Just now',
        read: false,
        type: 'worker_entry',
        workerName: request.addedBy,
      },
      ...notifications,
    ]);
  };

  const bulkImportRequests = async (importedRequests: Omit<TransportRequest, 'id' | 'createdAt'>[]) => {
    const newRequests: TransportRequest[] = importedRequests.map((req, index) => ({
      ...req,
      id: `REQ${String(requests.length + index + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    }));
    
    // Save to Supabase - Include ALL fields
    try {
      for (const req of importedRequests) {
        const supabaseData = {
          // Basic Info
          date: req.date,
          bill_number: req.billNumber,
          customer_name: req.customerName,
          company_name: req.companyName,
          phone_number: req.phoneNumber,
          
          // Transport Details
          party_name: req.partyName,
          broker_name: req.brokerName,
          pickup_location: req.pickupLocation,
          delivery_location: req.dropLocation,
          port_name: req.portName,
          
          // Container & Vehicle
          container_type: req.containerType,
          vehicle_number: req.vehicleNumber,
          container_number: req.containerNumber,
          load_weight: req.loadWeight,
          cargo_description: req.cargoDescription,
          
          // Financial
          parking_charges: req.parkingCharges,
          freight_amount: req.freightAmount,
          truck_freight: req.truckFreight,
          company_margin: req.companyMargin,
          advance_payment: req.advancePayment,
          balance_payment: req.balancePayment,
          payment_mode: req.paymentMode,
          
          // Status & Notes
          status: req.status,
          special_instructions: req.notes,
          pickup_date: req.serviceDate || req.date,
          delivery_date: req.serviceDate || null,
          added_by: req.addedBy,
        };
        await api.createRequest(supabaseData);
      }
      toast.success('Bulk import saved to database!');
    } catch (error) {
      console.error('Failed to bulk import to Supabase:', error);
      toast.warning('Import saved locally (database sync failed)');
    }
    
    setRequests([...newRequests, ...requests]);
    
    // Add notification
    setNotifications([
      {
        id: String(Date.now()),
        message: `Bulk import of ${importedRequests.length} transport requests completed`,
        time: 'Just now',
        read: false,
        type: 'admin_action',
      },
      ...notifications,
    ]);
  };

  const updateRequestStatus = async (id: string, status: TransportRequest['status']) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
    
    // Update in Supabase
    try {
      await api.updateRequest(id, { status });
    } catch (error) {
      console.warn('Failed to update status in Supabase:', error);
    }
    
    // Add notification
    setNotifications([
      {
        id: String(Date.now()),
        message: `Request ${id} status updated to ${status}`,
        time: 'Just now',
        read: false,
        type: 'status_update',
        requestId: id,
      },
      ...notifications,
    ]);
  };

  const updateRequest = async (id: string, request: Partial<TransportRequest>) => {
    setRequests(requests.map(req => req.id === id ? { ...req, ...request } : req));
    
    // Update in Supabase
    try {
      await api.updateRequest(id, toSnakeCase(request));
    } catch (error) {
      console.warn('Failed to update request in Supabase:', error);
    }
    
    // Add notification
    setNotifications([
      {
        id: String(Date.now()),
        message: `Request ${id} updated`,
        time: 'Just now',
        read: false,
        type: 'admin_action',
      },
      ...notifications,
    ]);
  };

  const deleteRequest = async (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
    
    // Delete from Supabase
    try {
      await api.deleteRequest(id);
    } catch (error) {
      console.warn('Failed to delete request from Supabase:', error);
    }
    
    // Add notification
    setNotifications([
      {
        id: String(Date.now()),
        message: `Request ${id} deleted`,
        time: 'Just now',
        read: false,
        type: 'admin_action',
      },
      ...notifications,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        addWorker,
        darkMode,
        toggleDarkMode,
        requests,
        workers,
        addRequest,
        bulkImportRequests,
        updateRequestStatus,
        updateRequest,
        deleteRequest,
        notifications,
        markNotificationRead,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
