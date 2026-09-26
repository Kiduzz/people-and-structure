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

// Deterministic avatar color from name
const avatarColors = [
  ['from-blue-400', 'to-blue-600'],
  ['from-indigo-400', 'to-indigo-600'],
  ['from-violet-400', 'to-violet-600'],
  ['from-purple-400', 'to-purple-600'],
  ['from-pink-400', 'to-pink-600'],
  ['from-rose-400', 'to-rose-600'],
  ['from-orange-400', 'to-orange-500'],
  ['from-amber-400', 'to-amber-600'],
  ['from-emerald-400', 'to-emerald-600'],
  ['from-teal-400', 'to-teal-600'],
  ['from-cyan-400', 'to-cyan-600'],
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % avatarColors.length;
  return avatarColors[idx];
}

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
  const [colorFrom, colorTo] = getAvatarColor(data.name || id);

  return (
    <div
      style={project ? { borderColor: project.color } : {}}
      className={`relative flex flex-row items-center bg-white/95 backdrop-blur-md border rounded-2xl w-64 transition-all duration-300 group overflow-visible ${
        selected 
          ? 'shadow-[0_8px_30px_rgb(59,130,246,0.25)] ring-2 ring-blue-500/30 border-blue-500 scale-[1.03] z-50' 
          : 'shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:scale-[1.01] border-gray-200/80 hover:border-gray-300'
      } ${project ? 'border-l-[5px]' : ''}`}
    >
      {/* Project badge */}
      {project && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-[2px] rounded-full text-[9px] font-extrabold text-white shadow-md whitespace-nowrap z-20 tracking-wider uppercase border-2 border-white" 
          style={{ backgroundColor: project.color }}
        >
          {project.name}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-5 h-5 !bg-blue-500 border-[3px] border-white shadow-md hover:!bg-blue-600 transition-all cursor-crosshair hover:scale-125 !-top-[10px]" />

      {/* Avatar */}
      <div className="pl-3 py-3 shrink-0">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} flex items-center justify-center text-white text-sm font-extrabold shadow-lg shadow-blue-500/10 select-none`}>
          {initials}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 px-3 py-3 min-w-0 flex flex-col gap-0.5">
        <input
          className="nodrag text-sm font-bold text-gray-800 outline-none w-full bg-transparent placeholder-gray-300 truncate leading-tight"
          value={data.name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="nodrag text-[11px] font-semibold text-gray-400 outline-none w-full bg-transparent placeholder-gray-300 truncate leading-tight"
          value={data.title}
          onChange={onChangeTitle}
          placeholder="Role/Title"
        />
        {data.email && (
          <span className="text-[10px] text-gray-400 truncate font-medium mt-0.5">{data.email}</span>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 hover:scale-110 z-30 cursor-pointer"
        title="Delete Node"
      >
        ×
      </button>

      <Handle type="source" position={Position.Bottom} className="w-5 h-5 !bg-blue-500 border-[3px] border-white shadow-md hover:!bg-blue-600 transition-all cursor-crosshair hover:scale-125 !-bottom-[10px]" />
    </div>
  );
}
