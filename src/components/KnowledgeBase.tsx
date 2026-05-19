import React from 'react';
import { BookOpen, CheckCircle2, Lightbulb, TrendingDown, Target, ShieldCheck } from 'lucide-react';

const STRATEGIES = [
  {
    title: "Proactive Engagement",
    description: "Identify high-risk segments (tenure < 6 months, high data usage) and offer loyalty bonuses before they churn.",
    icon: Target,
    impact: 'High'
  },
  {
    title: "Infrastructure Optimization",
    description: "Address 'Poor Network' churn by prioritizing network upgrades in states with high churn rates like Kwara and Sokoto.",
    icon: Lightbulb,
    impact: 'Medium'
  },
  {
    title: "Plan Personalization",
    description: "Convert prepaid users to monthly contracts with discounted rates to extend average tenure.",
    icon: ShieldCheck,
    impact: 'High'
  },
  {
    title: "Retention Incentives",
    description: "Launch a 'Retention Campaign' targeting customers with a satisfaction rate of 2 or lower with personalized data gifts.",
    icon: CheckCircle2,
    impact: 'Critical'
  }
];

export const KnowledgeBase: React.FC = () => {
  return (
    <div id="knowledge-base" className="p-8 space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100">Retention Playbook</h1>
        <p className="text-zinc-500 mt-1">Data-driven strategies to combat churn and improve LTV.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {STRATEGIES.map((strategy, i) => {
          const Icon = strategy.icon;
          return (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-zinc-800 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="px-3 py-1 bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 rounded-full">
                  Impact: {strategy.impact}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{strategy.title}</h3>
              <p className="text-zinc-500 leading-relaxed">
                {strategy.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-white">Need a custom strategy?</h2>
          <p className="text-zinc-400">
            Our AI engine can generate a unique retention roadmap for any customer segment based on their transaction history and behavioral footprint.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
            Open Advanced Predictor
          </button>
        </div>
        <div className="w-full md:w-1/3 aspect-square bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center p-8">
          <BookOpen size={100} className="text-zinc-800" />
        </div>
      </div>
    </div>
  );
};
