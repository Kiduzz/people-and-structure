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

const nodeTypes = {
  orgNode: OrgNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#94a3b8',
  },
  style: {
    strokeWidth: 2,
    stroke: '#94a3b8',
  },
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
      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
  });

  const onSelectNode = useCallback(
    (id: string) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === id,
        }))
      );
    },
    [setNodes]
  );

  const onAddSubordinate = useCallback(
    (parentId: string) => {
      const parentNode = nodes.find((n) => n.id === parentId);
      if (!parentNode) return;

      const newNodeId = `node-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type: 'orgNode',
        position: { x: parentNode.position.x, y: parentNode.position.y + 150 },
        data: { name: 'New Employee', title: 'Role' },
        selected: true,
      };
      const newEdge: Edge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#94a3b8' },
        style: { strokeWidth: 2, stroke: '#94a3b8' },
      };

      setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, setNodes, setEdges]
  );

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const { nodes: storedNodes, edges: storedEdges } = JSON.parse(stored);
        if (storedNodes && storedNodes.length > 0) {
          setNodes(storedNodes || []);
          const upgradedEdges = (storedEdges || []).map((edge: any) => ({
            ...edge,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#94a3b8' },
            style: { strokeWidth: 2, stroke: '#94a3b8' },
          }));
          setEdges(upgradedEdges);
        } else {
          setShowEmptyState(true);
        }
      } catch (e) {
        console.error('Failed to parse stored org chart', e);
        setShowEmptyState(true);
      }
    } else {
      setShowEmptyState(true);
    }
    setMounted(true);
  }, [setNodes, setEdges, storageKey]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, mounted, storageKey]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    setShowEmptyState(false);
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'orgNode',
      position: { x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 },
      data: { name: 'New Employee', title: 'Role' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onStartBlank = useCallback(() => {
    setShowEmptyState(false);
    const rootNode: Node = {
      id: `node-${Date.now()}`,
      type: 'orgNode',
      position: { x: 0, y: 0 },
      data: { name: 'Team Lead', title: 'Role' },
    };
    setNodes([rootNode]);
    setTimeout(() => fitView({ duration: 800, padding: 0.3 }), 100);
  }, [setNodes, fitView]);

  const onSelectTemplate = useCallback((templateNodes: Node[], templateEdges: Edge[]) => {
    setShowEmptyState(false);
    setNodes(templateNodes);
    setEdges(templateEdges);
    setTimeout(() => {
      const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(templateNodes, templateEdges, 'TB');
      setNodes([...layouted]);
      setEdges([...layoutedEdges]);
      setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 50);
    }, 50);
  }, [setNodes, setEdges, fitView]);

  const onAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'TB'
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    window.requestAnimationFrame(() => {
      fitView({ duration: 800, padding: 0.2 });
    });
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const onClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire chart?')) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem(storageKey);
      setShowEmptyState(true);
    }
  }, [setNodes, setEdges, storageKey]);

  const onExport = useCallback(() => {
    const elem = document.querySelector('.react-flow') as HTMLElement;
    if (elem) {
      toPng(elem, {
        backgroundColor: '#f8fafc',
        filter: (node) => {
          if (
            node?.classList?.contains('react-flow__controls') ||
            node?.classList?.contains('react-flow__panel') ||
            node?.classList?.contains('react-flow__minimap')
          ) {
            return false;
          }
          return true;
        },
      }).then((dataUrl) => {
        const a = document.createElement('a');
        a.setAttribute('download', 'org-chart.png');
        a.setAttribute('href', dataUrl);
        a.click();
      }).catch(err => {
        console.error('Failed to export image', err);
      });
    }
  }, []);

  const onExportData = useCallback(() => {
    const data = JSON.stringify({ nodes, edges, projects }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orgbuilder-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, projects]);

  const onImportData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.nodes && parsed.edges) {
          setShowEmptyState(false);
          setNodes(parsed.nodes);
          
          const upgradedEdges = parsed.edges.map((edge: any) => ({
            ...edge,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#94a3b8' },
            style: { strokeWidth: 2, stroke: '#94a3b8' },
          }));
          setEdges(upgradedEdges);

          if (parsed.projects) {
            setProjects(parsed.projects);
          }
          setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 100);
        } else {
          alert('Invalid JSON file format. Must contain nodes and edges.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, setProjects, fitView]);

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('react-flow__pane')) {
      onAddNode();
    }
  }, [onAddNode]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg"></div>
          <span className="text-sm font-medium text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" onDoubleClick={onDoubleClick}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20"
        fitView
        connectionRadius={40}
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} color="#cbd5e1" gap={24} size={1.5} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
          style={{ width: 140, height: 100 }}
        />
        <Panel position="top-center">
          <Toolbar
            onAddNode={onAddNode}
            onAutoLayout={onAutoLayout}
            onExportPng={onExport}
            onExportData={onExportData}
            onImportData={onImportData}
            onClear={onClear}
            onManageProjects={() => setShowProjectsModal(true)}
          />
        </Panel>
      </ReactFlow>

      {/* Side Panel */}
      <SidePanel
        selectedNodeId={selectedNodeId}
        onClose={() => onSelectNode('')}
        onSelectNode={onSelectNode}
        onAddSubordinate={onAddSubordinate}
        nodes={nodes as any}
        edges={edges}
      />

      {/* Legend */}
      <Legend />

      {/* Stats and Search */}
      <StatsBar nodes={nodes} edges={edges} onSelectNode={onSelectNode} />

      {/* Empty State with Templates */}
      {showEmptyState && (
        <EmptyState onStartBlank={onStartBlank} onSelectTemplate={onSelectTemplate} />
      )}

      {/* Projects Modal */}
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
