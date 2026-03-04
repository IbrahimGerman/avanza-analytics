import React from 'react';
import { X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import RevenueBarChart from '../components/RevenueBarChart';
import MonthlyLineChart from '../components/MonthlyLineChart';
import DonutChart from '../components/DonutChart';
import HorizontalBarChart from '../components/HorizontalBarChart';
import ScatterPlot from '../components/ScatterChart';
import TeamTable from '../components/TeamTable';
import PipelineFunnel from '../components/PipelineFunnel';
import TeamRadar from '../components/TeamRadar';
import ProductStackedBar from '../components/ProductStackedBar';
import DealGrowthChart from '../components/DealGrowthChart';
import RegionHeatmap from '../components/RegionHeatmap';
import LeadConversionChart from '../components/LeadConversionChart';
import { teamMembers } from '../store/useDashboardStore';

const getMemberKpis = (member, isSales) => {
    if (!member) return null;
    const m = teamMembers.find((t) => t.name === member);
    if (!m) return null;
    return isSales
        ? [
            { label: 'Revenue', value: `$${m.revenue.toLocaleString()}`, change: '+14.2%', up: true, icon: 'dollar' },
            { label: 'Deals', value: String(m.deals), change: '+8.1%', up: true, icon: 'bar' },
            { label: 'Win Rate', value: `${m.winRate}%`, change: m.trend === 'up' ? '+3.2%' : '-2.1%', up: m.trend === 'up', icon: 'target' },
            { label: 'Forecast', value: `$${(m.revenue * 1.12).toFixed(0)}`, change: '+12.0%', up: true, icon: 'trending' },
            { label: 'Active Pipeline', value: `${m.activePipeline} deals`, change: '+5.4%', up: true, icon: 'activity' },
            { label: 'Avg Deal Value', value: `$${m.avgDealValue.toLocaleString()}`, change: '+7.2%', up: true, icon: 'dollar' },
        ]
        : [
            { label: 'Leads', value: String(m.leads), change: '+21.3%', up: true, icon: 'trending' },
            { label: 'Qualified', value: String(m.leads - 30), change: '+18.5%', up: true, icon: 'target' },
            { label: 'Proposals', value: String(m.deals * 3), change: '+6.2%', up: true, icon: 'bar' },
            { label: 'Win Rate', value: `${m.winRate}%`, change: m.trend === 'up' ? '+3.2%' : '-2.1%', up: m.trend === 'up', icon: 'dollar' },
            { label: 'Conversion %', value: `${m.conversionRate}%`, change: '+4.1%', up: true, icon: 'activity' },
            { label: 'Avg Lead Score', value: String(Math.round(m.winRate * 1.1)), change: '+2.8%', up: true, icon: 'trending' },
        ];
};

const insightCards = (mode, member) => {
    if (member) {
        const m = teamMembers.find((t) => t.name === member);
        if (!m) return [];
        return [
            { icon: '🤖', text: `${m.name} has a ${m.winRate}% win rate — ${m.winRate >= 70 ? 'above' : 'below'} team average of 66%.`, type: m.winRate >= 70 ? 'positive' : 'warning' },
            { icon: '📈', text: `Active pipeline of ${m.activePipeline} deals with avg deal value of $${m.avgDealValue.toLocaleString()}.`, type: 'info' },
            { icon: '🎯', text: `Conversion rate at ${m.conversionRate}% — ${m.trend === 'up' ? 'trending upward' : 'needs attention'}.`, type: m.trend === 'up' ? 'positive' : 'warning' },
        ];
    }
    if (mode === 'sales') return [
        { icon: '🤖', text: 'AI Insight: Revenue exceeds forecast by 18.2%. Michael Ross drives 36% of enterprise revenue.', type: 'positive' },
        { icon: '📊', text: 'Deal velocity increased by 12% this quarter. Average sales cycle down to 28 days.', type: 'info' },
        { icon: '⚠️', text: 'Win rate slightly declining (-1.3%). Focus required on mid-market segment conversion.', type: 'warning' },
    ];
    return [
        { icon: '🤖', text: 'AI Insight: Lead qualification rate up 15.1%. ME region shows strongest pipeline health.', type: 'positive' },
        { icon: '📊', text: 'Discovery calls surged 31.2% this quarter. Presales team capacity at 87%.', type: 'info' },
        { icon: '⚠️', text: 'SMB segment proposal acceptance below target. Revisit pricing strategy for Q2.', type: 'warning' },
    ];
};

const insightStyle = { positive: 'bg-green-50 border-green-200 text-green-700', warning: 'bg-amber-50 border-amber-200 text-amber-700', info: 'bg-blue-50 border-blue-200 text-blue-700' };

const chartRelevancy = (searchResult) => {
    if (!searchResult || !searchResult.highlight?.length) return () => false;
    const h = searchResult.highlight;
    return (chartId) => !h.some((tag) => chartId.includes(tag));
};

const OverviewDashboard = () => {
    const { selectedMember, dashboardMode, setSelectedMember, resetDashboard, searchResult, getKpis, getMonthlyData, searchQuery } = useDashboardStore();
    const isSales = dashboardMode === 'sales';

    const baseKpis = getKpis();
    const memberKpis = getMemberKpis(selectedMember, isSales);
    const activeKpis = memberKpis || baseKpis;
    const monthlyData = getMonthlyData();
    const insights = insightCards(dashboardMode, selectedMember);

    const shouldFade = chartRelevancy(searchResult);
    const globalFaded = !!selectedMember;

    const funnelConversionData = monthlyData.map((d) => ({ month: d.month, conversion: d.conversion || Math.round(d.qualified / d.leads * 100) }));
    const dealGrowthData = monthlyData.map((d) => ({ month: d.month, dealValue: d.dealValue || Math.round(d.revenue / 18) }));

    return (
        <div className="flex h-screen bg-enterprise-bg overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title={selectedMember ? `${selectedMember} — Performance` : 'Dashboard Overview'} />
                <main className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* AI Vision Results Overlay / Gallery */}
                    <AnimatePresence>
                        {searchQuery && searchResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 min-h-[400px] overflow-hidden"
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Insight Card */}
                                    <div className="bg-[#002147]/95 border border-[#E31E24]/30 p-5 rounded-xl shadow-lg relative overflow-hidden backdrop-blur-md">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E31E24]/5 blur-[80px] rounded-full pointer-events-none" />
                                        <div className="flex items-center justify-between mb-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
                                                <h3 className="text-white/80 font-black uppercase text-xs tracking-widest">AI Result Interpretation</h3>
                                            </div>
                                            <button onClick={() => resetDashboard()} className="text-white/40 hover:text-white transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="text-white/60 text-xs">
                                            {searchQuery || "Avanza Intelligence Overview"}
                                        </p>
                                        <p className="text-white text-lg font-medium leading-relaxed relative z-10">{searchResult.insights}</p>
                                    </div>
                                    {/* Triple-Chart Gallery */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Slot 1: Primary View */}
                                        <div className="bg-[#002147]/80 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center h-64 shadow-inner min-h-[300px]">
                                            <h4 className="text-white/60 text-xs font-bold uppercase mb-4 text-center tracking-wider w-full">{searchResult.chartType || 'Primary'} View</h4>
                                            {(() => {
                                                const rawData = searchResult.primaryData && searchResult.primaryData.length > 0
                                                    ? searchResult.primaryData
                                                    : [{ name: 'No Data', value: 0 }];

                                                const displayData = rawData.map((d, i) => {
                                                    const keys = Object.keys(d);
                                                    return {
                                                        name: String(d[keys[0]] || `Item ${i}`),
                                                        value: Number(d[keys[1]] || d.value) || 0,
                                                        secondary_value: keys.length > 2 ? Number(d[keys[2]]) || 0 : undefined
                                                    };
                                                });

                                                return (
                                                    <ResponsiveContainer width="100%" height="90%">
                                                        {searchResult.chartType === 'line' ? (
                                                            <LineChart data={displayData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                                                <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                                                <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#002147', borderColor: '#E31E24', color: '#fff' }} />
                                                                <Line type="monotone" dataKey="value" stroke="#E31E24" strokeWidth={3} dot={{ r: 4, fill: '#FFD700' }} />
                                                            </LineChart>
                                                        ) : searchResult.chartType === 'pie' ? (
                                                            <PieChart>
                                                                <Pie data={displayData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#E31E24">
                                                                    {displayData.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#E31E24' : '#FFD700'} />)}
                                                                </Pie>
                                                                <Tooltip contentStyle={{ backgroundColor: '#002147', borderColor: '#E31E24', color: '#fff' }} />
                                                            </PieChart>
                                                        ) : (
                                                            <BarChart data={displayData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                                                <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                                                <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#002147', borderColor: '#E31E24', color: '#fff' }} cursor={{ fill: '#ffffff10' }} />
                                                                <Bar dataKey="value" fill="#E31E24" radius={[4, 4, 0, 0]} />
                                                                {displayData[0]?.secondary_value !== undefined && (
                                                                    <Bar dataKey="secondary_value" fill="#FFD700" radius={[4, 4, 0, 0]} />
                                                                )}
                                                            </BarChart>
                                                        )}
                                                    </ResponsiveContainer>
                                                );
                                            })()}
                                        </div>

                                        {/* Slot 2: Composition */}
                                        <div className="bg-[#002147]/80 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center h-64 shadow-inner min-h-[300px]">
                                            <h4 className="text-white/60 text-xs font-bold uppercase mb-4 text-center tracking-wider w-full">Composition</h4>
                                            {(() => {
                                                const rawData = searchResult.secondaryData && searchResult.secondaryData.length > 0
                                                    ? searchResult.secondaryData
                                                    : searchResult.primaryData && searchResult.primaryData.length > 0
                                                        ? searchResult.primaryData
                                                        : [{ name: 'Waiting for Data', value: 1 }];

                                                const displayData = rawData.map((d, i) => {
                                                    const keys = Object.keys(d);
                                                    return {
                                                        name: String(d[keys[0]] || `Item ${i}`),
                                                        value: Number(d[keys[1]] || d.value) || 1
                                                    };
                                                });

                                                return (
                                                    <ResponsiveContainer width="100%" height="90%">
                                                        <PieChart>
                                                            <Pie data={displayData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} fill="#FFD700">
                                                                {displayData.map((entry, index) => <Cell key={`dist-cell-${index}`} fill={displayData.length === 1 && entry.name === 'Waiting for Data' ? '#ffffff30' : (index % 2 === 0 ? '#FFD700' : '#E31E24')} />)}
                                                            </Pie>
                                                            <Tooltip contentStyle={{ backgroundColor: '#002147', borderColor: '#E31E24', color: '#fff' }} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                );
                                            })()}
                                        </div>

                                        {/* Slot 3: Comparative Trend (Area) */}
                                        <div className="bg-[#002147]/80 border border-white/5 p-4 rounded-xl items-center flex flex-col justify-center h-64 shadow-inner min-h-[300px]">
                                            <h4 className="text-white/60 text-xs font-bold uppercase mb-4 text-center tracking-wider w-full">Trend / Volume</h4>
                                            {(() => {
                                                const rawData = searchResult.distributionData && searchResult.distributionData.length > 0
                                                    ? searchResult.distributionData
                                                    : searchResult.primaryData && searchResult.primaryData.length > 0
                                                        ? searchResult.primaryData
                                                        : [{ name: 'Waiting for Data', value: 0 }];

                                                const displayData = rawData.map((d, i) => {
                                                    const keys = Object.keys(d);
                                                    return {
                                                        name: String(d[keys[0]] || `Item ${i}`),
                                                        value: Number(d[keys[1]] || d.value) || 0
                                                    };
                                                });

                                                return (
                                                    <ResponsiveContainer width="100%" height="90%">
                                                        <AreaChart data={displayData}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                                            <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                                            <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                                            <Tooltip contentStyle={{ backgroundColor: '#002147', borderColor: '#E31E24', color: '#fff' }} />
                                                            <Area type="monotone" dataKey="value" stroke="#FFD700" fill="#E31E24" fillOpacity={0.4} strokeWidth={2} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Member context banner */}
                    <AnimatePresence>
                        {selectedMember && (
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="bg-avanza-500 text-white rounded-xl px-5 py-3 flex items-center justify-between shadow-glow"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <p className="text-sm font-bold">
                                        Viewing filtered analytics for <span className="italic">{selectedMember}</span>
                                        {' '}· Global charts contextualised
                                    </p>
                                </div>
                                <button onClick={resetDashboard} className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full font-bold">
                                    Reset to Global
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Row 1: AI Insights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {insights.map((ins, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${insightStyle[ins.type]}`}
                            >
                                <span className="text-lg flex-shrink-0">{ins.icon}</span>
                                <p className="text-xs leading-relaxed font-medium">{ins.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Row 2: KPI Cards (6+) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {activeKpis.map((kpi, i) => (
                            <KpiCard key={kpi.label} {...kpi} index={i} />
                        ))}
                    </div>

                    {/* Row 3: Revenue Bar + Donut + Funnel */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className={`col-span-12 lg:col-span-5 ${shouldFade('bar') ? 'bi-fade' : 'bi-highlight'}`}>
                            <RevenueBarChart isSales={isSales} />
                        </div>
                        <div className={`col-span-12 lg:col-span-3 ${shouldFade('donut') ? 'bi-fade' : 'bi-highlight'}`}>
                            <DonutChart faded={globalFaded && !searchResult?.highlight?.includes('donut')} />
                        </div>
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('funnel') ? 'bi-fade' : 'bi-highlight'}`}>
                            <PipelineFunnel />
                        </div>
                    </div>

                    {/* Row 4: Line Chart + Conversion Trend */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className={`col-span-12 lg:col-span-7 ${shouldFade('line') ? 'bi-fade' : 'bi-highlight'}`}>
                            <MonthlyLineChart isSales={isSales} data={monthlyData} />
                        </div>
                        <div className={`col-span-12 lg:col-span-5 ${shouldFade('line') ? 'bi-fade' : 'bi-highlight'}`}>
                            <LeadConversionChart data={funnelConversionData} />
                        </div>
                    </div>

                    {/* Row 5: HBar + Scatter + Deal Growth */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('hbar') ? 'bi-fade' : 'bi-highlight'}`}>
                            <HorizontalBarChart selectedMember={selectedMember} />
                        </div>
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('scatter') ? 'bi-fade' : 'bi-highlight'}`}>
                            <ScatterPlot selectedMember={selectedMember} />
                        </div>
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('deal') ? 'bi-fade' : 'bi-highlight'}`}>
                            <DealGrowthChart data={dealGrowthData} />
                        </div>
                    </div>

                    {/* Row 6: Region Heatmap + Product Stacked + Radar */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('heatmap') ? 'bi-fade' : 'bi-highlight'}`}>
                            <RegionHeatmap />
                        </div>
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('stacked') ? 'bi-fade' : 'bi-highlight'}`}>
                            <ProductStackedBar />
                        </div>
                        <div className={`col-span-12 lg:col-span-4 ${shouldFade('radar') ? 'bi-fade' : 'bi-highlight'}`}>
                            <TeamRadar selectedMember={selectedMember} />
                        </div>
                    </div>

                    {/* Row 7: Team Table */}
                    <div className="mt-8">
                        <TeamTable
                            selectedMember={selectedMember}
                            setSelectedMember={setSelectedMember}
                            resetDashboard={resetDashboard}
                            isSales={isSales}
                        />
                    </div>

                    <div className="h-4" />
                </main>
            </div>
        </div>
    );
};

export default OverviewDashboard;
