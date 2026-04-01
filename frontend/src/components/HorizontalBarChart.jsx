import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useDashboardStore } from '../store/useDashboardStore';

const TooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-100 shadow-card-lg rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-lg font-extrabold text-avanza-500">{payload[0].value}%</p>
        </div>
    );
};

const HorizontalBarChart = ({ selectedMember, faded = false }) => {
    const { teamMembers } = useDashboardStore();
    const data = teamMembers.map((m) => ({ name: m.name, winRate: m.winRate }));

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Win Rate by Consultant</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">%</span>
            </div>

            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 8, right: 24, top: 5, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={100} />
                        <Tooltip content={<TooltipContent />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="winRate" radius={[0, 6, 6, 0]} barSize={18}>
                            {data.map((entry) => (
                                <Cell
                                    key={entry.name}
                                    fill={selectedMember === entry.name ? '#e11d48' : '#fecdd3'}
                                    opacity={selectedMember && selectedMember !== entry.name ? 0.4 : 1}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default HorizontalBarChart;
