/** Map PostgREST rows (snake_case) to app shapes (camelCase). */

export interface WorkerRow {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  /** RBAC: admin | worker */
  role: string;
  status?: string | null;
  total_entries?: number | null;
  created_at?: string | null;
  job_title?: string | null;
}

export interface AppWorker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  totalEntries: number;
  joinedDate: string;
  rbacRole?: 'admin' | 'worker';
}

export function mapWorkerFromDb(row: WorkerRow): AppWorker {
  const status = row.status ?? 'active';
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    phoneNumber: row.phone ?? undefined,
    role: row.job_title?.trim() ? row.job_title : row.role,
    rbacRole: row.role === 'admin' || row.role === 'worker' ? row.role : 'worker',
    isActive: status === 'active',
    totalEntries: row.total_entries ?? 0,
    joinedDate: row.created_at ?? new Date().toISOString(),
  };
}

/** Admin "Add worker" form → DB row (role must stay admin|worker for CHECK constraint). */
export function mapWorkerFormToDb(input: {
  name: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  /** Job title / department label from UI (stored in job_title when column exists). */
  role?: string;
  jobTitle?: string;
}): Record<string, unknown> {
  const jobTitle = (input.jobTitle ?? input.role ?? '').trim() || null;
  return {
    email: input.email.trim(),
    name: input.name.trim(),
    phone: (input.phoneNumber ?? input.phone ?? '').trim() || null,
    role: 'worker',
    status: 'active',
    ...(jobTitle ? { job_title: jobTitle } : {}),
  };
}

export function mapTransportRequestFromDb(row: Record<string, unknown>): Record<string, unknown> {
  const pickup = (row.pickup_date as string | undefined) ?? (row.date as string | undefined);
  return {
    id: row.id,
    date: row.date,
    billNumber: row.bill_number,
    customerName: row.customer_name,
    companyName: row.company_name,
    phoneNumber: row.phone_number,
    email: row.email,
    partyName: row.party_name,
    brokerName: row.broker_name,
    pickupLocation: row.pickup_location,
    dropLocation: row.delivery_location,
    portName: row.port_name,
    containerType: row.container_type,
    vehicleNumber: row.vehicle_number,
    containerNumber: row.container_number,
    loadWeight: row.load_weight,
    cargoDescription: row.cargo_description,
    pickupDate: row.pickup_date,
    deliveryDate: row.delivery_date,
    serviceDate: pickup,
    parkingCharges: row.parking_charges,
    freightAmount: row.freight_amount,
    truckFreight: row.truck_freight,
    companyMargin: row.company_margin,
    advancePayment: row.advance_payment,
    balancePayment: row.balance_payment,
    paymentMode: row.payment_mode,
    notes: row.special_instructions,
    status: row.status,
    addedBy: row.added_by,
    assignedWorkerId: row.assigned_worker_id,
    createdAt: row.created_at,
  };
}

export function mapTransportRequestFormToDb(
  form: Record<string, unknown>,
  addedBy: string,
): Record<string, unknown> {
  const pickupDate = (form.serviceDate as string) || (form.date as string);
  if (!pickupDate) {
    throw new Error('Service date is required');
  }
  return {
    date: form.date || pickupDate || null,
    bill_number: form.billNumber ?? null,
    customer_name: form.customerName,
    company_name: form.companyName || null,
    phone_number: form.phoneNumber,
    email: form.email || null,
    party_name: form.partyName || null,
    broker_name: form.brokerName || null,
    pickup_location: form.pickupLocation,
    delivery_location: form.dropLocation,
    port_name: form.portName || null,
    container_type: form.containerType,
    vehicle_number: form.vehicleNumber || null,
    container_number: form.containerNumber || null,
    load_weight: form.loadWeight || null,
    cargo_description: form.cargoDescription || null,
    pickup_date: pickupDate,
    delivery_date: form.deliveryDate || null,
    parking_charges: form.parkingCharges ?? 0,
    freight_amount: form.freightAmount ?? 0,
    truck_freight: form.truckFreight ?? 0,
    company_margin: form.companyMargin ?? 0,
    advance_payment: form.advancePayment ?? 0,
    balance_payment: form.balancePayment ?? 0,
    payment_mode: form.paymentMode || 'Cash',
    special_instructions: form.notes || null,
    status: 'Pending',
    added_by: addedBy || (form.addedBy as string) || null,
  };
}
