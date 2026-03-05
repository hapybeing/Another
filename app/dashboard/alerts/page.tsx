export default function AlertsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alerts & Incidents</h1>
        <p className="text-neutral-400 text-sm mt-1">Historical log of downtime events and degraded performance.</p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="p-16 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4">
            <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <h3 className="text-lg font-medium text-white">All Clear</h3>
          <p className="text-neutral-500 mt-2 max-w-sm mx-auto">No incidents detected in the last 30 days. When endpoints go down or experience high latency, alerts will appear here.</p>
        </div>
      </div>
    </div>
  );
}
