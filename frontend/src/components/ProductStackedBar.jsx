import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductStackedBar = ({ data, faded = false }) => {
    const chartData = data || [
        { product: 'CRM Suite', enterprise: 420, midMarket: 280, smb: 180 },
        { product: 'Analytics Pro', enterprise: 380, midMarket: 210, smb: 140 },
        { product: 'AI Engine', enterprise: 520, midMarket: 190, smb: 90 },
        { product: 'Cloud Infra', enterprise: 290, midMarket: 320, smb: 210 },
        { product: 'Security', enterprise: 350, midMarket: 240, smb: 160 },
    ];

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Product Contribution</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">By Segment</span>
            </div>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="product" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 12 }} cursor={{ fill: '#f8fafc' }} />
                        <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="enterprise" stackId="a" fill="#e11d48" name="Enterprise" />
                        <Bar dataKey="midMarket" stackId="a" fill="#be123c" name="Mid-Market" />
                        <Bar dataKey="smb" stackId="a" fill="#fda4af" name="SMB" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ProductStackedBar;
