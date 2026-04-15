import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all routes
export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}

// POST - Create new route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const route = await prisma.route.create({
      data: {
        name: body.name,
        origin: body.origin,
        destination: body.destination,
        distance: parseFloat(body.distance),
        estimatedTime: body.estimatedTime,
        status: body.status,
      },
    });
    return NextResponse.json(route);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create route" },
      { status: 500 }
    );
  }
}

// PUT - Update route
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const route = await prisma.route.update({
      where: { id: body.id },
      data: {
        name: body.name,
        origin: body.origin,
        destination: body.destination,
        distance: parseFloat(body.distance),
        estimatedTime: body.estimatedTime,
        status: body.status,
      },
    });
    return NextResponse.json(route);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update route" },
      { status: 500 }
    );
  }
}

// DELETE - Delete route
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      );
    }

    await prisma.route.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Route deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete route" },
      { status: 500 }
    );
  }
}