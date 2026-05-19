import React from 'react';
import { LayoutDashboard, Users, BrainCircuit, BookOpen, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export type View = 'dashboard' | 'customers' | 'predictor' | 'knowledge';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Base', icon: Users },
    { id: 'predictor', label: 'Churn Predictor', icon: BrainCircuit },
    { id: 'knowledge', label: 'Strategies', icon: BookOpen },
  ];

  return (
    <aside id="sidebar" className="w-64 bg-zinc-950 text-white border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Churn Prediction</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              id={`nav-${item.id}`}
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-zinc-500")} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-zinc-800 mt-auto">
        <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
