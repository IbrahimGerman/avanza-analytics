import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DealGrowthChart = ({ data, faded = false }) => {
    const chartData = data || [
        { month: 'Jan', dealValue: 17200 },
        { month: 'Feb', dealValue: 18100 },
        { month: 'Mar', dealValue: 17600 },
        { month: 'Apr', dealValue: 19400 },
        { month: 'May', dealValue: 18900 },
        { month: 'Jun', dealValue: 20200 },
        { month: 'Jul', dealValue: 19600 },
        { month: 'Aug', dealValue: 21100 },
    ];

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Deal Value Growth</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Average deal value over time</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-extrabold text-avanza-500 tabular-nums">$21.1K</p>
                    <p className="text-[10px] text-green-500 font-bold">+22.7% YTD</p>
                </div>
            </div>
            <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                        <defs>
                            <linearGradient id="dealGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#e11d48" />
                                <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                        <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 12 }}
                            formatter={(v) => [`$${v.toLocaleString()}`, 'Avg Deal Value']}
                        />
                        <Line
                            type="monotone"
                            dataKey="dealValue"
                            stroke="url(#dealGrad)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#e11d48', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default DealGrowthChart;
