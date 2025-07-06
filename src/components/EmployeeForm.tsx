"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { Employee, useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployee';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long'),
  age: z.coerce.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: 'Please select a gender',
  }),
  maritalStatus: z.enum(['BACHELOR', 'MARRIED', 'HAS_FAMILY'], {
    required_error: 'Please select marital status',
  }),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  salary: z.coerce.number().min(1, 'Salary must be greater than 0'),
  workEmployedToDo: z.string().min(10, 'Job description must be at least 10 characters').max(1000, 'Job description too long'),
});

type FormData = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSuccess }) => {
  const isEditing = !!employee;
  
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: employee ? {
      fullName: employee.fullName,
      age: employee.age,
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,
      phoneNumber: employee.phoneNumber,
      aadharNumber: employee.aadharNumber,
      salary: employee.salary,
      workEmployedToDo: employee.workEmployedToDo,
    } : {
      fullName: '',
      age: 18,
      gender: 'MALE',
      maritalStatus: 'BACHELOR',
      phoneNumber: '',
      aadharNumber: '',
      salary: 0,
      workEmployedToDo: '',
    },
  });

  const watchedGender = watch('gender');
  const watchedMaritalStatus = watch('maritalStatus');

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          data,
        });
      } else {
        await createEmployee.mutateAsync(data);
        reset(); // Reset form after successful creation
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createEmployee.isPending || updateEmployee.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Employee' : 'Employee Registration'}
            </CardTitle>
            <CardDescription className="text-blue-100/90">
              {isEditing ? 'Update employee details' : 'Fill in the details to register a new employee'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="John Doe"
                      className="focus-visible:ring-blue-500"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-700">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age')}
                      placeholder="28"
                      min="18"
                      max="100"
                      className="focus-visible:ring-blue-500"
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm">{errors.age.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup 
                      value={watchedGender} 
                      onValueChange={(value) => setValue('gender', value as 'MALE' | 'FEMALE' | 'OTHER')}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MALE" id="male" className="text-blue-600" />
                        <Label htmlFor="male" className="cursor-pointer font-normal">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FEMALE" id="female" className="text-blue-600" />
                        <Label htmlFor="female" className="cursor-pointer font-normal">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OTHER" id="other" className="text-blue-600" />
                        <Label htmlFor="other" className="cursor-pointer font-normal">Other</Label>
                      </div>
                    </RadioGroup>
                    {errors.gender && (
                      <p className="text-red-500 text-sm">{errors.gender.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Marital Status <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={watchedMaritalStatus} 
                      onValueChange={(value) => setValue('maritalStatus', value as 'BACHELOR' | 'MARRIED' | 'HAS_FAMILY')}
                    >
                      <SelectTrigger className="focus-visible:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BACHELOR">Bachelor</SelectItem>
                        <SelectItem value="MARRIED">Married</SelectItem>
                        <SelectItem value="HAS_FAMILY">Has Family (Unmarried)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-sm">{errors.maritalStatus.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      {...register('phoneNumber')}
                      placeholder="9876543210"
                      maxLength={10}
                      className="focus-visible:ring-blue-500 font-mono"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber" className="text-gray-700">
                      Aadhar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="aadharNumber"
                      {...register('aadharNumber')}
                      placeholder="123456789012"
                      maxLength={12}
                      className="focus-visible:ring-blue-500 font-mono"
                    />
                    {errors.aadharNumber && (
                      <p className="text-red-500 text-sm">{errors.aadharNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Employment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-gray-700">
                      Salary (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      {...register('salary')}
                      placeholder="35000"
                      min="1"
                      step="1"
                      className="focus-visible:ring-blue-500"
                    />
                    {errors.salary && (
                      <p className="text-red-500 text-sm">{errors.salary.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workEmployedToDo" className="text-gray-700">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="workEmployedToDo"
                    {...register('workEmployedToDo')}
                    placeholder="Describe the employee's role and responsibilities..."
                    rows={4}
                    className="focus-visible:ring-blue-500 min-h-[120px]"
                  />
                  {errors.workEmployedToDo && (
                    <p className="text-red-500 text-sm">{errors.workEmployedToDo.message}</p>
                  )}
                  <p className="text-xs text-gray-500 text-right">
                    Minimum 10 characters required
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Employee' : 'Register Employee'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm;
