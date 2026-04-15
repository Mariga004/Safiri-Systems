import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all drivers with their assigned buses
export async function GET() {
  try {
    // Fetch all drivers from database
    // Include their bus assignments (from BusDriver table)
    // Also include the bus details for each assignment
    const drivers = await prisma.driver.findMany({
      include: {
        assignments: {  // "assignments" is the relation name in Driver model
          include: {
            bus: true,  // Include full bus details (plateNumber, model, etc.)
          },
        },
      },
      orderBy: { createdAt: "desc" },  // Newest drivers first
    });
    
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}

// POST - Create new driver (with optional bus assignment)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Step 1: Create the driver in the Driver table
    const driver = await prisma.driver.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        licenseNumber: body.licenseNumber,
        licenseClass: body.licenseClass,      
        psvBadgeNumber: body.psvBadgeNumber,
        phone: body.phone,
        status: body.status,
      },
    });

    // Step 2: If a bus was selected in the form, create the assignment
    // Check if assignedBusId exists and is not empty
    if (body.assignedBusId && body.assignedBusId !== "") {
      // Create entry in BusDriver table to link driver to bus
      await prisma.busDriver.create({
        data: {
          driverId: driver.id,  // The driver we just created
          busId: parseInt(body.assignedBusId),  // The selected bus
          status: "active",  // This assignment is active
        },
      });
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json(
      { error: "Failed to create driver" },
      { status: 500 }
    );
  }
}

// PUT - Update driver (and bus assignment)
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Step 1: Update the driver's basic information in Driver table
    const driver = await prisma.driver.update({
      where: { id: body.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        licenseNumber: body.licenseNumber,
        licenseClass: body.licenseClass,      
        psvBadgeNumber: body.psvBadgeNumber,
        phone: body.phone,
        status: body.status,
      },
    });

    // Step 2: Handle bus assignment changes
    // First, mark ALL existing assignments as inactive
    // This ensures only one bus is assigned at a time
    await prisma.busDriver.updateMany({
      where: { driverId: driver.id },
      data: { status: "inactive" },
    });

    // Step 3: If a bus is selected, activate or create that assignment
    if (body.assignedBusId && body.assignedBusId !== "") {
      // Check if this driver-bus combination already exists in BusDriver table
      const existingAssignment = await prisma.busDriver.findFirst({
        where: {
          driverId: driver.id,
          busId: parseInt(body.assignedBusId),
        },
      });

      if (existingAssignment) {
        // Assignment already exists, just reactivate it
        await prisma.busDriver.update({
          where: { id: existingAssignment.id },
          data: { status: "active" },
        });
      } else {
        // Assignment doesn't exist, create a new one
        await prisma.busDriver.create({
          data: {
            driverId: driver.id,
            busId: parseInt(body.assignedBusId),
            status: "active",
          },
        });
      }
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("Error updating driver:", error);
    return NextResponse.json(
      { error: "Failed to update driver" },
      { status: 500 }
    );
  }
}

// DELETE - Delete driver
export async function DELETE(request: Request) {
  try {
    // Get driver ID from URL query parameter (?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validate that ID was provided
    if (!id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Step 1: Delete all bus assignments for this driver
    // Must delete these first because of foreign key relationship
    await prisma.busDriver.deleteMany({
      where: { driverId: parseInt(id) },
    });

    // Step 2: Now delete the driver
    await prisma.driver.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    return NextResponse.json(
      { error: "Failed to delete driver" },
      { status: 500 }
    );
  }
}