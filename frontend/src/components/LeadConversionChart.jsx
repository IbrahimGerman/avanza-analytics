import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const LeadConversionChart = ({ data, faded = false }) => {
    const chartData = data || [
        { month: 'Jan', conversion: 65 },
        { month: 'Feb', conversion: 66 },
        { month: 'Mar', conversion: 63 },
        { month: 'Apr', conversion: 68 },
        { month: 'May', conversion: 69 },
        { month: 'Jun', conversion: 73 },
        { month: 'Jul', conversion: 71 },
        { month: 'Aug', conversion: 76 },
    ];
    const avg = Math.round(chartData.reduce((s, d) => s + d.conversion, 0) / chartData.length);

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Lead Conversion Trend</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Avg: {avg}% conversion rate</p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+16.9% YTD</span>
            </div>
            <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                        <defs>
                            <linearGradient id="convGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#fda4af" />
                                <stop offset="100%" stopColor="#e11d48" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[55, 85]} />
                        <ReferenceLine y={avg} stroke="#e2e8f0" strokeDasharray="4 4" label={{ value: `Avg ${avg}%`, fill: '#94a3b8', fontSize: 10, position: 'insideRight' }} />
                        <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 12 }}
                            formatter={(v) => [`${v}%`, 'Conversion Rate']}
                        />
                        <Line type="monotone" dataKey="conversion" stroke="url(#convGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#e11d48', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default LeadConversionChart;
