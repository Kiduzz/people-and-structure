import { useProjects } from './ProjectContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Legend() {
  const { projects } = useProjects();
  const [open, setOpen] = useState(true);

  if (projects.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 bg-white border border-gray-200 rounded-lg shadow-sm z-10 w-44 overflow-hidden pointer-events-auto">
      <button
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        Projects
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      
      {open && (
        <div className="px-2 pb-2 flex flex-col gap-0.5">
          {projects.map(proj => (
            <div key={proj.id} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-gray-700 font-medium">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
              <span className="truncate">{proj.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
