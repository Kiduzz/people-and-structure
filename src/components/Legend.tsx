import { useProjects } from './ProjectContext';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Legend() {
  const { projects } = useProjects();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (projects.length === 0) return null;

  return (
    <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-48 overflow-hidden pointer-events-auto transition-all">
      <div 
        className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Projects Legend</span>
        {isCollapsed ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </div>
      
      {!isCollapsed && (
        <div className="p-2 max-h-48 overflow-y-auto flex flex-col gap-1">
          {projects.map(proj => (
            <div key={proj.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-md transition-colors">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: proj.color }}></div>
              <span className="text-xs text-gray-700 truncate font-medium">{proj.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
