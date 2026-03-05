import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2, Clock, ServerCrash, Activity } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);

  // Fetch all incidents for monitors belonging to this user
  const incidents = await prisma.incident.findMany({
    where: {
      monitor: { userId: session?.user?.id }
    },
    include: { monitor: true },
    orderBy: { startedAt: 'desc' }
  });

  const ongoingIncidents = incidents.filter(i => i.status === 'Ongoing');
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');
  
  // Calculate Mean Time To Resolution (MTTR)
  const totalDowntime = resolvedIncidents.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const mttr = resolvedIncidents.length > 0 ? Math.round(totalDowntime / resolvedIncidents.length) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Incident Response</h1>
          <p className="text-neutral-400 text-sm mt-1">Real-time outage tracking, downtime calculation, and MTTR analytics.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/50 border border-neutral-800 rounded-lg px-4 py-2 backdrop-blur-md">
             <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">MTTR</p>
             <p className="text-lg font-semibold text-white">{mttr} <span className="text-sm text-neutral-500 font-normal">mins</span></p>
          </div>
          <div className="bg-black/50 border border-neutral-800 rounded-lg px-4 py-2 backdrop-blur-md">
             <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Total Downtime</p>
             <p className="text-lg font-semibold text-white">{totalDowntime} <span className="text-sm text-neutral-500 font-normal">mins</span></p>
          </div>
        </div>
      </div>

      {/* ACTIVE INCIDENTS SECTION (Flashing Red) */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-white flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${ongoingIncidents.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`}></div>
          Active Outages
        </h2>
        
        {ongoingIncidents.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-8 text-center backdrop-blur-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-white font-medium">All Systems Operational</p>
            <p className="text-sm text-neutral-500 mt-1">No active incidents detected across your architecture.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {ongoingIncidents.map(incident => (
              <div key={incident.id} className="rounded-xl border border-red-500/30 bg-red-500/5 p-5 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 bg-red-500/20 p-2 rounded-md border border-red-500/30">
                      <ServerCrash className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{incident.monitor.name} is Down</h3>
                      <p className="text-sm text-neutral-400 font-mono mt-1">{incident.monitor.url}</p>
                      <p className="text-sm text-red-400 mt-2 bg-red-950/50 inline-block px-2 py-1 rounded border border-red-900/50">{incident.error}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Downtime</p>
                    <p className="text-xl font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-400 animate-pulse" />
                      {formatDistanceToNow(new Date(incident.startedAt))}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Started {format(new Date(incident.startedAt), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESOLVED INCIDENTS SECTION (Historical Log) */}
      <div className="space-y-4 pt-8 border-t border-neutral-800/50">
        <h2 className="text-lg font-medium text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-neutral-500" /> Historical Log
        </h2>

        {resolvedIncidents.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-black/40 p-12 text-center backdrop-blur-sm">
            <p className="text-neutral-500">No historical incidents recorded.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-800 bg-black/40 overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="divide-y divide-neutral-800">
              {resolvedIncidents.map(incident => (
                <div key={incident.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-neutral-900/30 transition-colors gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-white">{incident.monitor.name}</h4>
                      <span className="bg-neutral-800 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-neutral-700">Resolved</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono">{incident.monitor.url}</p>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end bg-neutral-900/50 sm:bg-transparent p-3 sm:p-0 rounded-md">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Outage Date</p>
                      <p className="text-sm font-medium text-neutral-300">{format(new Date(incident.startedAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Duration</p>
                      <p className="text-sm font-medium text-white">{incident.duration} mins</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
