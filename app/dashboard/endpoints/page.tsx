import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Canvas from "./Canvas";
import { Network } from "lucide-react";

export default async function EndpointsPage() {
  const session = await getServerSession(authOptions);
  
  const monitors = await prisma.monitor.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-emerald-500" />
            Visual Architecture
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Map your infrastructure topology to instantly visualize cascading failures.</p>
        </div>
        
        {/* PREMIUM ANIMATED BUTTON UI */}
        <div className="flex gap-3">
          <button className="relative inline-flex h-10 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#10b981_50%,#000000_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-neutral-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-neutral-900 gap-2">
              Save Architecture
            </span>
          </button>
        </div>
      </div>

      {monitors.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-12 text-center backdrop-blur-sm">
          <p className="text-neutral-500">No nodes detected. Deploy a monitor on the Overview tab to begin mapping.</p>
        </div>
      ) : (
        <Canvas monitors={monitors} />
      )}
    </div>
  );
}
