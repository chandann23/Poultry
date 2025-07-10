import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast'; // or your preferred toast library

// Types
export interface EggInventory {
  id: string;
  date: Date;
  crack_eggs: number;
  jumbo_eggs: number;
  normal_eggs: number;
  total_eggs: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEggInventoryData {
  date: string;
  crack_eggs: number;
  jumbo_eggs: number;
  normal_eggs: number;
}

export interface UpdateEggInventoryData {
  date?: string;
  crack_eggs?: number;
  jumbo_eggs?: number;
  normal_eggs?: number;
}

export interface EggInventoryResponse {
  inventories: EggInventory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseEggsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

// API functions
const eggInventoryApi = {
  // Get all inventories
  getAll: async (params: UseEggsParams = {}): Promise<EggInventoryResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    
    const response = await fetch(`/api/egg-inventory?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch egg inventories');
    }
    return response.json();
  },

  // Get single inventory
  getById: async (id: string): Promise<{ inventory: EggInventory }> => {
    const response = await fetch(`/api/egg-inventory?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch egg inventory');
    }
    return response.json();
  },

  // Create inventory
  create: async (data: CreateEggInventoryData): Promise<{ inventory: EggInventory }> => {
    const response = await fetch('/api/egg-inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create egg inventory');
    }
    return response.json();
  },

  // Update inventory
  update: async (id: string, data: UpdateEggInventoryData): Promise<{ inventory: EggInventory }> => {
    const response = await fetch(`/api/egg-inventory?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update egg inventory');
    }
    return response.json();
  },

  // Delete inventory
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/egg-inventory?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete egg inventory');
    }
  },
};

// Custom hooks
export const useEggs = (params: UseEggsParams = {}) => {
  return useQuery({
    queryKey: ['egg-inventories', params],
    queryFn: () => eggInventoryApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEgg = (id: string) => {
  return useQuery({
    queryKey: ['egg-inventory', id],
    queryFn: () => eggInventoryApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateEgg = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eggInventoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['egg-inventories'] });
      toast.success('Egg inventory created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEgg = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEggInventoryData }) =>
      eggInventoryApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['egg-inventories'] });
      queryClient.invalidateQueries({ queryKey: ['egg-inventory', id] });
      toast.success('Egg inventory updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteEgg = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eggInventoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['egg-inventories'] });
      toast.success('Egg inventory deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
