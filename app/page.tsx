import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black bg-grid-pattern">
      {/* Top Navigation Bar */}
      <header className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-5 lg:px-8 border-b border-neutral-800/50 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          <span className="text-sm font-bold text-white tracking-widest">SPECTER</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/login" className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/10 hover:bg-white/20 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-900/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl text-center mt-16 px-6">
        <div className="mb-8 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm font-medium text-neutral-300 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Specter v1.0 is currently in alpha
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6">
          See everything.<br />
          <span className="text-neutral-500">Miss nothing.</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-neutral-400 max-w-xl mx-auto">
          Real-time infrastructure monitoring, uptime tracking, and attack surface mapping. 
          Built for teams who need to know before the customer does.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/login" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all">
            Start Monitoring
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold leading-6 text-neutral-300 hover:text-white transition-colors">
            View the Dashboard <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Mock UI Element */}
      <div className="relative z-10 mt-20 w-full max-w-5xl rounded-xl border border-neutral-800 bg-black/40 p-4 backdrop-blur-md shadow-2xl hidden md:block">
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "API Gateway", status: "Operational", ping: "24ms" },
            { name: "Auth Service", status: "Operational", ping: "41ms" },
            { name: "Database Primary", status: "Operational", ping: "12ms" }
          ].map((service) => (
            <div key={service.name} className="flex flex-col p-4 rounded-lg border border-neutral-800/50 bg-neutral-900/20">
              <span className="text-sm font-medium text-neutral-400">{service.name}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-center text-sm text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
                  {service.status}
                </span>
                <span className="text-xs text-neutral-500">{service.ping}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
