import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executePing } from "@/lib/engine";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitors = await prisma.monitor.findMany();
  
  const promises = monitors.map(monitor => executePing(monitor));
  await Promise.all(promises);

  return NextResponse.json({ success: true, targets_pinged: monitors.length });
}
