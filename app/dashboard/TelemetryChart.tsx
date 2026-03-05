"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { time: string; ping: number }[];
}

export function TelemetryChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/20">
        <p className="text-xs text-neutral-500">Awaiting telemetry data...</p>
      </div>
    );
  }

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }} 
            itemStyle={{ color: '#10b981' }} 
            cursor={{ stroke: '#525252', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area 
            type="monotone" 
            dataKey="ping" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPing)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
