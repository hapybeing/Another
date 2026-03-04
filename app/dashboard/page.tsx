export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">System Status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-2xl font-semibold text-white">All Systems Operational</p>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">Active Endpoints</p>
          <p className="mt-2 text-2xl font-semibold text-white">24 / 24</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 backdrop-blur-sm shadow-xl">
          <p className="text-sm font-medium text-neutral-400">Avg Response Time</p>
          <p className="mt-2 text-2xl font-semibold text-white">42ms</p>
        </div>
      </div>

      {/* Detailed Monitors */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="border-b border-neutral-800 p-4">
          <h3 className="text-lg font-medium text-white">Live Monitoring</h3>
        </div>
        <div className="divide-y divide-neutral-800">
          {[
            { name: "Production Database", region: "us-east-1", status: "Healthy", ping: "12ms", uptime: "99.99%" },
            { name: "Auth Service API", region: "eu-central-1", status: "Healthy", ping: "45ms", uptime: "100%" },
            { name: "Payment Gateway", region: "global", status: "Healthy", ping: "28ms", uptime: "99.95%" },
            { name: "Storage Bucket", region: "us-west-2", status: "Warning", ping: "150ms", uptime: "98.20%" },
          ].map((service) => (
            <div key={service.name} className="flex items-center justify-between p-4 hover:bg-neutral-900/30 transition-colors">
              <div>
                <p className="font-medium text-white">{service.name}</p>
                <p className="text-sm text-neutral-500">{service.region}</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-neutral-400">Uptime</p>
                  <p className="text-sm font-medium text-white">{service.uptime}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Latency</p>
                  <p className="text-sm font-medium text-white">{service.ping}</p>
                </div>
                <div className="w-24 text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    service.status === 'Healthy' 
                      ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' 
                      : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
