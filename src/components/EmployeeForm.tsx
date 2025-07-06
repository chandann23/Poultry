
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const EmployeeFormUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Employee Registration
            </CardTitle>
            <CardDescription className="text-blue-100/90">
              Fill in the details to register a new employee
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form className="space-y-6">
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
                      type="text"
                      placeholder="John Doe"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-700">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="28"
                      min="18"
                      max="100"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" className="text-blue-600" />
                        <Label htmlFor="male" className="cursor-pointer font-normal">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" className="text-blue-600" />
                        <Label htmlFor="female" className="cursor-pointer font-normal">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" className="text-blue-600" />
                        <Label htmlFor="other" className="cursor-pointer font-normal">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus" className="text-gray-700">
                      Marital Status <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="focus-visible:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="has-family">Has Family (Unmarried)</SelectItem>
                      </SelectContent>
                    </Select>
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
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      className="focus-visible:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber" className="text-gray-700">
                      Aadhar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="aadharNumber"
                      type="text"
                      placeholder="1234 5678 9012"
                      maxLength={12}
                      className="focus-visible:ring-blue-500 font-mono"
                    />
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
                      placeholder="35000"
                      min="1"
                      step="1"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workEmployedToDo" className="text-gray-700">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="workEmployedToDo"
                    placeholder="Describe the employee's role and responsibilities..."
                    rows={4}
                    className="focus-visible:ring-blue-500 min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500 text-right">
                    Minimum 10 characters required
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
              >
                Register Employee
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeFormUI;
