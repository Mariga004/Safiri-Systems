import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all buses
export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { error: "Failed to fetch buses" },
      { status: 500 }
    );
  }
}

// POST - Create a new bus
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plateNumber, model, capacity, status } = body;

    const bus = await prisma.bus.create({
      data: {
        plateNumber,
        model,
        capacity: parseInt(capacity),
        status,
      },
    });

    return NextResponse.json(bus, { status: 201 });
  } catch (error) {
    console.error("Error creating bus:", error);
    return NextResponse.json(
      { error: "Failed to create bus" },
      { status: 500 }
    );
  }
}

// PUT - Update a bus
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, plateNumber, model, capacity, status } = body;

    const bus = await prisma.bus.update({
      where: { id: parseInt(id) },
      data: {
        plateNumber,
        model,
        capacity: parseInt(capacity),
        status,
      },
    });

    return NextResponse.json(bus);
  } catch (error) {
    console.error("Error updating bus:", error);
    return NextResponse.json(
      { error: "Failed to update bus" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a bus
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Bus ID is required" },
        { status: 400 }
      );
    }

    await prisma.bus.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    return NextResponse.json(
      { error: "Failed to delete bus" },
      { status: 500 }
    );
  }
}