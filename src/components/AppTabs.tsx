"use client";
import { useState, useEffect } from 'react';
import OrgChartCanvas from './OrgChartCanvas';
import { Plus, X, LayoutTemplate } from 'lucide-react';

type ChartTab = {
  id: string;
  name: string;
};

export default function AppTabs() {
  const [charts, setCharts] = useState<ChartTab[]>([]);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('orgbuilder-charts-list');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setCharts(parsed);
          setActiveChartId(parsed[0].id);
        } else {
          initDefault();
        }
      } catch (e) {
        initDefault();
      }
    } else {
      initDefault();
    }
    setMounted(true);
  }, []);

  const initDefault = () => {
    const defaultChart = { id: 'default-v1', name: 'Main Organization' };
    setCharts([defaultChart]);
    setActiveChartId('default-v1');
  };

  useEffect(() => {
    if (mounted && charts.length > 0) {
      localStorage.setItem('orgbuilder-charts-list', JSON.stringify(charts));
    }
  }, [charts, mounted]);

  const addChart = () => {
    const id = `chart-${Date.now()}`;
    const newChart = { id, name: `New Chart` };
    setCharts([...charts, newChart]);
    setActiveChartId(id);
  };

  const deleteChart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (charts.length === 1) {
      alert("You cannot delete your only chart.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this chart?")) {
      const newCharts = charts.filter(c => c.id !== id);
      setCharts(newCharts);
      if (activeChartId === id) {
        setActiveChartId(newCharts[0].id);
      }
      localStorage.removeItem(`orgbuilder-${id}`);
      localStorage.removeItem(`orgbuilder-projects-${id}`);
    }
  };

  const updateChartName = (id: string, newName: string) => {
    setCharts(charts.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  if (!mounted) return null;

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-sans">
      {/* Premium Header/Tabs Area */}
      <div className="flex items-center border-b border-gray-200/60 bg-white/60 backdrop-blur-xl px-2 shrink-0 z-20 shadow-sm relative h-14">
        <div className="flex items-center pl-3 pr-5 py-2 border-r border-gray-200/60 h-full">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
             <LayoutTemplate className="text-white" size={16} />
          </div>
          <span className="ml-3 font-extrabold text-gray-900 tracking-tight text-lg">OrgBuilder</span>
        </div>

        <div className="flex flex-1 overflow-x-auto no-scrollbar gap-1 px-2 items-end h-full pt-2">
          {charts.map(chart => (
             <div 
               key={chart.id}
               onClick={() => setActiveChartId(chart.id)}
               className={`group flex items-center gap-2 px-4 py-2 min-w-[140px] max-w-[220px] cursor-pointer rounded-t-xl transition-all duration-300 border border-b-0 h-full relative ${
                 activeChartId === chart.id 
                   ? 'bg-white border-gray-200/80 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)] z-10' 
                   : 'bg-transparent border-transparent hover:bg-gray-100/50 hover:text-gray-900 z-0'
               }`}
             >
                {activeChartId === chart.id && <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-white z-20"></div>}
                
                <input 
                  className={`bg-transparent text-sm font-semibold w-full truncate focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 -ml-1 transition-colors ${
                    activeChartId === chart.id ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                  value={chart.name}
                  onChange={(e) => updateChartName(chart.id, e.target.value)}
                  placeholder="Chart Name"
                />
                <button 
                  onClick={(e) => deleteChart(chart.id, e)}
                  className={`p-1 rounded-md transition-all shrink-0 ${
                    activeChartId === chart.id ? 'text-gray-300 hover:text-red-500 hover:bg-red-50' : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <X size={14} />
                </button>
             </div>
          ))}
          <button 
            onClick={addChart}
            className="flex items-center gap-2 px-3 py-1.5 mb-1.5 ml-2 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shrink-0"
          >
            <Plus size={16} /> New Chart
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-transparent">
        {activeChartId && <OrgChartCanvas key={activeChartId} chartId={activeChartId} />}
      </div>
    </main>
  );
}
