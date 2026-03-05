"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black bg-grid-pattern px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-800 bg-black/60 p-8 backdrop-blur-xl shadow-2xl text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800">
          <div className="h-4 w-4 rounded-sm bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Access Command Center</h2>
        <p className="text-sm text-neutral-400 mb-8">Authenticate to view your infrastructure.</p>
        
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-neutral-200"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Continue with GitHub
        </button>
        
        <div className="mt-8 text-sm text-neutral-500">
          <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
