import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/roles";

const prisma = new PrismaClient();

// GET - Fetch all trips with bus, route, and driver details
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        bus: true,
        route: true,
        driver: true,
      },
      orderBy: { departureTime: "desc" },
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
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: "Only admins can create trips" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validate the bus is active before assigning it to a trip
    const bus = await prisma.bus.findUnique({
      where: { id: parseInt(body.busId) },
    });
    if (!bus || bus.status !== "active") {
      return NextResponse.json(
        { error: "Selected bus is not active and cannot be assigned to a trip" },
        { status: 400 }
      );
    }

    // Validate the driver is active before assigning them to a trip
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(body.driverId) },
    });
    if (!driver || driver.status !== "active") {
      return NextResponse.json(
        { error: "Selected driver is not active and cannot be assigned to a trip" },
        { status: 400 }
      );
    }

    // Create the trip with bus, route, and driver relationships
    const trip = await prisma.trip.create({
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
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: "Only admins can edit trips" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Validate the bus is active before assigning it to a trip
    const bus = await prisma.bus.findUnique({
      where: { id: parseInt(body.busId) },
    });
    if (!bus || bus.status !== "active") {
      return NextResponse.json(
        { error: "Selected bus is not active and cannot be assigned to a trip" },
        { status: 400 }
      );
    }

    // Validate the driver is active before assigning them to a trip
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(body.driverId) },
    });
    if (!driver || driver.status !== "active") {
      return NextResponse.json(
        { error: "Selected driver is not active and cannot be assigned to a trip" },
        { status: 400 }
      );
    }

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
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: "Only admins can delete trips" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

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