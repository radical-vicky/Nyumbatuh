
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const {
      title,
      description,
      type,
      address,
      city,
      state,
      zipCode,
      sizeSqft,
      numUnits,
      bedrooms,
      bathrooms,
      price,
      priceType,
    } = body;

    // Validate required fields
    if (!title || !description || !type || !address || !city || !state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        title,
        description,
        type,
        address,
        city,
        state,
        zipCode: zipCode || null,
        sizeSqft: sizeSqft || null,
        numUnits: numUnits || null,
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        price: price || null,
        priceType: priceType || null,
        ownerId: session.userId,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      id: property.id,
      message: "Property listed successfully",
    });
  } catch (error: any) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    } else {
      // Default to only showing approved properties for public view
      where.status = "APPROVED";
    }
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    
    if (state) {
      where.state = state;
    }
    
    if (type) {
      where.type = type;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            take: 1,
            orderBy: { order: "asc" },
          },
          owner: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: { inquiries: true },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: skip,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Check if property exists and belongs to user
    const existing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const isOwner = session.userId === existing.ownerId;
    const isAdmin = session.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update property
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        // If owner updates a rejected property, send it back for review
        ...(isOwner && !isAdmin && existing.status === "REJECTED" 
          ? { status: "PENDING", rejectedReason: null } 
          : {}),
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Check if property exists and belongs to user
    const existing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const isOwner = session.userId === existing.ownerId;
    const isAdmin = session.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete property and all related data (cascade will handle images, inquiries, etc.)
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
