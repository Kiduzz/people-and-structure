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
    <div className="absolute top-0 right-0 w-80 md:w-96 h-full bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.05)] border-l border-gray-200 z-50 flex flex-col pointer-events-auto transform transition-transform duration-300">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Node Details</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
          <input
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={selectedNode.data.name}
            onChange={(e) => updateData('name', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role / Title</label>
          <input
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={selectedNode.data.title}
            onChange={(e) => updateData('title', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={selectedNode.data.email || ''}
            onChange={(e) => updateData('email', e.target.value)}
            placeholder="person@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
          <input
            type="tel"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={selectedNode.data.phone || ''}
            onChange={(e) => updateData('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
          <textarea
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all min-h-[120px] resize-y"
            value={selectedNode.data.notes || ''}
            onChange={(e) => updateData('notes', e.target.value)}
            placeholder="Additional details..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</label>
          <select
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={selectedNode.data.projectId || ''}
            onChange={(e) => updateData('projectId', e.target.value)}
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Subordinates ({subordinates.length})
            </label>
          </div>

          <div className="flex flex-col gap-2">
            {subordinates.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSelectNode(sub.id)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <User size={14} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-800 truncate">{sub.data.name || 'Unnamed'}</span>
                  <span className="text-xs text-gray-500 truncate">{sub.data.title || 'No Role'}</span>
                </div>
              </div>
            ))}
            {subordinates.length === 0 && (
              <span className="text-xs text-gray-400 italic px-2">No direct subordinates</span>
            )}
          </div>

          <button
            onClick={() => onAddSubordinate(selectedNodeId)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Subordinate
          </button>
        </div>
      </div>
    </div>
  );
}
