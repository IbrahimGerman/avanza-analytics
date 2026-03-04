import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, teamMembers } from '../store/useDashboardStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TeamRadar from '../components/TeamRadar';
import {
    X, TrendingUp, TrendingDown, Briefcase, FileText, Zap,
    BarChart2, ChevronLeft, ChevronRight
} from 'lucide-react';

const TeamAnalytics = () => {

    const {
        dashboardMode, selectedMember, setSelectedMember, resetDashboard,
        searchResult, searchLoading, searchError
    } = useDashboardStore();
    const isSales = dashboardMode === 'sales';
    const topRef = useRef(null);
    const scrollContainerRef = useRef(null);

    // Auto-scroll on search result or selection
    useEffect(() => {
        if ((searchResult || selectedMember) && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchResult, selectedMember]);


    const leadsPerMember = teamMembers.map(m => {
        // If AI returned specific data for this member, prioritize it via primaryData
        const aiData = Array.isArray(searchResult?.primaryData)
            ? searchResult.primaryData.find(row =>
                row.name?.toLowerCase().includes(m.name.toLowerCase()) ||
                row.owner_id === m.id
            )
            : null;

        return {
            ...m,
            leads: aiData?.total_leads || (isSales ? m.leads : Math.round(m.leads * 1.2)),
            qualified: aiData?.qualified || Math.round((aiData?.total_leads || m.leads) * (m.winRate / 100)),
            conversion: aiData?.conversion ? Math.round(aiData.conversion) : m.winRate,
            isAiMetric: !!aiData
        };
    });

    // Slider Controls
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex h-screen bg-enterprise-bg overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-slate-800">
                <Header title="Team Analytics" />
                <div ref={topRef} />

                {/* Sticky Member Selection Bar */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => resetDashboard()}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer hover:opacity-80 ${!selectedMember ? 'bg-avanza-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        All Members
                    </button>
                    {teamMembers.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setSelectedMember(m.name)}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer hover:opacity-80 ${selectedMember === m.name ? 'bg-avanza-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-avanza-300'}`}
                        >
                            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black" style={{ background: selectedMember === m.name ? 'white' : m.color, color: selectedMember === m.name ? m.color : 'white' }}>
                                {m.avatar}
                            </div>
                            {m.name.split(' ')[0]}
                        </button>
                    ))}
                </div>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* AI Vision Results Overlay */}
                    <AnimatePresence>
                        {searchResult && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="card p-6 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-avanza-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="px-2 py-0.5 bg-avanza-500 text-[10px] font-black uppercase rounded">AI Perspective</div>
                                            <h2 className="text-xl font-black">{searchResult.kpis?.[0]?.label || 'Data Analysis'}</h2>
                                        </div>
                                        <p className="text-slate-300 text-sm italic font-medium">"{searchResult.insights}"</p>

                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {searchResult.kpis?.map((kpi, i) => (
                                                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{kpi.label}</p>
                                                    <p className="text-lg font-black">{kpi.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => resetDashboard()} className="text-slate-500 hover:text-white p-2">
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Perspective Header / Status */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-800">
                                {selectedMember ? `${selectedMember}'s Performance` : 'Global Team Analytics'}
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                {isSales ? 'Sales Cycle & Revenue Optimization' : 'RFC/RFP Conversion & Lead Pipeline'}
                            </p>
                        </div>
                        {/* ... */}
                        <AnimatePresence>
                            {selectedMember && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => resetDashboard()}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                    <X size={14} /> Clear Focus
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* AI Insight Cards - Dynamic if searchResult exists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {searchResult && searchResult.kpis?.length >= 3 ? (
                            searchResult.kpis.slice(0, 3).map((kpi, idx) => (
                                <div key={idx} className={`card p-4 flex items-center gap-4 ${idx === 0 ? 'bg-gradient-to-br from-avanza-600 to-avanza-500 text-white shadow-lg' : 'bg-white border-l-4 border-l-avanza-500'}`}>
                                    <div className={`w-12 h-12 ${idx === 0 ? 'bg-white/20' : 'bg-avanza-50 text-avanza-500'} rounded-2xl flex items-center justify-center`}>
                                        {idx === 0 ? <Zap size={24} /> : idx === 1 ? <Briefcase size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-extrabold uppercase tracking-widest ${idx === 0 ? 'opacity-80' : 'text-slate-400'}`}>{kpi.label}</p>
                                        <p className={`text-lg font-black leading-tight ${idx === 0 ? 'text-white' : 'text-slate-800'}`}>{kpi.value}</p>
                                        <p className={`text-[10px] ${idx === 0 ? 'opacity-70' : 'text-green-500 font-bold'}`}>Live from AI Intelligence</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="card p-4 bg-gradient-to-br from-avanza-600 to-avanza-500 text-white flex items-center gap-4 shadow-lg">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Team Efficiency</p>
                                        <p className="text-lg font-black leading-tight">15% Above Target</p>
                                        <p className="text-[10px] opacity-70">Current velocity vs Q1 projection</p>
                                    </div>
                                </div>
                                <div className="card p-4 border-l-4 border-l-blue-500 flex items-center gap-4 bg-white">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Pipeline</p>
                                        <p className="text-lg font-black text-slate-800 leading-tight">$3.2M Managed</p>
                                        <p className="text-[10px] text-green-500 font-bold">+8.2% vs Last Week</p>
                                    </div>
                                </div>
                                <div className="card p-4 border-l-4 border-l-amber-500 flex items-center gap-4 bg-white">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">RFC/RFP Status</p>
                                        <p className="text-lg font-black text-slate-800 leading-tight">42 Pending Response</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Avg turnaround: 2.1 days</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Performance Table & Radar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="card col-span-2 overflow-hidden bg-white">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <BarChart2 size={16} className="text-avanza-500" />
                                    Leads & Conversions
                                </h3>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Q1 2026 Live</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase">Name</th>
                                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">Total Leads</th>
                                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">Qualified</th>
                                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">Conversion %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leadsPerMember.map((m) => (
                                            <tr key={m.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${selectedMember === m.name ? 'bg-avanza-50/50' : ''}`}>
                                                <td className="px-5 py-3">
                                                    <button
                                                        onClick={() => setSelectedMember(m.name)}
                                                        className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-all text-left"
                                                    >
                                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[10px]" style={{ background: m.color }}>{m.avatar}</div>
                                                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-500 transition-colors">{m.name}</span>
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3 text-center text-xs font-black text-slate-800">{m.leads}</td>
                                                <td className="px-5 py-3 text-center text-xs font-black text-slate-800">{m.qualified}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full" style={{ width: `${m.conversion}%`, background: m.color }} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-600">{m.conversion}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div className="card bg-white h-full min-h-[400px]">
                            <TeamRadar selectedMember={selectedMember} />
                        </div>
                    </div>

                    {/* Member Insight Slider (Carousel) */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Detailed Insights</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth"
                        >
                            {teamMembers.map(m => (
                                <motion.div
                                    key={m.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => setSelectedMember(m.name)}
                                    className={`flex-shrink-0 w-[240px] card p-4 cursor-pointer transition-all bg-white relative overflow-hidden ${selectedMember === m.name ? 'ring-2 ring-avanza-500 border-transparent shadow-xl' : 'hover:shadow-md'}`}
                                >
                                    {selectedMember === m.name && (
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-avanza-500 rounded-bl-2xl flex items-center justify-center text-white">
                                            <Zap size={14} />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs" style={{ background: m.color }}>{m.avatar}</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">{m.name}</p>
                                                <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{m.role}</p>
                                            </div>
                                        </div>
                                        <div className={`p-1 rounded-md ${m.trend === 'up' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                            {m.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                            <span className="text-[9px] font-extrabold text-slate-400 uppercase">Revenue Contribution</span>
                                            <span className="text-xs font-black text-slate-800">${(m.revenue / 1000).toFixed(0)}K</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                            <span className="text-[9px] font-extrabold text-slate-400 uppercase">Win Efficiency</span>
                                            <span className={`text-xs font-black ${m.winRate >= 70 ? 'text-green-600' : 'text-amber-600'}`}>{m.winRate}%</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                            <span className="text-[9px] font-extrabold text-slate-400 uppercase">Region Bloom</span>
                                            <span className="text-xs font-black text-slate-600 group-hover:text-avanza-500">{m.region}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="h-4" />
                </main>
            </div>
        </div>
    );
};

export default TeamAnalytics;
