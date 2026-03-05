import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addMonitor } from "./actions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch only the monitors belonging to the logged-in user
  const monitors = await prisma.monitor.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate live stats
  const totalMonitors = monitors.length;
  const healthyMonitors = monitors.filter(m => m.status === 'Operational').length;
  const avgPing = totalMonitors > 0 
    ? Math.round(monitors.reduce((acc, curr) => acc + (curr.ping || 0), 0) / totalMonitors) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dynamic Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">System Status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {totalMonitors === healthyMonitors && totalMonitors > 0 ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </>
              ) : totalMonitors === 0 ? (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-500"></span>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              )}
            </span>
            <p className="text-2xl font-semibold text-white">
              {totalMonitors === 0 ? "No Endpoints" : totalMonitors === healthyMonitors ? "All Systems Operational" : "Systems Degraded"}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">Active Endpoints</p>
          <p className="mt-2 text-2xl font-semibold text-white">{healthyMonitors} / {totalMonitors}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">Avg Response Time</p>
          <p className="mt-2 text-2xl font-semibold text-white">{avgPing}ms</p>
        </div>
      </div>

      {/* Add Endpoint Form */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
        <h3 className="text-lg font-medium text-white mb-4">Add New Endpoint</h3>
        <form action={addMonitor} className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1">Service Name</label>
            <input type="text" id="name" name="name" required placeholder="e.g., Auth API Gateway" className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
          </div>
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-neutral-400 mb-1">Target URL</label>
            <input type="url" id="url" name="url" required placeholder="https://api.example.com/health" className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
          </div>
          <button type="submit" className="rounded-md bg-white px-8 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-neutral-200 transition-all mt-4 sm:mt-0">
            Deploy Monitor
          </button>
        </form>
      </div>

      {/* Live Database Monitors */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h3 className="text-lg font-medium text-white">Live Monitoring</h3>
        </div>
        <div className="divide-y divide-neutral-800">
          {monitors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 mb-4">
                <div className="w-4 h-4 rounded-sm bg-neutral-700"></div>
              </div>
              <p className="text-neutral-400">No infrastructure tracked.</p>
              <p className="text-sm text-neutral-500 mt-1">Deploy your first monitor above to start telemetry.</p>
            </div>
          ) : (
            monitors.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors">
                <div>
                  <p className="font-medium text-white">{service.name}</p>
                  <p className="text-sm text-neutral-500">{service.url}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-neutral-400">Uptime</p>
                    <p className="text-sm font-medium text-white">{service.uptime}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Latency</p>
                    <p className="text-sm font-medium text-white">{service.ping}ms</p>
                  </div>
                  <div className="w-24 text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      service.status === 'Operational' 
                        ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' 
                        : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
