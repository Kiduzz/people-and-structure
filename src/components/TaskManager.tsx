import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Plus, CheckCircle2, Circle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};

const STORAGE_KEY = 'orgbuilder-tasks-v1';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = () => {
    const today = new Date().toISOString().split('T')[0];
    setTasks([...tasks, { id: `task-${Date.now()}`, title: '', date: today, completed: false }]);
  };

  const updateTask = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!mounted) return <div className="p-8">Loading tasks...</div>;

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50 border border-gray-100 min-h-[100px]"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.date === dateStr);
      
      days.push(
        <div key={d} className="bg-white border border-gray-200 min-h-[100px] p-2 flex flex-col">
          <span className="text-xs font-semibold text-gray-500 mb-1">{d}</span>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-24">
            {dayTasks.map(t => (
              <div 
                key={t.id} 
                className={`text-[10px] px-1.5 py-1 rounded truncate border ${t.completed ? 'bg-gray-100 text-gray-500 border-gray-200 line-through' : 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}
                title={t.title || 'Untitled Task'}
              >
                {t.title || 'Untitled Task'}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"><ChevronLeft size={20}/></button>
          <h2 className="text-lg font-bold text-gray-800">{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"><ChevronRight size={20}/></button>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(100px,1fr)] overflow-y-auto bg-gray-100 gap-px">
          {days}
        </div>
      </div>
    );
  };

  const renderList = () => (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {tasks.map(t => (
          <div key={t.id} className={`flex items-center gap-3 bg-white p-3 rounded-lg border transition-all ${t.completed ? 'border-gray-200 opacity-75' : 'border-gray-200 shadow-sm'}`}>
            <button onClick={() => updateTask(t.id, 'completed', !t.completed)} className="focus:outline-none shrink-0">
              {t.completed ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle className="text-gray-300 hover:text-blue-500 transition-colors" size={24} />}
            </button>
            <input 
              className={`flex-1 outline-none text-gray-800 font-medium bg-transparent ${t.completed ? 'line-through text-gray-400' : ''}`}
              value={t.title}
              onChange={(e) => updateTask(t.id, 'title', e.target.value)}
              placeholder="What needs to be done?"
            />
            <input 
              type="date"
              className="text-sm border-gray-200 border rounded-md px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600 shrink-0 bg-gray-50"
              value={t.date}
              onChange={(e) => updateTask(t.id, 'date', e.target.value)}
            />
            <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors shrink-0">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 mt-16 bg-white p-12 rounded-xl border border-gray-200 border-dashed">
            <List className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
            <p className="text-sm mb-4">Get started by creating a new task.</p>
            <button onClick={addTask} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus size={16} /> Create your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setView('list')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <List size={16} /> List View
          </button>
          <button 
            onClick={() => setView('calendar')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
        </div>
        <button onClick={addTask} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus size={16} /> New Task
        </button>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50">
        {view === 'list' ? renderList() : (
          <div className="flex-1 p-6 flex flex-col overflow-hidden">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
               {renderCalendar()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
