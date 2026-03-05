import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addMonitor, deleteMonitor, forceSweep } from "./actions";
import { TelemetryChart } from "./TelemetryChart";
import { Activity, Trash2, Globe, Zap } from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  const monitors = await prisma.monitor.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    include: {
      logs: {
        orderBy: { createdAt: 'asc' },
        take: 20
      }
    }
  });

  const totalMonitors = monitors.length;
  const healthyMonitors = monitors.filter(m => m.status === 'Operational').length;
  const avgPing = totalMonitors > 0 
    ? Math.round(monitors.reduce((acc, curr) => acc + (curr.ping || 0), 0) / totalMonitors) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* High-Level Analytics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400 flex items-center gap-2">
            <Activity className="w-4 h-4" /> System Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {totalMonitors === healthyMonitors && totalMonitors > 0 ? (
                <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></>
              ) : totalMonitors === 0 ? (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-500"></span>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              )}
            </span>
            <p className="text-2xl font-semibold text-white">
              {totalMonitors === 0 ? "No Endpoints" : totalMonitors === healthyMonitors ? "All Operational" : "Degraded"}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">Active Architecture</p>
          <p className="mt-2 text-2xl font-semibold text-white">{healthyMonitors} / {totalMonitors} <span className="text-sm text-neutral-500 font-normal">nodes</span></p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">Global Avg Latency</p>
          <p className="mt-2 text-2xl font-semibold text-white">{avgPing}<span className="text-sm text-neutral-500 font-normal">ms</span></p>
        </div>
      </div>

      {/* Deploy Target Form */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
        <h3 className="text-lg font-medium text-white mb-4">Deploy New Target</h3>
        <form action={addMonitor} className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1">Service Identifier</label>
            <input type="text" id="name" name="name" required placeholder="e.g., Auth API Cluster" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
          </div>
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-neutral-400 mb-1">Target Endpoint</label>
            <input type="url" id="url" name="url" required placeholder="https://api.example.com/health" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
          </div>
          <button type="submit" className="rounded-md bg-white px-8 py-2.5 text-sm font-semibold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all mt-4 sm:mt-0">
            Initialize
          </button>
        </form>
      </div>

      {/* The Telemetry Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-medium text-white">Telemetry Streams</h3>
          
          {/* THE NEW GLOBAL SWEEP BUTTON */}
          <form action={forceSweep}>
            <button type="submit" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 px-3 py-1.5 rounded-md transition-all">
              <Zap className="w-4 h-4" /> Run Global Sweep
            </button>
          </form>
        </div>

        {monitors.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-black/40 p-12 text-center shadow-xl">
            <Globe className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
            <p className="text-neutral-400">No telemetry streams active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {monitors.map((service) => {
              const chartData = service.logs.map(log => ({
                time: format(new Date(log.createdAt), 'HH:mm'),
                ping: log.ping
              }));

              return (
                <div key={service.id} className="flex flex-col rounded-xl border border-neutral-800 bg-black/40 p-5 backdrop-blur-sm shadow-xl hover:border-neutral-700 transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{service.name}</h4>
                      <p className="text-sm text-neutral-500 font-mono truncate max-w-[200px] sm:max-w-xs">{service.url}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${
                        service.status === 'Operational' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {service.status}
                      </span>
                      <form action={deleteMonitor}>
                        <input type="hidden" name="id" value={service.id} />
                        <button type="submit" className="text-neutral-600 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                     <TelemetryChart data={chartData} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/50">
                     <div>
                       <p className="text-xs text-neutral-500 uppercase tracking-wider">Current Latency</p>
                       <p className="text-xl font-medium text-white">{service.ping} <span className="text-sm text-neutral-500">ms</span></p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-neutral-500 uppercase tracking-wider">Last Check</p>
                       <p className="text-sm font-medium text-white mt-1">
                          {format(new Date(service.lastCheck), 'HH:mm:ss')}
                       </p>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
