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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Employee Registration Form</CardTitle>
          <CardDescription className="text-center text-blue-100">
            Please fill in all the required information below
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="focus:border-blue-500"
                maxLength={100}
              />
            </div>

            {/* Age and Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-semibold text-gray-700">
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                  className="focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-semibold text-gray-700">
                  Salary (₹) *
                </Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Enter salary amount"
                  min="1"
                  step="1"
                  className="focus:border-blue-500"
                />
              </div>
            </div>

            {/* Work Description */}
            <div className="space-y-2">
              <Label htmlFor="workEmployedToDo" className="text-sm font-semibold text-gray-700">
                Work/Job Description *
              </Label>
              <Textarea
                id="workEmployedToDo"
                placeholder="Describe the work you are employed to do (minimum 10 characters)"
                rows={4}
                maxLength={500}
                className="focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 ml-auto">
                  0/500 characters
                </p>
              </div>
            </div>

            {/* Aadhar and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="aadharNumber" className="text-sm font-semibold text-gray-700">
                  Aadhar Card Number *
                </Label>
                <Input
                  id="aadharNumber"
                  type="text"
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength={12}
                  className="focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className="focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Gender *</Label>
              <RadioGroup
                className="flex flex-row space-x-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Marital Status *</Label>
              <Select>
                <SelectTrigger className="focus:border-blue-500">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="has-family">Has Family (Unmarried)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-3 text-lg font-semibold" 
              >
                Submit Registration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeFormUI;
