import { Download, LayoutDashboard, Plus, Trash2, FolderKanban, Upload, FileJson, Image as ImageIcon } from 'lucide-react';

interface ToolbarProps {
  onAddNode: () => void;
  onAutoLayout: () => void;
  onExportPng: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onManageProjects: () => void;
}

export default function Toolbar({ onAddNode, onAutoLayout, onExportPng, onExportData, onImportData, onClear, onManageProjects }: ToolbarProps) {
  return (
    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 pointer-events-auto">
      <button onClick={onAddNode} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors">
        <Plus size={16} /> Add Node
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      <button onClick={onManageProjects} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors">
        <FolderKanban size={16} /> Projects
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      <button onClick={onAutoLayout} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors">
        <LayoutDashboard size={16} /> Auto Layout
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors cursor-pointer text-gray-700">
        <Upload size={16} /> Load Data
        <input type="file" accept=".json" className="hidden" onChange={onImportData} />
      </label>
      <button onClick={onExportData} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors text-gray-700">
        <FileJson size={16} /> Save Data
      </button>
      <button onClick={onExportPng} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors text-gray-700">
        <ImageIcon size={16} /> Save PNG
      </button>
      
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      <button onClick={onClear} className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600 rounded-md text-sm font-medium transition-colors">
        <Trash2 size={16} /> Clear Chart
      </button>
    </div>
  );
}
