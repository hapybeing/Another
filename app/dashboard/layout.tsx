export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-950/50 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-4 h-4 rounded-sm bg-emerald-500"></div>
          <span className="text-lg font-bold text-white tracking-widest">SPECTER</span>
        </div>
        <nav className="space-y-2">
          <a href="/dashboard" className="block rounded-md bg-neutral-800/50 px-3 py-2 text-sm font-medium text-white transition-colors">Overview</a>
          <a href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Endpoints</a>
          <a href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Alerts</a>
          <a href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Settings</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-neutral-800 flex items-center px-6 bg-black/50 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-white">Command Center</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
}
