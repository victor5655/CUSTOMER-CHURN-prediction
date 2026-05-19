import React, { useState } from 'react';
import { Sidebar, View } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { CustomerTable } from './components/CustomerTable';
import { ChurnPredictor } from './components/ChurnPredictor';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Bell, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardOverview />;
      case 'customers': return <CustomerTable />;
      case 'predictor': return <ChurnPredictor />;
      case 'knowledge': return <KnowledgeBase />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div id="app-shell" className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main id="main-content" className="flex-1 flex flex-col h-screen overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.05)_0%,transparent_50%)]">
        {/* Top Navbar */}
        <header id="top-nav" className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4 text-zinc-500 font-medium text-sm">
            <span className="text-zinc-600">Overview</span>
            <span>/</span>
            <span className="text-zinc-200 capitalize">{currentView}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Global search command..." 
                className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            <button id="noti-btn" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-zinc-950" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className="text-right">
                <div className="text-xs font-bold text-white leading-none">Victor Alade</div>
                <div className="text-[10px] text-zinc-500 font-medium tracking-wide mt-1 uppercase">Admin Access</div>
              </div>
              <div id="user-avatar" className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                V
              </div>
            </div>
          </div>
        </header>

        {/* View Transition Wrapper */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
          © 2026 Churn Prediction Neural Analytics • Encrypted Node • LHR-01
        </footer>
      </main>
    </div>
  );
}
