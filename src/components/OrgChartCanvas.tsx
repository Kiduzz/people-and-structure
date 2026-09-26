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
  ReactFlowProvider,
  useReactFlow,
  Panel,
  useOnSelectionChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

import OrgNode from './OrgNode';
import Toolbar from './Toolbar';
import SidePanel from './SidePanel';
import ProjectsModal from './ProjectsModal';
import Legend from './Legend';
import { ProjectProvider } from './ProjectContext';
import { getLayoutedElements } from '../lib/layout';

const nodeTypes = {
  orgNode: OrgNode,
};

const STORAGE_KEY = 'orgbuilder-v1';

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();
  const [mounted, setMounted] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showProjectsModal, setShowProjectsModal] = useState(false);

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
      };

      setNodes((nds) => [...nds.map((n) => ({ ...n, selected: false })), newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, setNodes, setEdges]
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { nodes: storedNodes, edges: storedEdges } = JSON.parse(stored);
        setNodes(storedNodes || []);
        setEdges(storedEdges || []);
      } catch (e) {
        console.error('Failed to parse stored org chart', e);
      }
    } else {
      const rootNode: Node = {
        id: 'root-1',
        type: 'orgNode',
        position: { x: 0, y: 0 },
        data: { name: 'New Employee', title: 'Role' },
      };
      setNodes([rootNode]);
      // Small timeout to allow the canvas to measure and fit
      setTimeout(() => {
        fitView({ duration: 800, padding: 0.2 });
      }, 100);
    }
    setMounted(true);
  }, [setNodes, setEdges, fitView]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, mounted]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'orgNode',
      position: { x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 },
      data: { name: 'New Employee', title: 'Role' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

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
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setNodes, setEdges]);

  const onExport = useCallback(() => {
    const elem = document.querySelector('.react-flow') as HTMLElement;
    if (elem) {
      toPng(elem, {
        backgroundColor: '#f9fafb',
        filter: (node) => {
          if (
            node?.classList?.contains('react-flow__controls') ||
            node?.classList?.contains('react-flow__panel')
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

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('react-flow__pane')) {
      onAddNode();
    }
  }, [onAddNode]);

  if (!mounted) return <div className="w-full h-screen bg-gray-50 flex items-center justify-center">Loading canvas...</div>;

  return (
    <div className="w-full h-full" onDoubleClick={onDoubleClick}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        className="bg-gray-50"
        fitView
        connectionRadius={40}
      >
        <Background color="#ccc" gap={16} />
        <Controls />
        <Panel position="top-center">
          <Toolbar
            onAddNode={onAddNode}
            onAutoLayout={onAutoLayout}
            onExport={onExport}
            onClear={onClear}
            onManageProjects={() => setShowProjectsModal(true)}
          />
        </Panel>
      </ReactFlow>
      <SidePanel
        selectedNodeId={selectedNodeId}
        onClose={() => onSelectNode('')}
        onSelectNode={onSelectNode}
        onAddSubordinate={onAddSubordinate}
        nodes={nodes as any}
        edges={edges}
      />
      <Legend />
      {showProjectsModal && <ProjectsModal onClose={() => setShowProjectsModal(false)} />}
    </div>
  );
}

export default function OrgChartCanvas() {
  return (
    <div className="w-full h-screen font-sans">
      <ProjectProvider>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </ProjectProvider>
    </div>
  );
}
