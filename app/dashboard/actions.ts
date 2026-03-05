"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { executePing } from "@/lib/engine";

export async function addMonitor(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  if (!name || !url) return;

  // Create the monitor in a "Pending" state
  const newMonitor = await prisma.monitor.create({
    data: {
      userId: session.user.id,
      name,
      url,
      status: "Pending",
      method: "GET",
    },
  });

  // Immediately route it through our new State Machine Engine
  await executePing(newMonitor);
  revalidatePath("/dashboard");
}

export async function deleteMonitor(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.monitor.delete({
    where: { id: id, userId: session.user.id },
  });

  revalidatePath("/dashboard");
}

export async function forceSweep() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const monitors = await prisma.monitor.findMany({
    where: { userId: session.user.id }
  });

  // Run the State Machine Engine concurrently across all monitors
  const promises = monitors.map(monitor => executePing(monitor));
  await Promise.all(promises);
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/alerts");
}
