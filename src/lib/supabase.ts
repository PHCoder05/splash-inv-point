import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These environment variables should be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations

export const db = {
  // Products
  products: {
    getAll: () => supabase
      .from('products')
      .select(`
        *,
        vendor: vendors(*),
        category: categories(*)
      `)
      .eq('is_active', true)
      .order('description'),

    getById: (id: string) => supabase
      .from('products')
      .select(`
        *,
        vendor: vendors(*),
        category: categories(*)
      `)
      .eq('id', id)
      .single(),

    create: (data: any) => supabase
      .from('products')
      .insert(data)
      .select()
      .single(),

    update: (id: string, data: any) => supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

    delete: (id: string) => supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id),

    getStockStatus: () => supabase
      .from('product_stock_status')
      .select('*')
      .order('description'),
  },

  // Categories
  categories: {
    getAll: () => supabase
      .from('categories')
      .select('*')
      .order('name'),

    create: (data: any) => supabase
      .from('categories')
      .insert(data)
      .select()
      .single(),
  },

  // Vendors
  vendors: {
    getAll: () => supabase
      .from('vendors')
      .select('*')
      .order('name'),

    create: (data: any) => supabase
      .from('vendors')
      .insert(data)
      .select()
      .single(),
  },

  // Departments
  departments: {
    getAll: () => supabase
      .from('departments')
      .select('*')
      .order('name'),
  },

  // People
  people: {
    getAll: () => supabase
      .from('people')
      .select(`
        *,
        department: departments(*)
      `)
      .order('name'),

    create: (data: {
      name: string;
      email?: string | null;
      phone?: string | null;
      department_id?: string | null;
      is_active?: boolean;
    }) =>
      supabase
        .from('people')
        .insert({
          name: data.name,
          email: data.email ?? null,
          phone: data.phone ?? null,
          department_id: data.department_id ?? null,
          is_active: data.is_active ?? true,
        })
        .select()
        .single(),

    update: (
      id: string,
      data: Partial<{
        name: string;
        email: string | null;
        phone: string | null;
        department_id: string | null;
        is_active: boolean;
      }>
    ) =>
      supabase
        .from('people')
        .update(data)
        .eq('id', id)
        .select()
        .single(),

    setActive: (id: string, isActive: boolean) =>
      supabase
        .from('people')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single(),

    delete: (id: string) =>
      supabase
        .from('people')
        .delete()
        .eq('id', id),
  },

  // Inventory Transactions
  inventoryTransactions: {
    getAll: () => supabase
      .from('inventory_transactions')
      .select(`
        *,
        product: products(*),
        vendor: vendors(*),
        person: people(*),
        department: departments(*)
      `)
      .order('transaction_date', { ascending: false }),

    create: (data: any) => supabase
      .from('inventory_transactions')
      .insert(data)
      .select()
      .single(),

    update: (id: string, data: any) => supabase
      .from('inventory_transactions')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

    delete: (id: string) => supabase
      .from('inventory_transactions')
      .delete()
      .eq('id', id),

    getByDateRange: (startDate: string, endDate: string) => supabase
      .from('inventory_transactions')
      .select(`
        *,
        product: products(*),
        vendor: vendors(*),
        person: people(*),
        department: departments(*)
      `)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: false }),
  },

  // Usage Records
  usageRecords: {
    getAll: () => supabase
      .from('usage_records')
      .select(`
        *,
        product: products(*),
        person: people(*),
        department: departments(*)
      `)
      .order('usage_date', { ascending: false }),

    create: (data: any) => supabase
      .from('usage_records')
      .insert(data)
      .select()
      .single(),

    update: (id: string, data: any) => supabase
      .from('usage_records')
      .update(data)
      .eq('id', id)
      .select()
      .single(),

    delete: (id: string) => supabase
      .from('usage_records')
      .delete()
      .eq('id', id),

    getByDateRange: (startDate: string, endDate: string) => supabase
      .from('usage_records')
      .select(`
        *,
        product: products(*),
        person: people(*),
        department: departments(*)
      `)
      .gte('usage_date', startDate)
      .lte('usage_date', endDate)
      .order('usage_date', { ascending: false }),

    getByPerson: (personId: string) => supabase
      .from('usage_records')
      .select(`
        *,
        product: products(*),
        person: people(*),
        department: departments(*)
      `)
      .eq('person_id', personId)
      .order('usage_date', { ascending: false }),

    getByDepartment: (departmentId: string) => supabase
      .from('usage_records')
      .select(`
        *,
        product: products(*),
        person: people(*),
        department: departments(*)
      `)
      .eq('department_id', departmentId)
      .order('usage_date', { ascending: false }),
  },

  // Dashboard statistics
  dashboard: {
    getStats: async () => {
      const [productsResult, stockStatusResult, todayTransactionsResult] = await Promise.all([
        supabase.from('products').select('id').eq('is_active', true),
        supabase.from('product_stock_status').select('id').eq('stock_status', 'low_stock'),
        supabase.from('inventory_transactions')
          .select('id, total_amount')
          .eq('transaction_date', new Date().toISOString().split('T')[0])
      ]);

      const totalProducts = productsResult.data?.length || 0;
      const lowStockItems = stockStatusResult.data?.length || 0;
      const todayOrders = todayTransactionsResult.data?.length || 0;
      const revenue = todayTransactionsResult.data?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;

      return {
        totalProducts,
        lowStockItems,
        todayOrders,
        revenue
      };
    },

    getRecentActivity: () => supabase
      .from('inventory_transactions')
      .select(`
        id,
        transaction_type,
        quantity,
        transaction_date,
        product:products (description)
      `)
      .order('created_at', { ascending: false })
      .limit(10),
  },
}; 