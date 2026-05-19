import React, { useMemo } from 'react';
import { churnData } from '../data/churnData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingDown, Users, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

export const DashboardOverview: React.FC = () => {
  const stats = useMemo(() => {
    const total = churnData.length;
    const churned = churnData.filter(d => d.churnStatus).length;
    const churnRate = (churned / total) * 100;
    const totalRevenue = churnData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const avgTenure = churnData.reduce((acc, curr) => acc + curr.tenureMonths, 0) / total;
    const atRiskRevenue = churnData.filter(d => d.satisfactionRate <= 2).reduce((acc, curr) => acc + curr.totalRevenue, 0);

    return {
      total,
      churned,
      churnRate: churnRate.toFixed(1),
      totalRevenue: (totalRevenue / 1000).toFixed(0) + 'k',
      avgTenure: avgTenure.toFixed(1),
      atRiskRevenue: (atRiskRevenue / 1000).toFixed(0) + 'k'
    };
  }, []);

  const churnPieData = useMemo(() => [
    { name: 'Retained', value: churnData.length - churnData.filter(d => d.churnStatus).length },
    { name: 'Churned', value: churnData.filter(d => d.churnStatus).length }
  ], []);

  const reasonsData = useMemo(() => {
    const counts: Record<string, number> = {};
    churnData.filter(d => d.churnStatus).forEach(d => {
      counts[d.reasonsForChurn] = (counts[d.reasonsForChurn] || 0) + 1;
    });
    return Object.entries(counts).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
  }, []);

  const deviceChurnData = useMemo(() => {
    const devices: Record<string, { total: number; churn: number }> = {};
    churnData.forEach(d => {
      if (!devices[d.device]) devices[d.device] = { total: 0, churn: 0 };
      devices[d.device].total++;
      if (d.churnStatus) devices[d.device].churn++;
    });
    return Object.entries(devices).map(([name, val]) => ({
      name,
      retained: val.total - val.churn,
      churned: val.churn
    }));
  }, []);

  return (
    <div id="dashboard-overview" className="p-8 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          Executive Dashboard
        </h1>
        <p className="text-zinc-500 mt-1">Real-time analysis of customer retention and churn dynamics.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          id="stat-churn-rate"
          title="Churn Rate" 
          value={`${stats.churnRate}%`} 
          subValue="+1.2% from last month" 
          icon={TrendingDown} 
          trend="down"
        />
        <StatCard 
          id="stat-avg-tenure"
          title="Avg. Tenure" 
          value={`${stats.avgTenure}mo`} 
          subValue="Customer lifecycle avg" 
          icon={Clock} 
          trend="neutral"
        />
        <StatCard 
          id="stat-at-risk"
          title="At-Risk Revenue" 
          value={`₦${stats.atRiskRevenue}`} 
          subValue="High probability churn" 
          icon={AlertTriangle} 
          trend="up"
          warning
        />
        <StatCard 
          id="stat-revenue"
          title="Total Revenue" 
          value={`₦${stats.totalRevenue}`} 
          subValue="Life-time value" 
          icon={DollarSign} 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard id="churn-pie-chart" title="Customer Retention Overview">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={churnPieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {churnPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#f43f5e'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard id="reasons-bar-chart" title="Primary Churn Drivers">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reasonsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="reason" 
                stroke="#71717a" 
                fontSize={12} 
                width={120}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard id="device-churn-chart" title="Churn by Device Category" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={deviceChurnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="retained" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="churned" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

interface StatCardProps {
  id: string;
  title: string;
  value: string;
  subValue: string;
  icon: any;
  trend: 'up' | 'down' | 'neutral';
  warning?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ id, title, value, subValue, icon: Icon, trend, warning }) => (
  <motion.div 
    id={id}
    whileHover={{ y: -4 }}
    className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn(
        "p-3 rounded-xl",
        warning ? "bg-red-500/10 text-red-500" : "bg-indigo-500/10 text-indigo-500"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={cn(
        "text-xs px-2 py-1 rounded-full",
        trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : 
        trend === 'down' ? "bg-rose-500/10 text-rose-500" :
        "bg-zinc-500/10 text-zinc-500"
      )}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
      </div>
    </div>
    <h3 className="text-zinc-500 text-sm font-medium">{title}</h3>
    <div className="text-2xl font-bold text-white mt-1">{value}</div>
    <p className="text-zinc-600 text-xs mt-2">{subValue}</p>
    
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
      <Icon size={80} />
    </div>
  </motion.div>
);

const ChartCard: React.FC<{ id: string, title: string; children: React.ReactNode; className?: string }> = ({ id, title, children, className }) => (
  <div id={id} className={cn("bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl", className)}>
    <h3 className="text-zinc-400 font-medium mb-6 text-sm flex items-center gap-2">
      <div className="w-1 h-4 bg-indigo-500 rounded-full" />
      {title}
    </h3>
    {children}
  </div>
);
