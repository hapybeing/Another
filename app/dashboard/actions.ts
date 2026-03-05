"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMonitor(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  // Security check: Only logged-in users can add endpoints
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!name || !url) return;

  // Save to database
  await prisma.monitor.create({
    data: {
      userId: session.user.id,
      name,
      url,
      status: "Operational",
      method: "GET",
      ping: Math.floor(Math.random() * 50) + 10, // Mocking initial ping
      uptime: 100,
    },
  });

  // Instantly refresh the dashboard page with the new data
  revalidatePath("/dashboard");
}
