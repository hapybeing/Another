import { prisma } from "@/lib/prisma";

// The core Specter Telemetry State Machine
export async function executePing(monitor: any) {
  const startTime = Date.now();
  let currentStatus = "Down";
  let ping = 0;

  // 1. Execute the Network Request
  try {
    const response = await fetch(monitor.url, { method: 'GET', cache: 'no-store' });
    ping = Date.now() - startTime;
    currentStatus = response.ok ? "Operational" : "Degraded";
  } catch (error) {
    ping = Date.now() - startTime;
    currentStatus = "Down";
  }

  const previousStatus = monitor.status;

  // 2. STATE MACHINE FIX: Did the server crash (UP -> DOWN) OR fail on creation (PENDING -> DOWN)?
  if ((currentStatus === "Down" || currentStatus === "Degraded") && (previousStatus === "Operational" || previousStatus === "Pending")) {
    await prisma.incident.create({
      data: {
        monitorId: monitor.id,
        status: "Ongoing",
        error: `Endpoint returned status: ${currentStatus}`
      }
    });
  }

  // 3. STATE MACHINE: Did the server just recover? (DOWN -> UP)
  if (currentStatus === "Operational" && (previousStatus === "Down" || previousStatus === "Degraded")) {
    // Find the currently open incident for this monitor
    const ongoingIncident = await prisma.incident.findFirst({
      where: { monitorId: monitor.id, status: "Ongoing" },
      orderBy: { startedAt: 'desc' }
    });

    if (ongoingIncident) {
      const resolvedAt = new Date();
      // Calculate how many minutes it was down
      const durationMs = resolvedAt.getTime() - ongoingIncident.startedAt.getTime();
      const durationMins = Math.max(1, Math.round(durationMs / 60000));

      await prisma.incident.update({
        where: { id: ongoingIncident.id },
        data: { status: "Resolved", resolvedAt, duration: durationMins }
      });
    }
  }

  // 4. Update the Monitor and Log the Ping
  const updatedMonitor = await prisma.monitor.update({
    where: { id: monitor.id },
    data: { status: currentStatus, ping, lastCheck: new Date(), uptime: currentStatus === 'Operational' ? 100 : 0 }
  });

  await prisma.pingLog.create({
    data: { monitorId: monitor.id, ping, status: currentStatus }
  });

  return updatedMonitor;
}
