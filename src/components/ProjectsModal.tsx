import { X, Plus, Trash2 } from 'lucide-react';
import { useProjects, Project } from './ProjectContext';

const PRESET_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1', '#84cc16'];

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
    if (window.confirm('Delete this project? (Nodes assigned to it will revert to no project)')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] pointer-events-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Manage Projects</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No projects yet. Create one to color-code your org chart.</p>
          ) : (
            projects.map(proj => (
              <div key={proj.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <input
                  type="color"
                  value={proj.color}
                  onChange={(e) => updateProject(proj.id, 'color', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  className="flex-1 px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  placeholder="Project Name"
                />
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
