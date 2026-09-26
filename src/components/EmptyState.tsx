"use client";
import { Node, Edge, MarkerType } from '@xyflow/react';
import { Users, Building2, Rocket, FolderTree } from 'lucide-react';

type Template = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  nodes: Node[];
  edges: Edge[];
};

const edgeStyle = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#9ca3af' },
  style: { strokeWidth: 2, stroke: '#9ca3af' },
};

const templates: Template[] = [
  {
    id: 'startup',
    name: 'Startup Team',
    description: '5 people — CEO, CTO, Head of Product, Designer, Engineer',
    icon: <Rocket size={24} />,
    gradient: 'from-orange-400 to-pink-500',
    nodes: [
      { id: 'n1', type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Alex Chen', title: 'CEO & Co-founder' } },
      { id: 'n2', type: 'orgNode', position: { x: -200, y: 150 }, data: { name: 'Jordan Lee', title: 'CTO' } },
      { id: 'n3', type: 'orgNode', position: { x: 200, y: 150 }, data: { name: 'Sam Rivera', title: 'Head of Product' } },
      { id: 'n4', type: 'orgNode', position: { x: -200, y: 300 }, data: { name: 'Taylor Kim', title: 'Senior Engineer' } },
      { id: 'n5', type: 'orgNode', position: { x: 200, y: 300 }, data: { name: 'Morgan Wu', title: 'Lead Designer' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', ...edgeStyle },
      { id: 'e1-3', source: 'n1', target: 'n3', ...edgeStyle },
      { id: 'e2-4', source: 'n2', target: 'n4', ...edgeStyle },
      { id: 'e3-5', source: 'n3', target: 'n5', ...edgeStyle },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Department',
    description: '8 people — VP, Directors, Managers, and team leads',
    icon: <Building2 size={24} />,
    gradient: 'from-blue-500 to-indigo-600',
    nodes: [
      { id: 'n1', type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Sarah Johnson', title: 'VP of Engineering' } },
      { id: 'n2', type: 'orgNode', position: { x: -250, y: 150 }, data: { name: 'David Park', title: 'Director, Frontend' } },
      { id: 'n3', type: 'orgNode', position: { x: 250, y: 150 }, data: { name: 'Lisa Zhang', title: 'Director, Backend' } },
      { id: 'n4', type: 'orgNode', position: { x: -400, y: 300 }, data: { name: 'Mike Torres', title: 'Engineering Manager' } },
      { id: 'n5', type: 'orgNode', position: { x: -100, y: 300 }, data: { name: 'Amy Patel', title: 'Senior Engineer' } },
      { id: 'n6', type: 'orgNode', position: { x: 100, y: 300 }, data: { name: 'Chris Nguyen', title: 'Engineering Manager' } },
      { id: 'n7', type: 'orgNode', position: { x: 400, y: 300 }, data: { name: 'Emma Davis', title: 'Staff Engineer' } },
      { id: 'n8', type: 'orgNode', position: { x: 0, y: 450 }, data: { name: 'Ryan Cooper', title: 'DevOps Lead' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', ...edgeStyle },
      { id: 'e1-3', source: 'n1', target: 'n3', ...edgeStyle },
      { id: 'e2-4', source: 'n2', target: 'n4', ...edgeStyle },
      { id: 'e2-5', source: 'n2', target: 'n5', ...edgeStyle },
      { id: 'e3-6', source: 'n3', target: 'n6', ...edgeStyle },
      { id: 'e3-7', source: 'n3', target: 'n7', ...edgeStyle },
      { id: 'e3-8', source: 'n3', target: 'n8', ...edgeStyle },
    ],
  },
  {
    id: 'project',
    name: 'Project Team',
    description: '6 people — Project Lead with cross-functional team',
    icon: <FolderTree size={24} />,
    gradient: 'from-emerald-400 to-teal-600',
    nodes: [
      { id: 'n1', type: 'orgNode', position: { x: 0, y: 0 }, data: { name: 'Pat Morgan', title: 'Project Lead' } },
      { id: 'n2', type: 'orgNode', position: { x: -300, y: 150 }, data: { name: 'Jamie Scott', title: 'Backend Dev' } },
      { id: 'n3', type: 'orgNode', position: { x: -100, y: 150 }, data: { name: 'Casey Brooks', title: 'Frontend Dev' } },
      { id: 'n4', type: 'orgNode', position: { x: 100, y: 150 }, data: { name: 'Drew Ellis', title: 'UI/UX Designer' } },
      { id: 'n5', type: 'orgNode', position: { x: 300, y: 150 }, data: { name: 'Riley Adams', title: 'QA Engineer' } },
      { id: 'n6', type: 'orgNode', position: { x: 0, y: 300 }, data: { name: 'Quinn Hayes', title: 'DevOps' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', ...edgeStyle },
      { id: 'e1-3', source: 'n1', target: 'n3', ...edgeStyle },
      { id: 'e1-4', source: 'n1', target: 'n4', ...edgeStyle },
      { id: 'e1-5', source: 'n1', target: 'n5', ...edgeStyle },
      { id: 'e1-6', source: 'n1', target: 'n6', ...edgeStyle },
    ],
  },
];

interface EmptyStateProps {
  onStartBlank: () => void;
  onSelectTemplate: (nodes: Node[], edges: Edge[]) => void;
}

export default function EmptyState({ onStartBlank, onSelectTemplate }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pointer-events-auto">
      <div className="max-w-3xl w-full mx-4 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 mb-6">
            <Users className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Build Your Org Chart
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            Start from scratch or pick a template to plan your team structure visually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {templates.map((tmpl, i) => (
            <button
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.nodes, tmpl.edges)}
              className="group relative bg-white border border-gray-200/80 rounded-2xl p-6 text-left hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tmpl.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tmpl.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                {tmpl.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-base">{tmpl.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{tmpl.description}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onStartBlank}
            className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors px-6 py-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200"
          >
            or start with a blank canvas →
          </button>
        </div>
      </div>
    </div>
  );
}
