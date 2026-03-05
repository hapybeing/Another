import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Security Gate: Ensure only Vercel's automated system can trigger this
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all active monitors
  const monitors = await prisma.monitor.findMany();

  // Execute global ping sweep concurrently for maximum speed
  const promises = monitors.map(async (monitor) => {
    const startTime = Date.now();
    let status = "Down";
    let ping = 0;

    try {
      const response = await fetch(monitor.url, { method: 'GET', cache: 'no-store' });
      ping = Date.now() - startTime;
      status = response.ok ? "Operational" : "Degraded";
    } catch (error) {
      ping = Date.now() - startTime;
      status = "Down";
    }

    // 1. Update the live monitor stats
    await prisma.monitor.update({
      where: { id: monitor.id },
      data: { status, ping, lastCheck: new Date() }
    });

    // 2. Imprint the historical log
    await prisma.pingLog.create({
      data: { monitorId: monitor.id, ping, status }
    });
  });

  await Promise.all(promises);

  return NextResponse.json({ success: true, targets_pinged: monitors.length });
}
