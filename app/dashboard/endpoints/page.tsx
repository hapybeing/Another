export default function EndpointsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Endpoint Management</h1>
          <p className="text-neutral-400 text-sm mt-1">Configure individual monitors, custom headers, and alert thresholds.</p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm p-6 text-center">
        <p className="text-neutral-500">Advanced endpoint configuration is currently in development (v1.1).</p>
      </div>
    </div>
  );
}
