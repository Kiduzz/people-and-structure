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

  const label = "text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1";
  const input = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="absolute top-2 right-2 bottom-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col pointer-events-auto overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-sm">Details</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
        <div>
          <div className={label}>Name</div>
          <input className={input} value={selectedNode.data.name} onChange={(e) => updateData('name', e.target.value)} />
        </div>

        <div>
          <div className={label}>Role</div>
          <input className={input} value={selectedNode.data.title} onChange={(e) => updateData('title', e.target.value)} />
        </div>

        <div>
          <div className={label}>Email</div>
          <input type="email" className={input} value={selectedNode.data.email || ''} onChange={(e) => updateData('email', e.target.value)} placeholder="email@example.com" />
        </div>

        <div>
          <div className={label}>Phone</div>
          <input type="tel" className={input} value={selectedNode.data.phone || ''} onChange={(e) => updateData('phone', e.target.value)} placeholder="+1 555-000-0000" />
        </div>

        <div>
          <div className={label}>Project</div>
          <select
            className={input}
            value={selectedNode.data.projectId || ''}
            onChange={(e) => updateData('projectId', e.target.value)}
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className={label}>Notes</div>
          <textarea
            className={`${input} min-h-[80px] resize-y`}
            value={selectedNode.data.notes || ''}
            onChange={(e) => updateData('notes', e.target.value)}
            placeholder="Notes..."
          />
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className={label}>Reports ({subordinates.length})</span>
            <button
              onClick={() => onAddSubordinate(selectedNodeId)}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <Plus size={12} /> Add
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {subordinates.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectNode(sub.id)}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors text-left w-full"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User size={12} className="text-gray-400" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-gray-800 truncate">{sub.data.name || 'Unnamed'}</div>
                  <div className="text-[10px] text-gray-400 truncate">{sub.data.title || 'No Role'}</div>
                </div>
              </button>
            ))}
            {subordinates.length === 0 && (
              <p className="text-[11px] text-gray-400 py-1">No direct reports</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
