import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../store/useDashboardStore';

const TeamRadar = ({ selectedMember, faded = false }) => {
    const { getRadarData } = useDashboardStore();

    // UseMemo for stable data calculation
    const data = useMemo(() => getRadarData(selectedMember), [selectedMember, getRadarData]);

    return (
        <motion.div
            animate={{ opacity: faded ? 0.18 : 1, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ duration: 0.35 }}
            className="card p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Member Performance Radar</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">5 Normalized Metrics</span>
            </div>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} tickCount={4} />
                        <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 12 }}
                            itemStyle={{ fontWeight: 'bold', color: '#e11d48' }}
                        />
                        <Radar
                            name={selectedMember || 'Team Average'}
                            dataKey="Value"
                            stroke="#e11d48"
                            fill="#e11d48"
                            fillOpacity={0.25}
                            strokeWidth={3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default TeamRadar;
