"use client";
import { useState, useEffect } from 'react';
import OrgChartCanvas from './OrgChartCanvas';
import { Plus, X } from 'lucide-react';

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
        } else { initDefault(); }
      } catch (e) { initDefault(); }
    } else { initDefault(); }
    setMounted(true);
  }, []);

  const initDefault = () => {
    const defaultChart = { id: 'default-v1', name: 'Organization' };
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
    setCharts([...charts, { id, name: 'New Chart' }]);
    setActiveChartId(id);
  };

  const deleteChart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (charts.length === 1) return;
    if (window.confirm('Delete this chart?')) {
      const next = charts.filter(c => c.id !== id);
      setCharts(next);
      if (activeChartId === id) setActiveChartId(next[0].id);
      localStorage.removeItem(`orgbuilder-${id}`);
      localStorage.removeItem(`orgbuilder-projects-${id}`);
    }
  };

  const updateChartName = (id: string, name: string) => {
    setCharts(charts.map(c => c.id === id ? { ...c, name } : c));
  };

  if (!mounted) return null;

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-white">
      {/* Tab bar */}
      <div className="flex items-center h-10 border-b border-gray-200 bg-gray-50 px-1 shrink-0 z-20">
        <div className="flex items-center px-3 h-full shrink-0">
          <span className="text-xs font-semibold text-gray-800 tracking-tight">OrgBuilder</span>
        </div>

        <div className="flex flex-1 overflow-x-auto no-scrollbar items-end h-full">
          {charts.map(chart => (
            <div
              key={chart.id}
              onClick={() => setActiveChartId(chart.id)}
              className={`group flex items-center gap-1 px-3 h-full cursor-pointer text-xs border-b-2 transition-colors shrink-0 ${
                activeChartId === chart.id
                  ? 'border-blue-500 text-gray-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <input
                className="bg-transparent text-xs font-medium w-20 truncate outline-none"
                value={chart.name}
                onChange={(e) => updateChartName(chart.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {charts.length > 1 && (
                <button
                  onClick={(e) => deleteChart(chart.id, e)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addChart}
            className="flex items-center gap-1 px-2 h-full text-xs text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {activeChartId && <OrgChartCanvas key={activeChartId} chartId={activeChartId} />}
      </div>
    </main>
  );
}
