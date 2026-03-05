import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-950/50 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-4 h-4 rounded-sm bg-emerald-500"></div>
          <span className="text-lg font-bold text-white tracking-widest">SPECTER</span>
        </div>

        {/* Dynamic User Profile Card */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
          {session.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="h-8 w-8 rounded-full border border-neutral-700" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-neutral-700"></div>
          )}
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{session.user?.name || "User"}</p>
            <p className="truncate text-xs text-neutral-500">{session.user?.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Overview</Link>
          <Link href="/dashboard/endpoints" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Endpoints</Link>
          <Link href="/dashboard/alerts" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Alerts</Link>
          <Link href="/dashboard/settings" className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors">Settings</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-black/50 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-white">Command Center</h2>
          <Link href="/api/auth/signout" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Sign Out
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
}
