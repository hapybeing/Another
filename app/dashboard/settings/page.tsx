import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey, revokeApiKey } from "./actions";
import { Key, Plus, Trash2, ExternalLink, Terminal } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your developer access and public infrastructure pages.</p>
      </div>

      {/* NEW: Public Status Page Generator */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-emerald-400 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" /> Public Status Page
            </h2>
            <p className="text-sm text-neutral-400 mt-1">Share this real-time dashboard with your customers to prove your uptime.</p>
          </div>
          <Link 
            href={`/status/${session?.user?.id}`} 
            target="_blank"
            className="rounded-md bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-emerald-400 transition-all text-center whitespace-nowrap"
          >
            View Live Page
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="border-b border-neutral-800 p-6">
          <h2 className="text-lg font-medium text-white">Profile Identity</h2>
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
            <Key className="w-5 h-5 text-neutral-400" /> Developer API Keys
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Tokens for programmatic access to the Specter REST API.</p>
        </div>
        
        <div className="p-6 border-b border-neutral-800/50 bg-neutral-900/10">
          <form action={generateApiKey} className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1 max-w-sm">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1">Key Identifier</label>
              <input type="text" id="name" name="name" required placeholder="e.g., Production CI/CD Pipeline" className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" />
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition-all h-[42px]">
              <Plus className="w-4 h-4" /> Generate Key
            </button>
          </form>
        </div>

        <div className="p-0">
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-neutral-900/5">
              <Key className="w-8 h-8 text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-500">No active API keys found.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-6 flex flex-col hover:bg-neutral-900/20 transition-colors">
                  <div className="flex items-center justify-between mb-4">
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
                  
                  {/* API Usage Example */}
                  <div className="bg-black rounded-md border border-neutral-800 p-3 flex items-start gap-3 mt-2">
                    <Terminal className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                    <div className="overflow-x-auto text-xs font-mono text-neutral-400 whitespace-nowrap">
                      curl -X GET https://another-five-orpin.vercel.app/api/v1/monitors \<br/>
                      &nbsp;&nbsp;-H "Authorization: Bearer {apiKey.key}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
