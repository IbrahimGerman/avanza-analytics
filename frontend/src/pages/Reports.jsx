import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore, teamMembers } from '../store/useDashboardStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Download, FileSpreadsheet, FileText, TrendingUp, DollarSign, Target, BarChart2, CheckCircle, Users } from 'lucide-react';

const Reports = () => {
    const { dashboardMode, selectedYear, selectedQuarter, getKpis } = useDashboardStore();
    const isSales = dashboardMode === 'sales';
    const kpis = getKpis();
    const [downloading, setDownloading] = useState(null);

    const simulateDownload = (type) => {
        setDownloading(type);
        setTimeout(() => setDownloading(null), 2000);
    };

    const topPerformers = [...teamMembers].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return (
        <div className="flex h-screen bg-enterprise-bg overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title="Reports" />
                <main className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-800">Dashboard Summary Report</h1>
                            <p className="text-sm text-slate-400 mt-0.5">{selectedYear} · {selectedQuarter} · {dashboardMode} division</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => simulateDownload('pdf')}
                                disabled={!!downloading}
                                className="flex items-center gap-2 bg-avanza-500 hover:bg-avanza-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-70"
                            >
                                {downloading === 'pdf' ? (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                                ) : <FileText size={15} />}
                                Export PDF
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => simulateDownload('excel')}
                                disabled={!!downloading}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-70"
                            >
                                {downloading === 'excel' ? (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                                ) : <FileSpreadsheet size={15} />}
                                Export Excel
                            </motion.button>
                        </div>
                    </div>

                    {downloading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3"
                        >
                            <CheckCircle size={16} className="text-green-500" />
                            <p className="text-sm text-green-700 font-medium">
                                Generating {downloading.toUpperCase()} report for {selectedYear} {selectedQuarter}... Download will start shortly.
                            </p>
                        </motion.div>
                    )}

                    {/* KPI Summary */}
                    <div className="card p-6">
                        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BarChart2 size={16} className="text-avanza-500" />
                            KPI Summary — {selectedYear} {selectedQuarter}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {kpis.map((kpi, i) => (
                                <motion.div
                                    key={kpi.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="text-center p-3 bg-slate-50 rounded-xl"
                                >
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                                    <p className="text-lg font-extrabold text-slate-800 mt-1 tabular-nums">{kpi.value}</p>
                                    <p className={`text-xs font-bold mt-0.5 ${kpi.up ? 'text-green-500' : 'text-red-500'}`}>{kpi.change}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Team Performance Table */}
                    <div className="card overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
                            <Users size={16} className="text-avanza-500" />
                            <h2 className="font-bold text-slate-800">Team Performance — {selectedYear} {selectedQuarter}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        {['Consultant', 'Role', 'Department', 'Revenue', 'Deals', 'Win Rate', 'Region', 'Status'].map((h) => (
                                            <th key={h} className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {topPerformers.map((m, i) => (
                                        <motion.tr
                                            key={m.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: m.color }}>{m.avatar}</div>
                                                    <span className="font-semibold text-slate-800 text-sm">{m.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-slate-500">{m.role}</td>
                                            <td className="px-5 py-4 text-xs text-slate-500 capitalize">{m.department}</td>
                                            <td className="px-5 py-4 font-bold text-slate-800 tabular-nums text-sm">${m.revenue.toLocaleString()}</td>
                                            <td className="px-5 py-4 font-semibold text-slate-600 tabular-nums text-sm">{m.deals}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${m.winRate}%`, background: m.color }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{m.winRate}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-slate-500">{m.region}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${m.winRate >= 70 ? 'bg-green-50 text-green-600' : m.winRate >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                                                    {m.winRate >= 70 ? 'Top' : m.winRate >= 60 ? 'Mid' : 'At Risk'}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="card p-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🤖</span>
                            <h2 className="font-bold">AI Report Summary</h2>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                            <p>→ Revenue performance in {selectedYear} {selectedQuarter} is <span className="text-green-400 font-semibold">{kpis[0]?.change || '+18.2%'} above target</span>. The {dashboardMode} division shows strong momentum.</p>
                            <p>→ Top performer is <span className="text-avanza-300 font-semibold">Michael Ross</span> with $112K revenue and 81% win rate — 23% above team average.</p>
                            <p>→ <span className="text-amber-400 font-semibold">Action required:</span> James Carter's win rate at 53% needs targeted coaching. Pipeline attrition in SMB segment should be addressed.</p>
                            <p>→ Forecast for Q+1: <span className="text-green-400 font-semibold">{kpis[5]?.value || '$2.9M'}</span> based on current pipeline velocity and historical close rates.</p>
                        </div>
                    </div>

                    <div className="h-4" />
                </main>
            </div>
        </div>
    );
};

export default Reports;
