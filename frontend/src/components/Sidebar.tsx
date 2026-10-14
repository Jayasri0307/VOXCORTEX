import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Mic, 
  CheckSquare, 
  Activity, 
  Settings, 
  Radio,
  ChevronRight
} from 'lucide-react';
import { NavigationTab } from '../types';
import { VoxCortexLogo } from './VoxCortexLogo';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isBackendLive: boolean;
  memoriesCount: number;
  tasksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isBackendLive,
  memoriesCount,
  tasksCount
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'chat' as NavigationTab, label: 'Cortex Assistant', icon: MessageSquareCode, badge: 'RAG' },
    { id: 'memories' as NavigationTab, label: 'Voice Vault', icon: Mic, count: memoriesCount },
    { id: 'tasks' as NavigationTab, label: 'Tasks & Actions', icon: CheckSquare, count: tasksCount },
    { id: 'omi' as NavigationTab, label: 'Mobile Voice Sync', icon: Radio, badge: 'Live' },
    { id: 'agents' as NavigationTab, label: 'Agent Activity', icon: Activity, badge: '4 Agents' },
    { id: 'settings' as NavigationTab, label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen shrink-0 sticky top-0 select-none z-20 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <VoxCortexLogo size="md" />
      </div>

      {/* Backend Status Pill */}
      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border ${
          isBackendLive 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isBackendLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isBackendLive ? 'Cortex Core Live' : 'Backend Reconnecting'}</span>
          </div>
          <span className="text-[10px] font-mono opacity-80">{isBackendLive ? ':8000' : 'Offline'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Neural Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-50 to-indigo-50/50 text-violet-950 font-semibold border border-violet-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-violet-100 text-violet-800 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 font-semibold border border-cyan-100 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-500 ml-0.5" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info: Mobile Voice Gateway Indicator */}
      <div 
        onClick={() => setActiveTab('omi')}
        className="p-3.5 border-t border-slate-100 bg-slate-50/70 hover:bg-violet-50/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:border-violet-300">
            <Radio className="w-4 h-4 text-violet-600 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">Mobile Voice Sync</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-500 truncate group-hover:text-violet-600">Active · Open Studio →</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
