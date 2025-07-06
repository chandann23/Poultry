import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // or your preferred toast library

// Types
export interface Employee {
  id: string;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: 'BACHELOR' | 'MARRIED' | 'HAS_FAMILY';
  phoneNumber: string;
  aadharNumber: string;
  salary: number;
  workEmployedToDo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: 'BACHELOR' | 'MARRIED' | 'HAS_FAMILY';
  phoneNumber: string;
  aadharNumber: string;
  salary: number;
  workEmployedToDo: string;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}

export interface EmployeeListResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmployeeResponse {
  employee: Employee;
}

// API Functions
const employeeApi = {
  // Get all employees with pagination and search
  getEmployees: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<EmployeeListResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const response = await fetch(`/api/employee?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return response.json();
  },

  // Get single employee
  getEmployee: async (id: string): Promise<EmployeeResponse> => {
    const response = await fetch(`/api/employee?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }
    return response.json();
  },

  // Create new employee
  createEmployee: async (data: CreateEmployeeData): Promise<{ message: string; employee: Employee }> => {
    const response = await fetch('/api/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create employee');
    }

    return response.json();
  },

  // Update employee
  updateEmployee: async (id: string, data: UpdateEmployeeData): Promise<{ message: string; employee: Employee }> => {
    const response = await fetch(`/api/employee?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update employee');
    }

    return response.json();
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/employee?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete employee');
    }

    return response.json();
  },
};

// Query Keys
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: { page?: number; limit?: number; search?: string }) => 
    [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

// Custom Hooks

// Get all employees with pagination and search
export const useEmployees = (params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeApi.getEmployees(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single employee
export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getEmployee(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create employee mutation
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: (data) => {
      // Invalidate and refetch employee lists
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });
      
      // Add the new employee to the cache
      queryClient.setQueryData(
        employeeKeys.detail(data.employee.id),
        { employee: data.employee }
      );

      toast.success('Employee created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create employee');
    },
  });
};

// Update employee mutation
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeData }) =>
      employeeApi.updateEmployee(id, data),
    onSuccess: (data, variables) => {
      // Update the employee detail cache
      queryClient.setQueryData(
        employeeKeys.detail(variables.id),
        { employee: data.employee }
      );

      // Invalidate employee lists to reflect changes
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });

      toast.success('Employee updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update employee');
    },
  });
};

// Delete employee mutation
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: (data, employeeId) => {
      // Remove the employee from cache
      queryClient.removeQueries({
        queryKey: employeeKeys.detail(employeeId),
      });

      // Invalidate employee lists
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });

      toast.success('Employee deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete employee');
    },
  });
};

// Bulk operations
export const useDeleteEmployees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeIds: string[]) => {
      const promises = employeeIds.map(id => employeeApi.deleteEmployee(id));
      return Promise.all(promises);
    },
    onSuccess: (data, employeeIds) => {
      // Remove employees from cache
      employeeIds.forEach(id => {
        queryClient.removeQueries({
          queryKey: employeeKeys.detail(id),
        });
      });

      // Invalidate employee lists
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });

      toast.success(`${employeeIds.length} employees deleted successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete employees');
    },
  });
};

// Prefetch employee data
export const usePrefetchEmployee = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: employeeKeys.detail(id),
      queryFn: () => employeeApi.getEmployee(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Optimistic updates helper
export const useOptimisticEmployeeUpdate = () => {
  const queryClient = useQueryClient();

  return {
    // Optimistically update employee in list
    updateEmployeeInList: (employeeId: string, updatedData: Partial<Employee>) => {
      queryClient.setQueriesData(
        { queryKey: employeeKeys.lists() },
        (oldData: EmployeeListResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            employees: oldData.employees.map(employee =>
              employee.id === employeeId
                ? { ...employee, ...updatedData }
                : employee
            ),
          };
        }
      );
    },

    // Optimistically remove employee from list
    removeEmployeeFromList: (employeeId: string) => {
      queryClient.setQueriesData(
        { queryKey: employeeKeys.lists() },
        (oldData: EmployeeListResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            employees: oldData.employees.filter(employee => employee.id !== employeeId),
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total - 1,
            },
          };
        }
      );
    },
  };
};
