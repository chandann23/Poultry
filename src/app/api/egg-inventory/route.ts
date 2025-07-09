import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const eggInventorySchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  crack_eggs: z.number().int().min(0, 'Crack eggs must be a non-negative integer'),
  jumbo_eggs: z.number().int().min(0, 'Jumbo eggs must be a non-negative integer'),
  normal_eggs: z.number().int().min(0, 'Normal eggs must be a non-negative integer'),
});

const updateEggInventorySchema = eggInventorySchema.partial();

// GET - Fetch all egg inventories or single inventory
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (id) {
      // Get single inventory
      const inventory = await prisma.eggInventory.findUnique({
        where: { id },
      });
      
      if (!inventory) {
        return NextResponse.json(
          { error: 'Inventory not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ inventory });
    }
    
    // Get all inventories with pagination and date filtering
    const skip = (page - 1) * limit;
    const where: any = {};
    
    // Add date filtering if provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }
    
    const [inventories, total] = await Promise.all([
      prisma.eggInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.eggInventory.count({ where })
    ]);
    
    return NextResponse.json({
      inventories,
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

// POST - Create new egg inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = eggInventorySchema.parse(body);
    
    // Calculate total eggs
    const total_eggs = validatedData.crack_eggs + validatedData.jumbo_eggs + validatedData.normal_eggs;
    
    // Check if inventory for this date already exists
    const existingInventory = await prisma.eggInventory.findFirst({
      where: {
        date: new Date(validatedData.date),
      },
    });
    
    if (existingInventory) {
      return NextResponse.json(
        { error: 'Inventory for this date already exists' },
        { status: 400 }
      );
    }
    
    // Create inventory
    const inventory = await prisma.eggInventory.create({
      data: {
        date: new Date(validatedData.date),
        crack_eggs: validatedData.crack_eggs,
        jumbo_eggs: validatedData.jumbo_eggs,
        normal_eggs: validatedData.normal_eggs,
        total_eggs,
      },
    });
    
    return NextResponse.json(
      { message: 'Inventory created successfully', inventory },
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

// PUT - Update egg inventory
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = updateEggInventorySchema.parse(body);
    
    // Check if inventory exists
    const existingInventory = await prisma.eggInventory.findUnique({
      where: { id }
    });
    
    if (!existingInventory) {
      return NextResponse.json(
        { error: 'Inventory not found' },
        { status: 404 }
      );
    }
    
    // Check if date already exists (if being updated)
    if (validatedData.date && validatedData.date !== existingInventory.date.toISOString().split('T')[0]) {
      const dateExists = await prisma.eggInventory.findFirst({
        where: {
          date: new Date(validatedData.date),
          id: { not: id }
        }
      });
      
      if (dateExists) {
        return NextResponse.json(
          { error: 'Inventory for this date already exists' },
          { status: 400 }
        );
      }
    }
    
    // Calculate total eggs if any egg counts are being updated
    let total_eggs = existingInventory.total_eggs;
    if (validatedData.crack_eggs !== undefined || validatedData.jumbo_eggs !== undefined || validatedData.normal_eggs !== undefined) {
      total_eggs = (validatedData.crack_eggs ?? existingInventory.crack_eggs) + 
                   (validatedData.jumbo_eggs ?? existingInventory.jumbo_eggs) + 
                   (validatedData.normal_eggs ?? existingInventory.normal_eggs);
    }
    
    // Update inventory
    const inventory = await prisma.eggInventory.update({
      where: { id },
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
        total_eggs,
      },
    });
    
    return NextResponse.json({
      message: 'Inventory updated successfully',
      inventory
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

// DELETE - Delete egg inventory
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory ID is required' },
        { status: 400 }
      );
    }
    
    // Check if inventory exists
    const existingInventory = await prisma.eggInventory.findUnique({
      where: { id }
    });
    
    if (!existingInventory) {
      return NextResponse.json(
        { error: 'Inventory not found' },
        { status: 404 }
      );
    }
    
    // Delete inventory
    await prisma.eggInventory.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: 'Inventory deleted successfully'
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
