"use client";
import { useState } from 'react';
import OrgChartCanvas from './OrgChartCanvas';
import TaskManager from './TaskManager';

export default function AppTabs() {
  const [activeTab, setActiveTab] = useState<'org' | 'tasks'>('org');

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-white font-sans">
      <div className="flex border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <button 
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'org' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('org')}
        >
          Organization Chart
        </button>
        <button 
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks & Calendar
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'org' ? <OrgChartCanvas /> : <TaskManager />}
      </div>
    </main>
  );
}
