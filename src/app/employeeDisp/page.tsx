"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  User, 
  Phone, 
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { useEmployees, useDeleteEmployee, type Employee } from '@/hooks/useEmployee';
import EmployeeForm from '@/components/EmployeeForm';

const EmployeeList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const limit = 10;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useEmployees({ page, limit, search });

  const deleteEmployee = useDeleteEmployee();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleDelete = async (employeeId: string) => {
    try {
      await deleteEmployee.mutateAsync(employeeId);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
    refetch();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGenderBadge = (gender: string) => {
    const colors = {
      MALE: 'bg-blue-100 text-blue-800',
      FEMALE: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[gender as keyof typeof colors] || colors.OTHER;
  };

  const getMaritalStatusBadge = (status: string) => {
    const colors = {
      BACHELOR: 'bg-green-100 text-green-800',
      MARRIED: 'bg-purple-100 text-purple-800',
      HAS_FAMILY: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || colors.BACHELOR;
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Employees</h2>
              <p className="text-gray-600 mb-4">
                {error?.message || 'Something went wrong'}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Employee Management
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Manage your employee records
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode 
                        ? 'Update the employee information below.' 
                        : 'Fill in the details to add a new employee.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <EmployeeForm 
                    employee={selectedEmployee || undefined}
                    onSuccess={handleFormSuccess}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading employees...</span>
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Employee</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Personal Info</TableHead>
                      <TableHead className="font-semibold">Employment</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.employees?.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {employee.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {employee.id.slice(0, 8)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="mr-1 h-3 w-3 text-gray-400" />
                              {employee.phoneNumber}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <CreditCard className="mr-1 h-3 w-3 text-gray-400" />
                              {employee.aadharNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getGenderBadge(employee.gender)}>
                                {employee.gender}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Age {employee.age}
                              </span>
                            </div>
                            <Badge className={getMaritalStatusBadge(employee.maritalStatus)}>
                              {employee.maritalStatus.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <IndianRupee className="mr-1 h-3 w-3 text-green-600" />
                              {formatCurrency(employee.salary)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined: {formatDate(employee.createdAt)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(employee)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {employee.fullName}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(employee.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteEmployee.isPending}
                                  >
                                    {deleteEmployee.isPending ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      'Delete'
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data?.pagination && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} employees
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1 || isFetching}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
                        .filter(pageNum => {
                          const start = Math.max(1, page - 2);
                          const end = Math.min(data.pagination.totalPages, page + 2);
                          return pageNum >= start && pageNum <= end;
                        })
                        .map(pageNum => (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            disabled={isFetching}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.totalPages || isFetching}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;
