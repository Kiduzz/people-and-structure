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
  const borderColor = project ? project.color : '';

  return (
    <div
      style={project ? { borderColor } : {}}
      className={`relative flex flex-col bg-white border-2 rounded-xl shadow-sm w-48 ${
        selected ? 'shadow-md ring-2 ring-blue-500/20' : 'hover:shadow-md'
      } ${!project ? (selected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300') : ''} transition-all duration-200 group`}
    >
      {project && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm whitespace-nowrap z-20" 
          style={{ backgroundColor: project.color }}
        >
          {project.name}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-6 h-6 !bg-blue-500 border-4 border-white shadow-sm hover:!bg-blue-600 transition-colors cursor-crosshair" />

      <div className="p-3 flex flex-col gap-1">
        <input
          className="nodrag text-sm font-semibold text-gray-800 outline-none w-full bg-transparent placeholder-gray-400"
          value={data.name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="nodrag text-xs text-gray-500 outline-none w-full bg-transparent placeholder-gray-300"
          value={data.title}
          onChange={onChangeTitle}
          placeholder="Role/Title"
        />
      </div>

      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 z-10 cursor-pointer"
        title="Delete Node"
      >
        ×
      </button>

      <Handle type="source" position={Position.Bottom} className="w-6 h-6 !bg-blue-500 border-4 border-white shadow-sm hover:!bg-blue-600 transition-colors cursor-crosshair" />
    </div>
  );
}
