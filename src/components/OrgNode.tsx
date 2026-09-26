import { Handle, Position, NodeProps, useReactFlow, Node } from '@xyflow/react';

export type OrgNodeData = {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  notes?: string;
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

  return (
    <div
      className={`relative flex flex-col bg-white border-2 rounded-xl shadow-sm w-48 ${
        selected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
      } transition-all duration-200 group`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-400" />

      <div className="p-3 flex flex-col gap-1">
        <input
          className="text-sm font-semibold text-gray-800 outline-none w-full bg-transparent placeholder-gray-400"
          value={data.name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="text-xs text-gray-500 outline-none w-full bg-transparent placeholder-gray-300"
          value={data.title}
          onChange={onChangeTitle}
          placeholder="Role/Title"
        />
      </div>

      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 z-10"
        title="Delete Node"
      >
        ×
      </button>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-400" />
    </div>
  );
}
