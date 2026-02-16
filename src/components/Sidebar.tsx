import React from 'react';
import { Clock, AlarmClock, Timer, StopCircle, Focus, Settings, Music } from 'lucide-react';
import { cn } from '../lib/utils';

export type TabType = 'clock' | 'alarm' | 'stopwatch' | 'timer' | 'focus' | 'sounds' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'clock', label: 'Clock', icon: Clock },
  { id: 'alarm', label: 'Alarm', icon: AlarmClock },
  { id: 'stopwatch', label: 'Stopwatch', icon: StopCircle },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'focus', label: 'Focus', icon: Focus },
  { id: 'sounds', label: 'Sounds', icon: Music },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-20 md:w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Clock className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold hidden md:block">TimeMaster</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <Icon size={24} className={cn(
                "shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive && "scale-110"
              )} />
              <span className="font-medium hidden md:block whitespace-nowrap">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary hidden md:block" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 hidden md:block border border-slate-700/50">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Productivity Tips</p>
          <p className="text-sm text-slate-300 mt-2">Try the Pomodoro technique for better focus.</p>
          <p className="text-[10px] text-primary font-bold mt-4 tracking-widest">V-FINAL-RESTART</p>
        </div>
      </div>
    </div>
  );
}