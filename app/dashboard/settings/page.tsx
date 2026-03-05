import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your account, billing, and API preferences.</p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-neutral-800 p-6">
          <h2 className="text-lg font-medium text-white">Profile Information</h2>
          <p className="text-sm text-neutral-500 mt-1">Sourced automatically from your connected GitHub account.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
             {session?.user?.image && (
              <img src={session.user.image} alt="Profile" className="h-16 w-16 rounded-full border border-neutral-700" />
            )}
            <div>
              <p className="text-sm font-medium text-neutral-400 mb-1">Name</p>
              <p className="text-lg text-white">{session?.user?.name}</p>
            </div>
            <div className="ml-8">
              <p className="text-sm font-medium text-neutral-400 mb-1">Email Address</p>
              <p className="text-lg text-white">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-neutral-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-white">API Keys</h2>
            <p className="text-sm text-neutral-500 mt-1">Tokens for programmatic access to Specter.</p>
          </div>
          <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-neutral-200 transition-all">
            Generate New Key
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8 border border-dashed border-neutral-800 rounded-lg bg-neutral-900/20">
            <p className="text-sm text-neutral-500">No active API keys found.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-red-900/30 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
          <p className="text-sm text-neutral-500 mt-1 mb-4">Permanently delete your account and all monitored endpoint data.</p>
          <button className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
