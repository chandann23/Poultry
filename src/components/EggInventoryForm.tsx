'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useCreateEgg, 
  useUpdateEgg, 
  useEgg, 
  type CreateEggInventoryData,
  type UpdateEggInventoryData 
} from '@/hooks/useEggs';

// Validation schema
const eggInventorySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  crack_eggs: z.number().min(0, 'Crack eggs must be 0 or greater'),
  jumbo_eggs: z.number().min(0, 'Jumbo eggs must be 0 or greater'),
  normal_eggs: z.number().min(0, 'Normal eggs must be 0 or greater'),
});

type EggInventoryFormData = z.infer<typeof eggInventorySchema>;

interface EggInventoryFormProps {
  editId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EggInventoryForm: React.FC<EggInventoryFormProps> = ({
  editId,
  onSuccess,
  onCancel,
}) => {
  const isEditing = Boolean(editId);
  const [totalEggs, setTotalEggs] = useState(0);
  
  // Hooks
  const createMutation = useCreateEgg();
  const updateMutation = useUpdateEgg();
  const { data: editData, isLoading: isLoadingEdit } = useEgg(editId || '');
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<EggInventoryFormData>({
    resolver: zodResolver(eggInventorySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      crack_eggs: 0,
      jumbo_eggs: 0,
      normal_eggs: 0,
    },
  });

  // Watch form values for total calculation
  const crackEggs = watch('crack_eggs');
  const jumboEggs = watch('jumbo_eggs');
  const normalEggs = watch('normal_eggs');

  // Calculate total eggs
  useEffect(() => {
    const total = (crackEggs || 0) + (jumboEggs || 0) + (normalEggs || 0);
    setTotalEggs(total);
  }, [crackEggs, jumboEggs, normalEggs]);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && editData?.inventory) {
      const inventory = editData.inventory;
      reset({
        date: new Date(inventory.date).toISOString().split('T')[0],
        crack_eggs: inventory.crack_eggs,
        jumbo_eggs: inventory.jumbo_eggs,
        normal_eggs: inventory.normal_eggs,
      });
    }
  }, [editData, isEditing, reset]);

  // Form submission
  const onSubmit = async (data: EggInventoryFormData) => {
    try {
      if (isEditing && editId) {
        await updateMutation.mutateAsync({
          id: editId,
          data: data as UpdateEggInventoryData,
        });
      } else {
        await createMutation.mutateAsync(data as CreateEggInventoryData);
      }
      
      if (!isEditing) {
        reset();
        setTotalEggs(0);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (!isEditing) {
      reset();
      setTotalEggs(0);
    }
    onCancel?.();
  };

  if (isEditing && isLoadingEdit) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Egg Inventory' : 'Add New Egg Inventory'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update the egg inventory record' : 'Enter the daily egg inventory data'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Egg Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crack Eggs */}
          <div>
            <label htmlFor="crack_eggs" className="block text-sm font-medium text-gray-700 mb-2">
              Crack Eggs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="crack_eggs"
              min="0"
              {...register('crack_eggs', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.crack_eggs && (
              <p className="text-red-500 text-sm mt-1">{errors.crack_eggs.message}</p>
            )}
          </div>

          {/* Jumbo Eggs */}
          <div>
            <label htmlFor="jumbo_eggs" className="block text-sm font-medium text-gray-700 mb-2">
              Jumbo Eggs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="jumbo_eggs"
              min="0"
              {...register('jumbo_eggs', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.jumbo_eggs && (
              <p className="text-red-500 text-sm mt-1">{errors.jumbo_eggs.message}</p>
            )}
          </div>

          {/* Normal Eggs */}
          <div>
            <label htmlFor="normal_eggs" className="block text-sm font-medium text-gray-700 mb-2">
              Normal Eggs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="normal_eggs"
              min="0"
              {...register('normal_eggs', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.normal_eggs && (
              <p className="text-red-500 text-sm mt-1">{errors.normal_eggs.message}</p>
            )}
          </div>
        </div>

        {/* Total Eggs Display */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Eggs:</span>
            <span className="text-lg font-bold text-blue-600">{totalEggs}</span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEditing ? 'Update Inventory' : 'Create Inventory'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EggInventoryForm;
