import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle2, AlertCircle, XCircle, Activity } from "lucide-react";

// Revalidate this page every 30 seconds so public users see fresh data
export const revalidate = 30;

export default async function PublicStatusPage({ params }: { params: { userId: string } }) {
  // Fetch the user and their public monitors
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      monitors: {
        orderBy: { name: 'asc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const monitors = user.monitors;
  const totalMonitors = monitors.length;
  const healthyMonitors = monitors.filter(m => m.status === 'Operational').length;
  const isAllOperational = totalMonitors > 0 && totalMonitors === healthyMonitors;

  return (
    <main className="min-h-screen bg-black text-white bg-grid-pattern selection:bg-neutral-800">
      {/* Dynamic Background Glow based on system health */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-20 ${isAllOperational ? 'bg-emerald-500' : 'bg-red-500'}`} />

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <header className="mb-12 flex flex-col items-center text-center">
          {user.image ? (
            <img src={user.image} alt="Logo" className="w-16 h-16 rounded-full border border-neutral-800 mb-6 shadow-xl" />
          ) : (
            <div className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900 mb-6 flex items-center justify-center shadow-xl">
              <Activity className="w-6 h-6 text-neutral-500" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{user.name || "Organization"} Status</h1>
          <p className="text-neutral-400">Real-time infrastructure health and uptime data.</p>
        </header>

        {/* Global Status Banner */}
        <div className={`rounded-xl border p-6 mb-12 flex items-center gap-4 shadow-2xl backdrop-blur-md ${
          totalMonitors === 0 ? 'border-neutral-800 bg-neutral-900/50 text-neutral-300' :
          isAllOperational ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 
          'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          {totalMonitors === 0 ? <Activity className="w-8 h-8" /> : isAllOperational ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          <div>
            <h2 className="text-xl font-semibold">
              {totalMonitors === 0 ? "No systems reporting" : isAllOperational ? "All Systems Operational" : "Systems Degraded"}
            </h2>
            <p className="text-sm opacity-80 mt-1">
              Last updated: {new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' })}
            </p>
          </div>
        </div>

        {/* Public Endpoints List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white px-1">Active Services</h3>
          {totalMonitors === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-12 text-center">
              <p className="text-neutral-500">No public services configured.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-black/60 overflow-hidden backdrop-blur-md shadow-xl">
              <div className="divide-y divide-neutral-800">
                {monitors.map((service) => (
                  <div key={service.id} className="p-5 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                    <span className="font-medium text-white text-lg">{service.name}</span>
                    <span className={`flex items-center gap-2 text-sm font-medium ${
                      service.status === 'Operational' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {service.status === 'Operational' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="mt-20 text-center border-t border-neutral-800/50 pt-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors">
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
            Powered by Specter Telemetry
          </a>
        </footer>
      </div>
    </main>
  );
}
