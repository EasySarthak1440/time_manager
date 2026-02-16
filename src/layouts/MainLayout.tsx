import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import type { TabType } from '../components/Sidebar';

interface MainLayoutProps {
  children: (activeTab: TabType) => React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>('clock');

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.05),transparent)] pointer-events-none" />
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children(activeTab)}
        </div>
      </main>
    </div>
  );
}
