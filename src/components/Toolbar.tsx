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
    <div className="bg-white/80 backdrop-blur-xl px-2 py-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/60 flex items-center gap-1 pointer-events-auto transition-all">
      <button onClick={onAddNode} className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold text-gray-700 transition-all border border-transparent hover:border-gray-200/60">
        <Plus size={16} className="text-blue-600" /> Add Node
      </button>
      <div className="w-px h-5 bg-gray-200/80 mx-1"></div>
      <button onClick={onManageProjects} className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold text-gray-700 transition-all border border-transparent hover:border-gray-200/60">
        <FolderKanban size={16} className="text-purple-500" /> Projects
      </button>
      <div className="w-px h-5 bg-gray-200/80 mx-1"></div>
      <button onClick={onAutoLayout} className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold text-gray-700 transition-all border border-transparent hover:border-gray-200/60">
        <LayoutDashboard size={16} className="text-indigo-500" /> Auto Layout
      </button>
      <div className="w-px h-5 bg-gray-200/80 mx-1"></div>
      
      <label className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold text-gray-700 transition-all cursor-pointer border border-transparent hover:border-gray-200/60">
        <Upload size={16} className="text-teal-500" /> Load Data
        <input type="file" accept=".json" className="hidden" onChange={onImportData} />
      </label>
      <button onClick={onExportData} className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold text-gray-700 transition-all border border-transparent hover:border-gray-200/60">
        <FileJson size={16} className="text-amber-500" /> Save Data
      </button>
      <button onClick={onExportPng} className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full text-sm font-semibold text-gray-700 transition-all border border-transparent hover:border-gray-200/60">
        <ImageIcon size={16} className="text-emerald-500" /> Save PNG
      </button>
      
      <div className="w-px h-5 bg-gray-200/80 mx-1"></div>
      <button onClick={onClear} className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 hover:shadow-sm text-red-600 rounded-full text-sm font-semibold transition-all border border-transparent hover:border-red-200">
        <Trash2 size={16} /> Clear Chart
      </button>
    </div>
  );
}
