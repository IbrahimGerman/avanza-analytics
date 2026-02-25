import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';

const TooltipContent = ({ active, payload, label, isSales }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-100 shadow-card-lg rounded-xl px-4 py-3 min-w-[150px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
            {payload.map((p) => (
                <div key={p.name} className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500 font-medium capitalize">{p.name}</span>
                    <span className="font-extrabold" style={{ color: p.fill }}>
                        {isSales ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const RevenueBarChart = ({ isSales = true, faded = false }) => {
    const getMonthlyData = useDashboardStore((s) => s.getMonthlyData);
    const monthlyData = getMonthlyData();
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
                    {isSales ? 'Revenue vs Cost (Grouped)' : 'Leads vs Qualified Leads'}
                </h3>
                <div className="flex items-center gap-3">
                    {[{ label: isSales ? 'Revenue' : 'Total Leads', color: '#e11d48' },
                    { label: isSales ? 'Cost' : 'Qualified', color: '#fecdd3' }].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                            <span className="text-xs text-slate-500 font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }} barGap={4} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={isSales ? (v) => `$${(v / 1000).toFixed(0)}K` : undefined} />
                        <Tooltip content={<TooltipContent isSales={isSales} />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey={primary} fill="#e11d48" radius={[5, 5, 0, 0]} />
                        <Bar dataKey={secondary} fill="#fecdd3" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default RevenueBarChart;
