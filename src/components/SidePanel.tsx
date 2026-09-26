import { useReactFlow } from '@xyflow/react';
import { X, Plus, User } from 'lucide-react';
import { OrgNodeType, OrgNodeData } from './OrgNode';
import { useProjects } from './ProjectContext';

interface SidePanelProps {
  selectedNodeId: string | null;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  onAddSubordinate: (parentId: string) => void;
  nodes: OrgNodeType[];
  edges: any[];
}

export default function SidePanel({ selectedNodeId, onClose, onSelectNode, onAddSubordinate, nodes, edges }: SidePanelProps) {
  const { setNodes } = useReactFlow();
  const { projects } = useProjects();

  if (!selectedNodeId) return null;

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return null;

  const updateData = (field: keyof OrgNodeData, value: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNodeId) {
          return { ...n, data: { ...n.data, [field]: value } };
        }
        return n;
      })
    );
  };

  const subordinates = edges
    .filter((e) => e.source === selectedNodeId)
    .map((e) => nodes.find((n) => n.id === e.target))
    .filter(Boolean) as OrgNodeType[];

  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 md:w-96 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/60 rounded-3xl z-50 flex flex-col pointer-events-auto transform transition-all duration-300">
      <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-b from-gray-50/50 to-transparent">
        <h2 className="font-bold text-gray-900 text-lg tracking-tight">Details</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all shadow-sm border border-transparent hover:border-gray-200">
          <X size={16} />
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</label>
          <input
            className="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/60 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
            value={selectedNode.data.name}
            onChange={(e) => updateData('name', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role / Title</label>
          <input
            className="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/60 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
            value={selectedNode.data.title}
            onChange={(e) => updateData('title', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/60 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
            value={selectedNode.data.email || ''}
            onChange={(e) => updateData('email', e.target.value)}
            placeholder="person@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/60 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
            value={selectedNode.data.phone || ''}
            onChange={(e) => updateData('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Project</label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none"
            value={selectedNode.data.projectId || ''}
            onChange={(e) => updateData('projectId', e.target.value)}
          >
            <option value="">No Project Assigned</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Notes</label>
          <textarea
            className="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200/60 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all min-h-[100px] resize-y shadow-sm"
            value={selectedNode.data.notes || ''}
            onChange={(e) => updateData('notes', e.target.value)}
            placeholder="Additional details..."
          />
        </div>

        <div className="mt-2 pt-6 border-t border-gray-200/60">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Direct Reports ({subordinates.length})
            </label>
            <button
              onClick={() => onAddSubordinate(selectedNodeId)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors border border-blue-200/50 shadow-sm"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {subordinates.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSelectNode(sub.id)}
                className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-white rounded-xl cursor-pointer border border-gray-200/60 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-200 group-hover:scale-105 transition-transform">
                  <User size={16} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-700 transition-colors">{sub.data.name || 'Unnamed'}</span>
                  <span className="text-xs font-medium text-gray-500 truncate">{sub.data.title || 'No Role'}</span>
                </div>
              </div>
            ))}
            {subordinates.length === 0 && (
              <div className="text-center p-4 bg-gray-50/50 border border-gray-200/60 border-dashed rounded-xl">
                <span className="text-xs text-gray-400 font-medium">No direct reports assigned</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
