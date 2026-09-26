"use client";

import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  useOnSelectionChange,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

import OrgNode from './OrgNode';
import Toolbar from './Toolbar';
import SidePanel from './SidePanel';
import ProjectsModal from './ProjectsModal';
import Legend from './Legend';
import EmptyState from './EmptyState';
import StatsBar from './StatsBar';
import { ProjectProvider, useProjects } from './ProjectContext';
import { getLayoutedElements } from '../lib/layout';

const nodeTypes = { orgNode: OrgNode };

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#d1d5db' },
  style: { strokeWidth: 1.5, stroke: '#d1d5db' },
};

function Flow({ chartId }: { chartId: string }) {
  const storageKey = `orgbuilder-${chartId}`;
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();
  const [mounted, setMounted] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const { projects, setProjects } = useProjects();

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) setSelectedNodeId(nodes[0].id);
      else setSelectedNodeId(null);
    },
  });

  const onSelectNode = useCallback((id: string) => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === id })));
  }, [setNodes]);

  const onAddSubordinate = useCallback((parentId: string) => {
    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId, type: 'orgNode',
      position: { x: parentNode.position.x, y: parentNode.position.y + 150 },
      data: { name: 'New Employee', title: 'Role' }, selected: true,
    };
    const newEdge: Edge = {
      id: `edge-${parentId}-${newNodeId}`, source: parentId, target: newNodeId,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#d1d5db' },
      style: { strokeWidth: 1.5, stroke: '#d1d5db' },
    };
    setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [nodes, setNodes, setEdges]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const { nodes: sn, edges: se } = JSON.parse(stored);
        if (sn && sn.length > 0) {
          setNodes(sn);
          setEdges((se || []).map((e: any) => ({
            ...e, type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#d1d5db' },
            style: { strokeWidth: 1.5, stroke: '#d1d5db' },
          })));
        } else { setShowEmptyState(true); }
      } catch { setShowEmptyState(true); }
    } else { setShowEmptyState(true); }
    setMounted(true);
  }, [setNodes, setEdges, storageKey]);

  useEffect(() => {
    if (mounted) localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }));
  }, [nodes, edges, mounted, storageKey]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]
  );

  const onAddNode = useCallback(() => {
    setShowEmptyState(false);
    setNodes((nds) => [...nds, {
      id: `node-${Date.now()}`, type: 'orgNode',
      position: { x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 },
      data: { name: 'New Employee', title: 'Role' },
    }]);
  }, [setNodes]);

  const onStartBlank = useCallback(() => {
    setShowEmptyState(false);
    setNodes([{ id: `node-${Date.now()}`, type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Team Lead', title: 'Role' } }]);
    setTimeout(() => fitView({ duration: 500, padding: 0.3 }), 100);
  }, [setNodes, fitView]);

  const onSelectTemplate = useCallback((templateNodes: Node[], templateEdges: Edge[]) => {
    setShowEmptyState(false);
    const { nodes: layouted, edges: le } = getLayoutedElements(templateNodes, templateEdges, 'TB');
    setNodes([...layouted]);
    setEdges([...le]);
    setTimeout(() => fitView({ duration: 500, padding: 0.2 }), 100);
  }, [setNodes, setEdges, fitView]);

  const onAutoLayout = useCallback(() => {
    const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges, 'TB');
    setNodes([...ln]); setEdges([...le]);
    requestAnimationFrame(() => fitView({ duration: 500, padding: 0.2 }));
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const onClear = useCallback(() => {
    if (window.confirm('Clear entire chart?')) {
      setNodes([]); setEdges([]); localStorage.removeItem(storageKey); setShowEmptyState(true);
    }
  }, [setNodes, setEdges, storageKey]);

  const onExport = useCallback(() => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (!el) return;
    toPng(el, {
      backgroundColor: '#fff',
      filter: (n) => !n?.classList?.contains('react-flow__controls') && !n?.classList?.contains('react-flow__panel') && !n?.classList?.contains('react-flow__minimap'),
    }).then((url) => { const a = document.createElement('a'); a.download = 'org-chart.png'; a.href = url; a.click(); }).catch(() => {});
  }, []);

  const onExportData = useCallback(() => {
    const blob = new Blob([JSON.stringify({ nodes, edges, projects }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orgbuilder-data.json'; a.click();
  }, [nodes, edges, projects]);

  const onImportData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const p = JSON.parse(ev.target?.result as string);
        if (p.nodes && p.edges) {
          setShowEmptyState(false); setNodes(p.nodes);
          setEdges(p.edges.map((edge: any) => ({ ...edge, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#d1d5db' }, style: { strokeWidth: 1.5, stroke: '#d1d5db' } })));
          if (p.projects) setProjects(p.projects);
          setTimeout(() => fitView({ duration: 500, padding: 0.2 }), 100);
        }
      } catch { alert('Invalid file.'); }
      e.target.value = '';
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, setProjects, fitView]);

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('react-flow__pane')) onAddNode();
  }, [onAddNode]);

  if (!mounted) return <div className="w-full h-full bg-white" />;

  return (
    <div className="w-full h-full relative" onDoubleClick={onDoubleClick}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView connectionRadius={40}
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.1} maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} color="#e2e8f0" gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap nodeStrokeWidth={2} zoomable pannable style={{ width: 120, height: 80 }} />
        <Panel position="top-center">
          <Toolbar
            onAddNode={onAddNode} onAutoLayout={onAutoLayout}
            onExportPng={onExport} onExportData={onExportData}
            onImportData={onImportData} onClear={onClear}
            onManageProjects={() => setShowProjectsModal(true)}
          />
        </Panel>
      </ReactFlow>

      <SidePanel selectedNodeId={selectedNodeId} onClose={() => onSelectNode('')} onSelectNode={onSelectNode} onAddSubordinate={onAddSubordinate} nodes={nodes as any} edges={edges} />
      <Legend />
      <StatsBar nodes={nodes} edges={edges} onSelectNode={onSelectNode} />
      {showEmptyState && <EmptyState onStartBlank={onStartBlank} onSelectTemplate={onSelectTemplate} />}
      {showProjectsModal && <ProjectsModal onClose={() => setShowProjectsModal(false)} />}
    </div>
  );
}

export default function OrgChartCanvas({ chartId }: { chartId: string }) {
  return (
    <div className="w-full h-full font-sans relative">
      <ProjectProvider chartId={chartId}>
        <ReactFlowProvider>
          <Flow chartId={chartId} />
        </ReactFlowProvider>
      </ProjectProvider>
    </div>
  );
}
