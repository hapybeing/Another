import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// FIX: Removed the 'export' keyword. This is now a standard local constant.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Security Gate: Check for Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer spc_")) {
      return NextResponse.json(
        { error: "Unauthorized. Valid Specter API key required in Authorization header." },
        { status: 401, headers: corsHeaders }
      );
    }

    const key = authHeader.replace("Bearer ", "");
    
    // Cryptographic validation against the database
    const apiKey = await prisma.apiKey.findUnique({ 
      where: { key } 
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Forbidden. Invalid or revoked API key." },
        { status: 403, headers: corsHeaders }
      );
    }

    // Update the 'lastUsed' timestamp for security auditing
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() }
    });

    // Fetch the telemetry data for the user who owns this key
    const monitors = await prisma.monitor.findMany({
      where: { userId: apiKey.userId },
      select: {
        id: true,
        name: true,
        url: true,
        status: true,
        ping: true,
        uptime: true,
        lastCheck: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      meta: {
        total_endpoints: monitors.length,
        timestamp: new Date().toISOString()
      },
      data: monitors
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
