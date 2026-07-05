import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: {
            message: "Validation error",
            fieldErrors: parsed.error.flatten().fieldErrors
          }
        },
        { status: 400 }
      );
    }
    
    const { name, email, phone, password } = parsed.data;
    // Get role from body, default to OWNER
    const role = body.role || "OWNER";

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user with specified role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: role as "OWNER" | "ADMIN" | "TENANT",
      },
    });

    // Create session token
    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: user.role as "OWNER" | "ADMIN" | "TENANT",
      name: user.name,
    });

    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return res;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}