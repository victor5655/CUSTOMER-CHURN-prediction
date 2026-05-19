import React, { useState } from 'react';
import { churnData, CustomerData } from '../data/churnData';
import { predictChurn, PredictionResult } from '../services/geminiService';
import { BrainCircuit, Search, Loader2, Target, ShieldCheck, Zap, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ChurnPredictor: React.FC = () => {
  const [mode, setMode] = useState<'manual' | 'select'>('manual');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Form State
  const [manualData, setManualData] = useState<Partial<CustomerData>>({
    fullName: 'Prospective Analysis',
    age: 32,
    state: 'Lagos',
    device: '5G Broadband Router',
    satisfactionRate: 2,
    customerReview: 'The network is slow during peak hours and data is getting expensive.',
    tenureMonths: 8,
    subscriptionPlan: '120GB Monthly broadband Plan',
    unitPrice: 24000,
    purchasesCount: 4,
    totalRevenue: 96000,
    dataUsage: 85.5
  });

  const selectedCustomer = mode === 'select' 
    ? churnData.find(c => c.customerId === selectedCustomerId)
    : manualData as CustomerData;

  const handlePredict = async () => {
    if (mode === 'select' && !selectedCustomerId) return;
    
    setIsLoading(true);
    setPrediction(null);
    setError(null);
    try {
      const result = await predictChurn(selectedCustomer as CustomerData);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError('AI Diagnostics Offline. Check your Gemini API initialization.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="churn-predictor" className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">Intelligence Predictor</h1>
        <p className="text-zinc-500 mt-2 max-w-2xl mx-auto">
          Simulate customer scenarios using live AI modeling to understand exactly why churn happens and how to prevent it.
        </p>
      </header>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex gap-1 shadow-inner">
          <button 
            id="toggle-manual"
            onClick={() => { setMode('manual'); setPrediction(null); }}
            className={cn(
              "px-8 py-2 rounded-lg text-sm font-bold transition-all",
              mode === 'manual' ? "bg-white text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            Live Simulator
          </button>
          <button 
            id="toggle-select"
            onClick={() => { setMode('select'); setPrediction(null); }}
            className={cn(
              "px-8 py-2 rounded-lg text-sm font-bold transition-all",
              mode === 'select' ? "bg-white text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            Dataset Lookup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="xl:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-8">
          <div className="space-y-6">
            {mode === 'select' ? (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Select Database Record</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <select 
                    id="customer-dropdown"
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      setPrediction(null);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white appearance-none focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">Choose a customer...</option>
                    {churnData.map(c => (
                      <option key={c.customerId} value={c.customerId}>{c.fullName} ({c.customerId})</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h4 className="text-zinc-400 text-xs font-bold uppercase">Behavioral Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-600">Satisfaction</label>
                      <input 
                        type="number" min="1" max="5"
                        value={manualData.satisfactionRate} 
                        onChange={e => setManualData({...manualData, satisfactionRate: +e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-600">Tenure (mo)</label>
                      <input 
                        type="number"
                        value={manualData.tenureMonths} 
                        onChange={e => setManualData({...manualData, tenureMonths: +e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-600">Data Use (GB)</label>
                      <input 
                        type="number"
                        value={manualData.dataUsage} 
                        onChange={e => setManualData({...manualData, dataUsage: +e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-600">Purchases</label>
                      <input 
                        type="number"
                        value={manualData.purchasesCount} 
                        onChange={e => setManualData({...manualData, purchasesCount: +e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-600">Customer Feedback Quote</label>
                    <textarea 
                      value={manualData.customerReview} 
                      onChange={e => setManualData({...manualData, customerReview: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-xs h-20 resize-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            id="run-analysis-btn"
            disabled={(mode === 'select' && !selectedCustomerId) || isLoading}
            onClick={handlePredict}
            className={cn(
              "w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
              (mode === 'manual' || selectedCustomerId) && !isLoading 
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-[1.02]" 
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            Analyze Patterns
          </button>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            {!prediction && !isLoading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20 p-12 border-2 border-dashed border-zinc-800 rounded-[40px]">
                <BrainCircuit size={80} className="mb-4" />
                <h3 className="text-xl font-bold">Awaiting Input Parameters</h3>
                <p className="text-sm max-w-xs mt-2">Configuration and logic will appear here after analysis.</p>
              </div>
            ) : isLoading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-8 bg-zinc-900/30 rounded-[40px] animate-pulse">
                <div className="w-24 h-24 rounded-full border-4 border-zinc-800 border-t-indigo-500 animate-spin" />
                <div className="space-y-3 px-12 text-center">
                  <div className="h-4 w-48 bg-zinc-800 rounded-full mx-auto" />
                  <div className="h-8 w-64 bg-zinc-800 rounded-full mx-auto" />
                </div>
              </div>
            ) : prediction && (
              <motion.div 
                id="results-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Risk Profile</h4>
                      <div className="text-3xl font-black text-white">{prediction.riskLevel}</div>
                      <div className="text-xs text-indigo-400 font-medium mt-1">"{prediction.behavioralPersona}"</div>
                    </div>
                    <div className="relative">
                      <svg className="w-20 h-20 -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-zinc-800" />
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={226} strokeDashoffset={226 - (226 * prediction.riskScore) / 100} className={cn(prediction.riskScore > 60 ? "text-rose-500" : "text-emerald-500")} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">{prediction.riskScore}</div>
                    </div>
                  </div>
                  <div className="bg-indigo-600 p-8 rounded-[32px] text-white flex flex-col justify-center">
                    <h4 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Priority Objective</h4>
                    <p className="text-sm font-semibold leading-relaxed">
                      {prediction.retentionStrategy.slice(0, 100)}...
                    </p>
                  </div>
                </div>

                {/* Factors: The "WHY" */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-[40px] space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    Causal Indicators (Reasoning)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {prediction.topFactors.map((f, i) => (
                      <div key={i} className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-all">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center mb-4",
                          f.impact === 'Positive' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                          {f.impact === 'Positive' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        <h4 className="font-bold text-sm mb-2 text-zinc-200">{f.factor}</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                          {f.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cognitive Summary */}
                <div className="p-8 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-[40px]">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Model Logic Summary</h3>
                   <p className="text-sm text-zinc-400 italic leading-relaxed">
                     "{prediction.summary}"
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex items-start gap-4 text-rose-500 mt-8">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">System Error</h4>
            <p className="text-sm opacity-80 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertTriangle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
