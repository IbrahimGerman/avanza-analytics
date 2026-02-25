import React from 'react';
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
    const { selectedMember, dashboardMode, setSelectedMember, resetDashboard, searchResult, getKpis, getMonthlyData } = useDashboardStore();
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

                    {/* Search result banner */}
                    <AnimatePresence>
                        {searchResult && !selectedMember && (
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="bg-slate-800 text-white rounded-xl px-5 py-3 flex items-center gap-3"
                            >
                                <span className="text-lg">🔍</span>
                                <p className="text-sm">
                                    <span className="font-bold">AI Search:</span> Highlighting charts relevant to your query. Irrelevant charts are dimmed.
                                </p>
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
                    <TeamTable
                        selectedMember={selectedMember}
                        setSelectedMember={setSelectedMember}
                        resetDashboard={resetDashboard}
                        isSales={isSales}
                    />

                    <div className="h-4" />
                </main>
            </div>
        </div>
    );
};

export default OverviewDashboard;
