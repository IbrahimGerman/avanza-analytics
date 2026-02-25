import React from 'react';
import { motion } from 'framer-motion';
import {
    ScatterChart as ReScatter, Scatter, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ZAxis,
} from 'recharts';
import { scatterData } from '../store/useDashboardStore';

const TooltipContent = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
        <div className="bg-white border border-slate-100 shadow-card-lg rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-avanza-500 mb-1">{d.name}</p>
            <p className="text-xs text-slate-500">Deals: <span className="font-bold text-slate-700">{d.x}</span></p>
            <p className="text-xs text-slate-500">Revenue: <span className="font-bold text-slate-700">${(d.y * 1000).toLocaleString()}</span></p>
            <p className="text-xs text-slate-500">Closed: <span className="font-bold text-slate-700">{d.z}</span></p>
        </div>
    );
};

const ScatterPlot = ({ selectedMember, faded = false }) => {
    const colored = scatterData.map((d) => ({
        ...d,
        fill: selectedMember === d.name ? '#e11d48' : '#fecdd3',
        opacity: selectedMember && selectedMember !== d.name ? 0.3 : 1,
    }));

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Deal Volume vs Revenue</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Bubble size = Deals</span>
            </div>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ReScatter margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="x" name="Active Months" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Active Months', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis dataKey="y" name="Revenue ($K)" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}K`} />
                        <ZAxis dataKey="z" range={[80, 600]} />
                        <Tooltip content={<TooltipContent />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter
                            data={colored}
                            shape={(props) => {
                                const { cx, cy, fill, opacity } = props;
                                const r = Math.sqrt(props.z || 20) * 4;
                                return (
                                    <circle
                                        cx={cx} cy={cy} r={r}
                                        fill={fill} opacity={opacity}
                                        stroke={fill} strokeWidth={1.5}
                                        style={{ transition: 'all 0.3s ease' }}
                                    />
                                );
                            }}
                        />
                    </ReScatter>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ScatterPlot;
