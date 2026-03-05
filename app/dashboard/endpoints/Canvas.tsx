"use client";

import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, NodeChange, Edge, addEdge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import StatusNode from './StatusNode';

const nodeTypes = { statusNode: StatusNode };

export default function Canvas({ monitors }: { monitors: any[] }) {
  // Auto-generate visual nodes from the existing database
  const initialNodes = monitors.map((m, i) => ({
    id: m.id,
    type: 'statusNode',
    // Auto-layout them in a neat grid to start
    position: { x: (i % 3) * 320 + 50, y: Math.floor(i / 3) * 200 + 50 },
    data: { name: m.name, url: m.url, status: m.status, ping: m.ping }
  }));

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#10b981', strokeWidth: 2, opacity: 0.5 } 
    }, eds)),
    []
  );

  return (
    <div className="h-[600px] w-full rounded-xl border border-neutral-800 bg-black/40 overflow-hidden shadow-2xl relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="dark-theme-flow"
      >
        <Background color="#262626" gap={24} size={2} />
        <Controls className="bg-neutral-900 border-neutral-800 fill-white !rounded-md overflow-hidden" />
      </ReactFlow>

      {/* Simple UI overlay instruction */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-neutral-800 px-4 py-2 rounded-lg pointer-events-none z-10">
        <p className="text-xs text-neutral-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Drag endpoints to organize. Click and drag between connection points to map dependencies.
        </p>
      </div>
    </div>
  );
}
