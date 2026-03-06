import { Handle, Position } from 'reactflow';
import { Activity, ServerCrash, GripHorizontal } from 'lucide-react';

export default function StatusNode({ data }: { data: any }) {
  const isUp = data.status === 'Operational';
  
  return (
    <div className={`group px-5 py-4 rounded-2xl border backdrop-blur-xl bg-gradient-to-b from-neutral-900/90 to-black/95 w-72 transition-all duration-300 hover:scale-[1.02] ${
      isUp ? 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_40px_rgba(239,68,68,0.25)]'
    }`}>
      {/* Massive, glowing top handle for easy connections */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`w-5 h-5 border-4 border-black transition-all ${isUp ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`} 
      />
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 text-white/30 group-hover:text-white/80 transition-colors cursor-grab">
            <GripHorizontal className="w-4 h-4" />
          </div>
          <h3 className="text-white font-semibold text-lg tracking-tight truncate pr-2">{data.name}</h3>
        </div>
        {isUp ? (
          <div className="p-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        ) : (
          <div className="p-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <ServerCrash className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
          </div>
        )}
      </div>
      
      <div className="bg-black/50 rounded-lg p-2.5 border border-white/5 mb-3">
         <p className="text-xs text-neutral-400 font-mono truncate">{data.url}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md ${
          isUp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
        }`}>
          {data.status}
        </span>
        <span className="text-sm font-medium text-white flex items-center gap-1">
          {data.ping}<span className="text-xs text-neutral-500">ms</span>
        </span>
      </div>

      {/* Massive, glowing bottom handle with hover expansion */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`w-5 h-5 border-4 border-black transition-all hover:scale-150 cursor-crosshair ${isUp ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`} 
      />
    </div>
  );
}
