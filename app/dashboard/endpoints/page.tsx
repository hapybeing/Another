import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Canvas from "./Canvas";
import { Network } from "lucide-react";

export default async function EndpointsPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch the latest state of all monitors
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
