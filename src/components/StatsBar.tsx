"use client";
import { Node, Edge } from '@xyflow/react';
import { Users, GitBranch, Layers, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { OrgNodeData } from './OrgNode';

interface StatsBarProps {
  nodes: Node[];
  edges: Edge[];
  onSelectNode: (id: string) => void;
}

export default function StatsBar({ nodes, edges, onSelectNode }: StatsBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const totalPeople = nodes.length;
    const totalConnections = edges.length;

    // Calculate max depth
    const childrenMap = new Map<string, string[]>();
    const parentSet = new Set<string>();
    edges.forEach(e => {
      const children = childrenMap.get(e.source) || [];
      children.push(e.target);
      childrenMap.set(e.source, children);
      parentSet.add(e.target);
    });

    const roots = nodes.filter(n => !parentSet.has(n.id));
    let maxDepth = 0;
    const getDepth = (nodeId: string, depth: number) => {
      maxDepth = Math.max(maxDepth, depth);
      const children = childrenMap.get(nodeId) || [];
      children.forEach(c => getDepth(c, depth + 1));
    };
    roots.forEach(r => getDepth(r.id, 1));

    return { totalPeople, totalConnections, maxDepth };
  }, [nodes, edges]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return nodes.filter(n => {
      const data = n.data as OrgNodeData;
      return (
        data.name?.toLowerCase().includes(q) ||
        data.title?.toLowerCase().includes(q) ||
        data.email?.toLowerCase().includes(q)
      );
    }).slice(0, 8);
  }, [searchQuery, nodes]);

  if (nodes.length === 0) return null;

  return (
    <>
      <div className="absolute bottom-6 left-6 z-10 pointer-events-auto animate-fade-in-up">
        <div className="flex items-center gap-2">
          {/* Stats Chips */}
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl px-4 py-2.5 shadow-lg">
            <div className="flex items-center gap-1.5 pr-3 border-r border-gray-200/60">
              <Users size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-gray-900">{stats.totalPeople}</span>
              <span className="text-[10px] text-gray-500 font-medium">People</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-gray-200/60">
              <GitBranch size={14} className="text-indigo-500" />
              <span className="text-xs font-bold text-gray-900">{stats.totalConnections}</span>
              <span className="text-[10px] text-gray-500 font-medium">Links</span>
            </div>
            <div className="flex items-center gap-1.5 pl-1.5">
              <Layers size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-gray-900">{stats.maxDepth}</span>
              <span className="text-[10px] text-gray-500 font-medium">Levels</span>
            </div>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => { setSearchOpen(true); setSearchQuery(''); }}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl px-4 py-2.5 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all text-xs font-semibold text-gray-500 hover:text-gray-700"
          >
            <Search size={14} /> Find Person
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-24 pointer-events-auto">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/80 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                className="flex-1 text-sm font-medium text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                placeholder="Search by name, title, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            {searchQuery.trim() && (
              <div className="max-h-72 overflow-y-auto p-2">
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-400">No results found</div>
                ) : (
                  searchResults.map(n => {
                    const data = n.data as OrgNodeData;
                    const initials = (data.name || 'N').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <button
                        key={n.id}
                        onClick={() => { onSelectNode(n.id); setSearchOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-700 transition-colors">{data.name || 'Unnamed'}</div>
                          <div className="text-xs text-gray-500 truncate">{data.title || 'No Title'}</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
