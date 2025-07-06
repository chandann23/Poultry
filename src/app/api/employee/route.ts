import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const employeeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long'),
  age: z.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  maritalStatus: z.enum(['BACHELOR', 'MARRIED', 'HAS_FAMILY']),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  salary: z.number().min(1, 'Salary must be greater than 0'),
  workEmployedToDo: z.string().min(10, 'Job description must be at least 10 characters').max(1000, 'Job description too long'),
});

const updateEmployeeSchema = employeeSchema.partial();

// GET - Fetch all employees or single employee
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    if (id) {
      // Get single employee
      const employee = await prisma.employee.findUnique({
        where: { id },
      });
      
      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ employee });
    }
    
    // Get all employees with pagination and search
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' as const } },
        { phoneNumber: { contains: search } },
        { aadharNumber: { contains: search } },
      ]
    } : {};
    
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where })
    ]);
    
    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = employeeSchema.parse(body);
    
    // Check if Aadhar number already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { aadharNumber: validatedData.aadharNumber }
    });
    
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this Aadhar number already exists' },
        { status: 400 }
      );
    }
    
    // Create employee
    const employee = await prisma.employee.create({
      data: validatedData,
    });
    
    return NextResponse.json(
      { message: 'Employee created successfully', employee },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update employee
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = updateEmployeeSchema.parse(body);
    
    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    });
    
    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Check if Aadhar number already exists (if being updated)
    if (validatedData.aadharNumber && validatedData.aadharNumber !== existingEmployee.aadharNumber) {
      const aadharExists = await prisma.employee.findUnique({
        where: { aadharNumber: validatedData.aadharNumber }
      });
      
      if (aadharExists) {
        return NextResponse.json(
          { error: 'Employee with this Aadhar number already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update employee
    const employee = await prisma.employee.update({
      where: { id },
      data: validatedData,
    });
    
    return NextResponse.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('PUT Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    });
    
    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Delete employee
    await prisma.employee.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
