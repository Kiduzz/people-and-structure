"use client";
import { Node, Edge, MarkerType } from '@xyflow/react';

type Template = {
  id: string;
  name: string;
  count: string;
  nodes: Node[];
  edges: Edge[];
};

const edgeDefaults = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#d1d5db' },
  style: { strokeWidth: 1.5, stroke: '#d1d5db' },
};

const templates: Template[] = [
  {
    id: 'startup',
    name: 'Startup',
    count: '5 people',
    nodes: [
      { id: 'n1', type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Alex Chen', title: 'CEO' } },
      { id: 'n2', type: 'orgNode', position: { x: -200, y: 150 }, data: { name: 'Jordan Lee', title: 'CTO' } },
      { id: 'n3', type: 'orgNode', position: { x: 200, y: 150 }, data: { name: 'Sam Rivera', title: 'Head of Product' } },
      { id: 'n4', type: 'orgNode', position: { x: -200, y: 300 }, data: { name: 'Taylor Kim', title: 'Engineer' } },
      { id: 'n5', type: 'orgNode', position: { x: 200, y: 300 }, data: { name: 'Morgan Wu', title: 'Designer' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', ...edgeDefaults },
      { id: 'e1-3', source: 'n1', target: 'n3', ...edgeDefaults },
      { id: 'e2-4', source: 'n2', target: 'n4', ...edgeDefaults },
      { id: 'e3-5', source: 'n3', target: 'n5', ...edgeDefaults },
    ],
  },
  {
    id: 'department',
    name: 'Department',
    count: '7 people',
    nodes: [
      { id: 'n1', type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Sarah Johnson', title: 'VP Engineering' } },
      { id: 'n2', type: 'orgNode', position: { x: -250, y: 150 }, data: { name: 'David Park', title: 'Frontend Lead' } },
      { id: 'n3', type: 'orgNode', position: { x: 250, y: 150 }, data: { name: 'Lisa Zhang', title: 'Backend Lead' } },
      { id: 'n4', type: 'orgNode', position: { x: -350, y: 300 }, data: { name: 'Mike Torres', title: 'Engineer' } },
      { id: 'n5', type: 'orgNode', position: { x: -150, y: 300 }, data: { name: 'Amy Patel', title: 'Engineer' } },
      { id: 'n6', type: 'orgNode', position: { x: 150, y: 300 }, data: { name: 'Chris Nguyen', title: 'Engineer' } },
      { id: 'n7', type: 'orgNode', position: { x: 350, y: 300 }, data: { name: 'Emma Davis', title: 'DevOps' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', ...edgeDefaults },
      { id: 'e1-3', source: 'n1', target: 'n3', ...edgeDefaults },
      { id: 'e2-4', source: 'n2', target: 'n4', ...edgeDefaults },
      { id: 'e2-5', source: 'n2', target: 'n5', ...edgeDefaults },
      { id: 'e3-6', source: 'n3', target: 'n6', ...edgeDefaults },
      { id: 'e3-7', source: 'n3', target: 'n7', ...edgeDefaults },
    ],
  },
  {
    id: 'flat',
    name: 'Flat Team',
    count: '5 people',
    nodes: [
      { id: 'n1', type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Pat Morgan', title: 'Team Lead' } },
      { id: 'n2', type: 'orgNode', position: { x: -300, y: 150 }, data: { name: 'Jamie Scott', title: 'Backend' } },
      { id: 'n3', type: 'orgNode', position: { x: -100, y: 150 }, data: { name: 'Casey Brooks', title: 'Frontend' } },
      { id: 'n4', type: 'orgNode', position: { x: 100, y: 150 }, data: { name: 'Drew Ellis', title: 'Design' } },
      { id: 'n5', type: 'orgNode', position: { x: 300, y: 150 }, data: { name: 'Riley Adams', title: 'QA' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', ...edgeDefaults },
      { id: 'e1-3', source: 'n1', target: 'n3', ...edgeDefaults },
      { id: 'e1-4', source: 'n1', target: 'n4', ...edgeDefaults },
      { id: 'e1-5', source: 'n1', target: 'n5', ...edgeDefaults },
    ],
  },
];

interface EmptyStateProps {
  onStartBlank: () => void;
  onSelectTemplate: (nodes: Node[], edges: Edge[]) => void;
}

export default function EmptyState({ onStartBlank, onSelectTemplate }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 pointer-events-auto">
      <div className="max-w-lg w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Start building your org chart
          </h2>
          <p className="text-sm text-gray-500">
            Pick a template or start from scratch.
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {templates.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.nodes, tmpl.edges)}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{tmpl.name}</span>
                <span className="text-xs text-gray-400 ml-2">{tmpl.count}</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-gray-600">Use →</span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onStartBlank}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Start with a blank canvas
          </button>
        </div>
      </div>
    </div>
  );
}
