"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMonitor(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!name || !url) return;

  // The Real-Time Ping Engine
  let status = "Down";
  let ping = 0;
  const startTime = Date.now();

  try {
    // We force cache: 'no-store' so Vercel doesn't cheat and use old data
    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    ping = Date.now() - startTime;
    status = response.ok ? "Operational" : "Degraded";
  } catch (error) {
    // If the fetch fails entirely (e.g. invalid URL or server is dead)
    ping = Date.now() - startTime;
    status = "Down";
  }

  // Save the REAL results to the database
  await prisma.monitor.create({
    data: {
      userId: session.user.id,
      name,
      url,
      status,
      method: "GET",
      ping,
      uptime: status === "Operational" ? 100 : 0,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteMonitor(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  // Delete from database (ensuring the user owns it)
  await prisma.monitor.delete({
    where: { 
      id: id,
      userId: session.user.id 
    },
  });

  revalidatePath("/dashboard");
}
