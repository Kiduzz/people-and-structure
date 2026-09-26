import { X, Plus, Trash2 } from 'lucide-react';
import { useProjects, Project } from './ProjectContext';

const PRESET_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#06b6d4',
];

export default function ProjectsModal({ onClose }: { onClose: () => void }) {
  const { projects, setProjects } = useProjects();

  const addProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: 'New Project',
      color: PRESET_COLORS[projects.length % PRESET_COLORS.length],
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteProject = (id: string) => {
    if (window.confirm('Delete this project? Nodes will revert to default.')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100] pointer-events-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm flex flex-col max-h-[70vh] border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Manage Projects</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2">
          {projects.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No projects yet. Add one to color-code your chart.</p>
          )}
          {projects.map(proj => (
            <div key={proj.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-100 group">
              <input
                type="color"
                value={proj.color}
                onChange={(e) => updateProject(proj.id, 'color', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <input
                className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                value={proj.name}
                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                placeholder="Project Name"
              />
              <button
                onClick={() => deleteProject(proj.id)}
                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={addProject}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
