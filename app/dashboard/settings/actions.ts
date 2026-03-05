"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function generateApiKey(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string || "Default Key";
  
  // Mint a cryptographically secure token
  const rawToken = crypto.randomBytes(24).toString("hex");
  const key = `spc_${rawToken}`; // Prefix makes it easy to identify in codebases

  await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name,
      key,
    }
  });

  revalidatePath("/dashboard/settings");
}

export async function revokeApiKey(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.apiKey.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath("/dashboard/settings");
}
