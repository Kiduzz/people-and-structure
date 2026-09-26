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
      style={project ? { borderColor: project.color } : {}}
      className={`relative flex flex-col bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl w-56 transition-all duration-300 group ${
        selected ? 'shadow-[0_8px_30px_rgb(59,130,246,0.3)] ring-4 ring-blue-500/20 border-blue-500 scale-105 z-50' : 'shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-300'
      } ${project ? 'border-t-[6px]' : 'border-t-[6px] border-t-gray-100'}`}
    >
      {project && (
        <div 
          className="absolute -top-[14px] left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-md whitespace-nowrap z-20 tracking-wider uppercase border-2 border-white" 
          style={{ backgroundColor: project.color }}
        >
          {project.name}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-6 h-6 !bg-blue-500 border-4 border-white shadow-md hover:!bg-blue-600 transition-colors cursor-crosshair hover:scale-125" />

      <div className="p-4 flex flex-col gap-1.5">
        <input
          className="nodrag text-base font-bold text-gray-800 outline-none w-full bg-transparent placeholder-gray-300 truncate"
          value={data.name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="nodrag text-xs font-semibold text-gray-500 outline-none w-full bg-transparent placeholder-gray-300 truncate"
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
