"use client";
import { useState, useEffect } from 'react';
import OrgChartCanvas from './OrgChartCanvas';
import { Plus, X, CircleHelp } from 'lucide-react';

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

type ChartTab = {
  id: string;
  name: string;
};

const REPO_URL = 'https://github.com/Kiduzz/people-and-structure';

const tips = [
  { key: 'Add people', desc: 'Click "Add" in the toolbar or double-click the canvas' },
  { key: 'Connect', desc: 'Drag from the bottom dot of one node to the top dot of another' },
  { key: 'Edit details', desc: 'Click a node to open the side panel with all fields' },
  { key: 'Auto layout', desc: 'Click "Layout" to arrange nodes into a clean tree' },
  { key: 'Projects', desc: 'Color-code nodes by project via the "Projects" button' },
  { key: 'Multiple charts', desc: 'Click "+" in the tab bar to create separate charts' },
  { key: 'Save / Load', desc: 'Export your chart as JSON to share or back up' },
  { key: 'Search', desc: 'Click "Find" in the bottom bar to search by name or title' },
  { key: 'Delete', desc: 'Select a node or edge and press Backspace / Delete' },
];

export default function AppTabs() {
  const [charts, setCharts] = useState<ChartTab[]>([]);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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

        {/* Right side: Help + GitHub */}
        <div className="flex items-center gap-1 px-2 h-full shrink-0">
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="How to use"
          >
            <CircleHelp size={14} />
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="View source on GitHub"
          >
            <GitHubIcon size={14} />
          </a>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {activeChartId && <OrgChartCanvas key={activeChartId} chartId={activeChartId} />}
      </div>

      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">How to use OrgBuilder</h2>
              <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                <X size={14} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
              {tips.map(t => (
                <div key={t.key}>
                  <div className="text-xs font-medium text-gray-800">{t.key}</div>
                  <div className="text-xs text-gray-500">{t.desc}</div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <GitHubIcon size={12} /> Open source on GitHub
              </a>
              <button onClick={() => setShowHelp(false)} className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
