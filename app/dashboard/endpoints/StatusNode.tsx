import { Handle, Position } from 'reactflow';
import { Activity, ServerCrash } from 'lucide-react';

export default function StatusNode({ data }: { data: any }) {
  const isUp = data.status === 'Operational';
  
  return (
    <div className={`px-4 py-3 rounded-xl border backdrop-blur-md bg-black/90 w-64 shadow-2xl transition-all ${
      isUp ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
    }`}>
      {/* Top Connection Point */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-neutral-500 border-none" />
      
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium truncate pr-2">{data.name}</h3>
        {isUp ? (
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <ServerCrash className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
        )}
      </div>
      
      <p className="text-xs text-neutral-500 font-mono truncate">{data.url}</p>
      
      <div className="mt-3 flex justify-between items-center border-t border-neutral-800/50 pt-2">
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
          isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {data.status}
        </span>
        <span className="text-xs text-neutral-400">{data.ping}ms</span>
      </div>

      {/* Bottom Connection Point */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-neutral-500 border-none" />
    </div>
  );
}
