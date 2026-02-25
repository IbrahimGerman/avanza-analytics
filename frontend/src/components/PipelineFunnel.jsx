import React from 'react';
import { motion } from 'framer-motion';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#e11d48', '#be123c', '#9f1239', '#7c3aed', '#0891b2'];

const PipelineFunnel = ({ data, faded = false }) => {
    const chartData = data || [
        { name: 'Total Leads', value: 646 },
        { name: 'Qualified', value: 412 },
        { name: 'Proposal Sent', value: 189 },
        { name: 'Negotiations', value: 98 },
        { name: 'Closed Won', value: 135 },
    ];

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Pipeline Funnel</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Conversion Stages</span>
            </div>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 12 }}
                            formatter={(value, name) => [value.toLocaleString(), name]}
                        />
                        <Funnel dataKey="value" data={chartData} isAnimationActive>
                            {chartData.map((entry, index) => (
                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <LabelList position="right" fill="#64748b" fontSize={11} dataKey="name" />
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
                {chartData.slice(0, 3).map((d, i) => (
                    <div key={d.name} className="text-center">
                        <p className="text-sm font-extrabold tabular-nums" style={{ color: COLORS[i] }}>{d.value.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 truncate">{d.name}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PipelineFunnel;
