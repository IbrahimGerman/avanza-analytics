import React from 'react';
import { motion } from 'framer-motion';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { donutData } from '../store/useDashboardStore';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    return (
        <div className="bg-white border border-slate-100 shadow-card-lg rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{name}</p>
            <p className="text-xl font-extrabold text-avanza-500 tabular-nums">{value}%</p>
        </div>
    );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    if (percent < 0.08) return null;
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold" fontSize={11} fontWeight={700}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const DonutChart = ({ faded = false }) => (
    <motion.div
        animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
        transition={{ duration: 0.35 }}
        className="card p-6 h-full flex flex-col"
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Market Segments</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Q1 2026</span>
        </div>

        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={renderLabel}
                    >
                        {donutData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Legend */}
        <ul className="mt-3 space-y-2">
            {donutData.map(({ name, value, color }) => (
                <li key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-slate-600 font-medium">{name}</span>
                    </div>
                    <span className="font-bold text-slate-800 tabular-nums">{value}%</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

export default DonutChart;
