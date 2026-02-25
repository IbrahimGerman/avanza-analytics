import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { teamMembers } from '../store/useDashboardStore';

const TeamTable = ({ selectedMember, setSelectedMember, resetDashboard, isSales }) => (
    <div className="card overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-slate-800 text-sm">Team Performance Metrics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Click a consultant to filter all charts</p>
            </div>
            <div className="flex items-center gap-3">
                {selectedMember && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={resetDashboard}
                        className="text-xs bg-avanza-50 text-avanza-600 font-bold px-3 py-1.5 rounded-full hover:bg-avanza-100 transition-colors"
                    >
                        Reset Focus
                    </motion.button>
                )}
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-50">
                        {['Consultant', 'Role', isSales ? 'Revenue' : 'Leads', isSales ? 'Deals' : 'Qualified', 'Win Rate', 'Trend', 'Status'].map((h) => (
                            <th key={h} className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence>
                        {teamMembers.map((member, i) => {
                            const isSelected = selectedMember === member.name;
                            const isFaded = selectedMember && !isSelected;
                            return (
                                <motion.tr
                                    key={member.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                        opacity: isFaded ? 0.3 : 1,
                                        x: 0,
                                        backgroundColor: isSelected ? 'rgba(225,29,72,0.04)' : 'transparent',
                                    }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                    onClick={() => setSelectedMember(isSelected ? null : member.name)}
                                    className={`border-b border-slate-50 last:border-0 cursor-pointer hover:bg-avanza-50/40 transition-colors ${isSelected ? 'border-l-4 border-l-avanza-500' : ''}`}
                                >
                                    {/* Avatar + Name */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                                style={{ background: member.color }}
                                            >
                                                {member.avatar}
                                            </div>
                                            <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">{member.name}</span>
                                        </div>
                                    </td>
                                    {/* Role */}
                                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{member.role}</td>
                                    {/* Revenue / Leads */}
                                    <td className="px-5 py-4 font-bold text-slate-800 tabular-nums text-sm">
                                        {isSales ? `$${member.revenue.toLocaleString()}` : member.leads}
                                    </td>
                                    {/* Deals / Qualified */}
                                    <td className="px-5 py-4 font-semibold text-slate-600 tabular-nums text-sm">
                                        {isSales ? member.deals : member.deals * 2}
                                    </td>
                                    {/* Win Rate Bar */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${member.winRate}%` }}
                                                    transition={{ delay: i * 0.05 + 0.3, duration: 0.7, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{ background: `linear-gradient(90deg, ${member.color}, #fda4af)` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 tabular-nums">{member.winRate}%</span>
                                        </div>
                                    </td>
                                    {/* Trend */}
                                    <td className="px-5 py-4">
                                        {member.trend === 'up'
                                            ? <TrendingUp size={16} className="text-green-500" />
                                            : <TrendingDown size={16} className="text-red-400" />}
                                    </td>
                                    {/* Status badge */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${member.winRate >= 70
                                                ? 'bg-green-50 text-green-600'
                                                : member.winRate >= 60
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-red-50 text-red-500'
                                            }`}>
                                            {member.winRate >= 70 ? 'High' : member.winRate >= 60 ? 'Medium' : 'At Risk'}
                                        </span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    </div>
);

export default TeamTable;
