import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all maintenance records with bus details
export async function GET() {
  try {
    // Fetch all maintenance records from database
    // Include related bus information
    const maintenanceRecords = await prisma.maintenance.findMany({
      include: {
        bus: true,  // Include bus details (plateNumber, model, etc.)
      },
      orderBy: { scheduledDate: "desc" },  // Most recent first
    });
    
    return NextResponse.json(maintenanceRecords);
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance records" },
      { status: 500 }
    );
  }
}

// POST - Create new maintenance record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create the maintenance record
    const maintenance = await prisma.maintenance.create({
      data: {
        busId: parseInt(body.busId),
        type: body.type,
        description: body.description,
        scheduledDate: new Date(body.scheduledDate),
        completedDate: body.completedDate ? new Date(body.completedDate) : null,
        cost: parseFloat(body.cost),
        status: body.status,
      },
      include: {
        bus: true,  // Include bus details
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("Error creating maintenance:", error);
    return NextResponse.json(
      { error: "Failed to create maintenance" },
      { status: 500 }
    );
  }
}

// PUT - Update maintenance record
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Update the maintenance record
    const maintenance = await prisma.maintenance.update({
      where: { id: body.id },
      data: {
        busId: parseInt(body.busId),
        type: body.type,
        description: body.description,
        scheduledDate: new Date(body.scheduledDate),
        completedDate: body.completedDate ? new Date(body.completedDate) : null,
        cost: parseFloat(body.cost),
        status: body.status,
      },
      include: {
        bus: true,
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("Error updating maintenance:", error);
    return NextResponse.json(
      { error: "Failed to update maintenance" },
      { status: 500 }
    );
  }
}

// DELETE - Delete maintenance record
export async function DELETE(request: Request) {
  try {
    // Get maintenance ID from URL query parameter (?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validate that ID was provided
    if (!id) {
      return NextResponse.json(
        { error: "Maintenance ID is required" },
        { status: 400 }
      );
    }

    // Delete the maintenance record
    await prisma.maintenance.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Maintenance deleted successfully" });
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    return NextResponse.json(
      { error: "Failed to delete maintenance" },
      { status: 500 }
    );
  }
}