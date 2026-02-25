import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { regionalData } from '../store/useDashboardStore';

const COLORS = ['#e11d48', '#be123c', '#9f1239', '#7c3aed', '#0891b2'];

const RegionHeatmap = ({ data, faded = false }) => {
    const chartData = data || regionalData;
    const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Region-wise Revenue</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Heatmap View</span>
            </div>
            <div className="flex-1 min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 40, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                        <YAxis type="category" dataKey="region" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={80} />
                        <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 12 }}
                            formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={20}>
                            {chartData.map((entry, index) => {
                                const intensity = entry.revenue / maxRevenue;
                                return <Cell key={entry.region} fill={COLORS[index % COLORS.length]} opacity={0.4 + intensity * 0.6} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, #fecdd3, #e11d48)' }} />
                <div className="flex justify-between w-full text-[10px] text-slate-400 absolute" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span>Low</span><span>High</span>
                </div>
            </div>
        </motion.div>
    );
};

export default RegionHeatmap;
