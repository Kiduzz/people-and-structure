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
  const btn = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors";
  const sep = "w-px h-4 bg-gray-200";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-0.5 px-1.5 py-1 pointer-events-auto">
      <button onClick={onAddNode} className={btn}>
        <Plus size={14} /> Add
      </button>
      <div className={sep} />
      <button onClick={onManageProjects} className={btn}>
        <FolderKanban size={14} /> Projects
      </button>
      <div className={sep} />
      <button onClick={onAutoLayout} className={btn}>
        <LayoutDashboard size={14} /> Layout
      </button>
      <div className={sep} />
      <label className={`${btn} cursor-pointer`}>
        <Upload size={14} /> Load
        <input type="file" accept=".json" className="hidden" onChange={onImportData} />
      </label>
      <button onClick={onExportData} className={btn}>
        <FileJson size={14} /> Save
      </button>
      <button onClick={onExportPng} className={btn}>
        <ImageIcon size={14} /> PNG
      </button>
      <div className={sep} />
      <button onClick={onClear} className={`${btn} text-red-500 hover:text-red-600 hover:bg-red-50`}>
        <Trash2 size={14} /> Clear
      </button>
    </div>
  );
}
