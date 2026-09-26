import { Handle, Position, NodeProps, useReactFlow, Node } from '@xyflow/react';
import { useProjects } from './ProjectContext';

export type OrgNodeData = {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  notes?: string;
  projectId?: string;
};

export type OrgNodeType = Node<OrgNodeData, 'orgNode'>;

function getInitials(name: string) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function OrgNode({ id, data, selected }: NodeProps<OrgNodeType>) {
  const { setNodes, setEdges } = useReactFlow();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, name: e.target.value } };
        }
        return node;
      })
    );
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, title: e.target.value } };
        }
        return node;
      })
    );
  };

  const onDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const { projects } = useProjects();
  const project = projects.find(p => p.id === data.projectId);
  const initials = getInitials(data.name);

  return (
    <div
      className={`relative flex flex-row items-center bg-white border rounded-lg w-60 transition-shadow duration-150 group ${
        selected ? 'border-blue-500 shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
      style={project ? { borderLeftWidth: '4px', borderLeftColor: project.color } : {}}
    >
      {/* Project tag */}
      {project && (
        <div className="absolute -top-2.5 right-3 px-2 py-[1px] rounded text-[9px] font-semibold text-white" style={{ backgroundColor: project.color }}>
          {project.name}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-300 border-2 border-white hover:!bg-blue-500 transition-colors cursor-crosshair" />

      {/* Avatar */}
      <div className="pl-3 py-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 select-none">
          {initials}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 px-3 py-3 min-w-0 flex flex-col">
        <input
          className="nodrag text-sm font-semibold text-gray-900 outline-none w-full bg-transparent placeholder-gray-300 truncate"
          value={data.name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="nodrag text-xs text-gray-500 outline-none w-full bg-transparent placeholder-gray-300 truncate"
          value={data.title}
          onChange={onChangeTitle}
          placeholder="Role"
        />
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:border-red-300 z-10 cursor-pointer"
        title="Delete"
      >
        ×
      </button>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-300 border-2 border-white hover:!bg-blue-500 transition-colors cursor-crosshair" />
    </div>
  );
}
