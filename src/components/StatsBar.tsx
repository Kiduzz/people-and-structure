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
      {/* Stats row */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs text-gray-500">
          <span className="flex items-center gap-1"><Users size={12} /> <strong className="text-gray-800">{stats.totalPeople}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1"><GitBranch size={12} /> <strong className="text-gray-800">{stats.totalConnections}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1"><Layers size={12} /> <strong className="text-gray-800">{stats.maxDepth}</strong> levels</span>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => { setSearchOpen(true); setSearchQuery(''); }}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Search size={12} /> Find
          </button>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-20 pointer-events-auto">
          <div className="absolute inset-0 bg-black/5" onClick={() => setSearchOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                placeholder="Search by name or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
            {searchQuery.trim() && (
              <div className="max-h-60 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">No results</div>
                ) : (
                  searchResults.map(n => {
                    const data = n.data as OrgNodeData;
                    return (
                      <button
                        key={n.id}
                        onClick={() => { onSelectNode(n.id); setSearchOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <div className="overflow-hidden">
                          <div className="text-sm font-medium text-gray-800 truncate">{data.name || 'Unnamed'}</div>
                          <div className="text-xs text-gray-400 truncate">{data.title || 'No title'}</div>
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
