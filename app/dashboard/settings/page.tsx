import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey, revokeApiKey } from "./actions";
import { Key, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  // Fetch all active API keys for this user
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your account, billing, and API preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden shadow-xl">
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

      {/* Developer API Keys Section */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="border-b border-neutral-800 p-6">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-500" /> Developer API Keys
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Tokens for programmatic access to the Specter engine.</p>
        </div>
        
        {/* Form to Create Key */}
        <div className="p-6 border-b border-neutral-800/50 bg-neutral-900/10">
          <form action={generateApiKey} className="flex gap-4 items-end">
            <div className="flex-1 max-w-sm">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1">Key Identifier</label>
              <input type="text" id="name" name="name" required placeholder="e.g., Production CI/CD Pipeline" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
            </div>
            <button type="submit" className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition-all h-[42px]">
              <Plus className="w-4 h-4" /> Generate Key
            </button>
          </form>
        </div>

        {/* List of Active Keys */}
        <div className="p-0">
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-neutral-900/5">
              <Key className="w-8 h-8 text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-500">No active API keys found.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-6 flex items-center justify-between hover:bg-neutral-900/20 transition-colors">
                  <div>
                    <h3 className="text-white font-medium mb-1">{apiKey.name}</h3>
                    <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                        {apiKey.key}
                      </code>
                      <span className="text-xs text-neutral-500">
                        Created {format(new Date(apiKey.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <form action={revokeApiKey}>
                    <input type="hidden" name="id" value={apiKey.id} />
                    <button type="submit" className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all" title="Revoke Key">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-900/30 bg-black/40 backdrop-blur-sm overflow-hidden mt-8">
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
