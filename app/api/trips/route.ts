import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all trips with bus, route, and driver details
export async function GET() {
  try {
    // Fetch all trips from database
    // Include related bus, route, and driver information
    const trips = await prisma.trip.findMany({
      include: {
        bus: true,      // Include bus details (plateNumber, model, etc.)
        route: true,    // Include route details (name, origin, destination, etc.)
        driver: true,   // Include driver details (firstName, lastName, etc.)
      },
      orderBy: { departureTime: "desc" },  // Newest trips first
    });
    
    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

// POST - Create new trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create the trip with bus, route, and driver relationships
    const trip = await prisma.trip.create({
      data: {
        busId: parseInt(body.busId),              // Convert to number
        routeId: parseInt(body.routeId),          // Convert to number
        driverId: parseInt(body.driverId),        // Convert to number
        departureTime: new Date(body.departureTime),  // Convert to Date
        arrivalTime: new Date(body.arrivalTime),      // Convert to Date
        status: body.status,
        notes: body.notes || "",  // Optional field, default to empty string
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}

// PUT - Update trip
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Update the trip information
    const trip = await prisma.trip.update({
      where: { id: body.id },
      data: {
        busId: parseInt(body.busId),
        routeId: parseInt(body.routeId),
        driverId: parseInt(body.driverId),
        departureTime: new Date(body.departureTime),
        arrivalTime: new Date(body.arrivalTime),
        status: body.status,
        notes: body.notes || "",
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}

// DELETE - Delete trip
export async function DELETE(request: Request) {
  try {
    // Get trip ID from URL query parameter (?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validate that ID was provided
    if (!id) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    // Delete the trip
    await prisma.trip.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}