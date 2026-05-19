import React, { useState } from 'react';
import { churnData, CustomerData } from '../data/churnData';
import { Search, Filter, MoreHorizontal, User, Smartphone, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export const CustomerTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'churned' | 'retained'>('all');

  const filteredData = churnData.filter(customer => {
    const matchesSearch = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'churned' && customer.churnStatus) || 
                         (filter === 'retained' && !customer.churnStatus);
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="customer-table-container" className="p-8 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Customer Base</h1>
          <p className="text-zinc-500 mt-1">Detailed directory of current and former customers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              id="customer-search"
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <select 
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="all">All Status</option>
            <option value="churned">Churned</option>
            <option value="retained">Retained</option>
          </select>
        </div>
      </header>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table id="customer-directory" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Device & Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tenure</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredData.map((customer) => (
                <tr key={customer.customerId} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        {customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-100">{customer.fullName}</div>
                        <div className="text-xs text-zinc-500">{customer.customerId} • {customer.state}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                      {customer.device}
                    </div>
                    <div className="text-xs text-zinc-500 truncate max-w-[150px]">{customer.subscriptionPlan}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-100">{customer.tenureMonths} months</div>
                    <progress 
                      className="w-16 h-1 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-zinc-800 [&::-webkit-progress-value]:bg-indigo-500" 
                      value={customer.tenureMonths} 
                      max={60} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-emerald-400">₦{customer.totalRevenue.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500">{customer.purchasesCount} purchases</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">{customer.dataUsage}GB</div>
                    <div className="text-[10px] text-zinc-500 text-uppercase">Monthly Avg</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      customer.churnStatus 
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    )}>
                      {customer.churnStatus ? 'Churned' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-zinc-400 font-medium">No customers found</h3>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
