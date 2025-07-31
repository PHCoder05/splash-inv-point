// Database types for AquaManager
// Generated to match the Supabase database schema

export type TransactionType = 'purchase' | 'issue' | 'return' | 'adjustment';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Product {
  id: string;
  description: string;
  vendor_id: string;
  category_id: string;
  unit: string;
  rate: number;
  quantity: number;
  min_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vendor?: Vendor;
  category?: Category;
}

export interface ProductStockStatus {
  id: string;
  description: string;
  quantity: number;
  min_stock: number;
  unit: string;
  rate: number;
  stock_status: StockStatus;
  category: string;
  vendor: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: TransactionType;
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  transaction_date: string;
  vendor_id?: string;
  person_id?: string;
  department_id?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
  product?: Product;
  vendor?: Vendor;
  person?: Person;
  department?: Department;
}

export interface UsageRecord {
  id: string;
  product_id: string;
  quantity: number;
  person_id?: string;
  department_id?: string;
  usage_date: string;
  purpose?: string;
  created_at: string;
  product?: Product;
  person?: Person;
  department?: Department;
}

// Form types for creating/updating records
export interface CreateProductForm {
  description: string;
  vendor_id: string | null;
  category_id: string;
  unit: string;
  rate: number;
  quantity: number;
  min_stock: number;
}

export interface CreateUsageRecordForm {
  product_id: string;
  quantity: number;
  person_id: string | null;
  department_id: string | null;
  usage_date: string;
  purpose?: string;
}

export interface CreateInventoryTransactionForm {
  product_id: string;
  transaction_type: TransactionType;
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  transaction_date: string;
  vendor_id?: string | null;
  person_id?: string | null;
  department_id?: string | null;
  reference_number?: string;
  notes?: string;
}

// Dashboard statistics types
export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  todayOrders: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  item: string;
  qty: string;
  time: string;
  type: 'add' | 'remove';
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 