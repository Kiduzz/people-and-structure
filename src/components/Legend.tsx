import { useProjects } from './ProjectContext';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Legend() {
  const { projects } = useProjects();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (projects.length === 0) return null;

  return (
    <div className="absolute top-20 right-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/60 z-10 w-48 overflow-hidden pointer-events-auto transition-all animate-slide-in-right">
      <div 
        className="px-4 py-2.5 border-b border-gray-200/40 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Projects</span>
        {isCollapsed ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
      </div>
      
      {!isCollapsed && (
        <div className="p-2 max-h-48 overflow-y-auto flex flex-col gap-0.5">
          {projects.map(proj => (
            <div key={proj.id} className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-50/50 rounded-xl transition-colors">
              <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: proj.color }}></div>
              <span className="text-xs text-gray-700 truncate font-semibold">{proj.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
