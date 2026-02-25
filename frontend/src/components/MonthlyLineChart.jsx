import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../store/useDashboardStore';

const TooltipContent = ({ active, payload, label, isSales }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-100 shadow-card-lg rounded-xl px-4 py-3 min-w-[140px]">
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
            {payload.map((p) => (
                <div key={p.name} className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500 font-medium capitalize">{p.name}</span>
                    <span className="font-extrabold" style={{ color: p.color }}>
                        {isSales ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const MonthlyLineChart = ({ isSales = true, faded = false, data }) => {
    const getMonthlyData = useDashboardStore((s) => s.getMonthlyData);
    const chartData = data || getMonthlyData();
    const primary = isSales ? 'revenue' : 'leads';
    const secondary = isSales ? 'cost' : 'qualified';

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">
                    {isSales ? 'Monthly Revenue vs Cost' : 'Monthly Lead Acquisition'}
                </h3>
                <div className="flex items-center gap-3">
                    {[
                        { label: isSales ? 'Revenue' : 'Leads', color: '#e11d48' },
                        { label: isSales ? 'Cost' : 'Qualified', color: '#fda4af' },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                            <span className="text-xs text-slate-500 font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#e11d48" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fda4af" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#fda4af" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickFormatter={isSales ? (v) => `$${(v / 1000).toFixed(0)}K` : undefined} />
                        <Tooltip content={<TooltipContent isSales={isSales} />} />
                        <Area dataKey={primary} type="monotone" stroke="#e11d48" strokeWidth={2.5} fill="url(#gradPrimary)" dot={{ r: 3, fill: '#e11d48' }} activeDot={{ r: 5 }} />
                        <Area dataKey={secondary} type="monotone" stroke="#fda4af" strokeWidth={2} fill="url(#gradSecondary)" dot={{ r: 3, fill: '#fda4af' }} activeDot={{ r: 5 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default MonthlyLineChart;
