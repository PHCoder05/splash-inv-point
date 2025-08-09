import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { 
  Product, 
  Category, 
  Vendor, 
  Department, 
  Person, 
  UsageRecord, 
  InventoryTransaction,
  CreateProductForm,
  CreateUsageRecordForm,
  CreateInventoryTransactionForm
} from '@/types/database';

// Products hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await db.products.getAll();
      if (error) throw error;
      return data;
    }
  });
};

export const useProductStockStatus = () => {
  return useQuery({
    queryKey: ['product-stock-status'],
    queryFn: async () => {
      const { data, error } = await db.products.getStockStatus();
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productData: CreateProductForm) => {
      const { data, error } = await db.products.create(productData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Product created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProductForm> }) => {
      const { data: result, error } = await db.products.update(id, data);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive"
      });
    }
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await db.categories.getAll();
      if (error) throw error;
      return data;
    }
  });
};

// Vendors hooks
export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await db.vendors.getAll();
      if (error) throw error;
      return data;
    }
  });
};

// Departments hooks
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await db.departments.getAll();
      if (error) throw error;
      return data;
    }
  });
};

// People hooks
export const usePeople = () => {
  return useQuery({
    queryKey: ['people'],
    queryFn: async () => {
      const { data, error } = await db.people.getAll();
      if (error) throw error;
      return data;
    }
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (person: { name: string; email?: string | null; phone?: string | null; department_id?: string | null; is_active?: boolean }) => {
      const { data, error } = await db.people.create(person);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({ title: 'Success', description: 'Staff member added successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to add staff member', variant: 'destructive' });
    }
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ name: string; email: string | null; phone: string | null; department_id: string | null; is_active: boolean }> }) => {
      const { data: result, error } = await db.people.update(id, data);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({ title: 'Success', description: 'Staff member updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update staff member', variant: 'destructive' });
    }
  });
};

export const useSetPersonActive = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await db.people.setActive(id, isActive);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({ title: 'Success', description: 'Staff status updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update staff status', variant: 'destructive' });
    }
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.people.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast({ title: 'Success', description: 'Staff member deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete staff member', variant: 'destructive' });
    }
  });
};

// Inventory Transactions hooks
export const useInventoryTransactions = () => {
  return useQuery({
    queryKey: ['inventory-transactions'],
    queryFn: async () => {
      const { data, error } = await db.inventoryTransactions.getAll();
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateInventoryTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transactionData: CreateInventoryTransactionForm) => {
      const { data, error } = await db.inventoryTransactions.create(transactionData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Transaction recorded successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record transaction",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateInventoryTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateInventoryTransactionForm> }) => {
      const { data: result, error } = await db.inventoryTransactions.update(id, data);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Transaction updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteInventoryTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.inventoryTransactions.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive"
      });
    }
  });
};

// Usage Records hooks
export const useUsageRecords = () => {
  return useQuery({
    queryKey: ['usage-records'],
    queryFn: async () => {
      const { data, error } = await db.usageRecords.getAll();
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateUsageRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (usageData: CreateUsageRecordForm) => {
      const { data, error } = await db.usageRecords.create(usageData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-records'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Usage recorded successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record usage",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateUsageRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateUsageRecordForm> }) => {
      const { data: result, error } = await db.usageRecords.update(id, data);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-records'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Usage record updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update usage record",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteUsageRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.usageRecords.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-records'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Usage record deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete usage record",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.products.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock-status'] });
      toast({
        title: "Success",
        description: "Product deactivated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate product",
        variant: "destructive"
      });
    }
  });
};

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const stats = await db.dashboard.getStats();
      return stats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await db.dashboard.getRecentActivity();
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });
}; 