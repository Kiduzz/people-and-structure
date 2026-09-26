import { X, Plus, Trash2 } from 'lucide-react';
import { useProjects, Project } from './ProjectContext';

const PRESET_COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#f59e0b', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9',
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
    if (window.confirm('Delete this project? Nodes assigned to it will revert to no project.')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh] border border-gray-200/60 animate-scale-in overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/50 to-transparent">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Projects</h2>
            <p className="text-xs text-gray-500 mt-0.5">Color-code your org chart by project</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">No projects yet</p>
              <p className="text-xs text-gray-400">Create one to start color-coding your chart</p>
            </div>
          ) : (
            projects.map(proj => (
              <div key={proj.id} className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-200/60 hover:shadow-sm transition-all group">
                <div className="relative">
                  <input
                    type="color"
                    value={proj.color}
                    onChange={(e) => updateProject(proj.id, 'color', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
                  />
                </div>
                <input
                  className="flex-1 px-3 py-2 bg-white border border-gray-200/60 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  placeholder="Project Name"
                />
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={addProject}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
