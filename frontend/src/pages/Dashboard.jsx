import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, salesKpis, presalesKpis, teamMembers } from '../store/useDashboardStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import RevenueBarChart from '../components/RevenueBarChart';
import MonthlyLineChart from '../components/MonthlyLineChart';
import DonutChart from '../components/DonutChart';
import HorizontalBarChart from '../components/HorizontalBarChart';
import ScatterPlot from '../components/ScatterChart';
import TeamTable from '../components/TeamTable';

// Derive member-context KPIs
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
        ]
        : [
            { label: 'Leads', value: String(m.leads), change: '+21.3%', up: true, icon: 'trending' },
            { label: 'Qualified', value: String(m.leads - 30), change: '+18.5%', up: true, icon: 'target' },
            { label: 'Proposals', value: String(m.deals * 3), change: '+6.2%', up: true, icon: 'bar' },
            { label: 'Win Rate', value: `${m.winRate}%`, change: m.trend === 'up' ? '+3.2%' : '-2.1%', up: m.trend === 'up', icon: 'dollar' },
        ];
};

const Dashboard = () => {
    const { selectedMember, dashboardMode, setSelectedMember, resetDashboard } = useDashboardStore();
    const isSales = dashboardMode === 'sales';

    const baseKpis = isSales ? salesKpis : presalesKpis;
    const memberKpis = getMemberKpis(selectedMember, isSales);
    const activeKpis = memberKpis || baseKpis;

    // Fading logic: when a member is selected, charts unrelated to member analysis fade
    const globalFaded = !!selectedMember;

    return (
        <div className="flex h-screen bg-enterprise-bg overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title={selectedMember ? `${selectedMember} — Performance` : 'Dashboard Overview'} />

                {/* Scrollable content area */}
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
                                        {' '}· Global charts are contextualised
                                    </p>
                                </div>
                                <button
                                    onClick={resetDashboard}
                                    className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full font-bold"
                                >
                                    Reset to Global
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Row 1: KPI Cards ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {activeKpis.map((kpi, i) => (
                            <KpiCard key={kpi.label} {...kpi} index={i} />
                        ))}
                    </div>

                    {/* ── Row 2: Main grouped bar + Donut ── */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 lg:col-span-8">
                            <RevenueBarChart isSales={isSales} />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <DonutChart faded={globalFaded} />
                        </div>
                    </div>

                    {/* ── Row 3: Area line + Horizontal Bar ── */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 lg:col-span-7">
                            <MonthlyLineChart isSales={isSales} />
                        </div>
                        <div className="col-span-12 lg:col-span-5">
                            <HorizontalBarChart selectedMember={selectedMember} />
                        </div>
                    </div>

                    {/* ── Row 4: Scatter + Team Table ── */}
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 lg:col-span-4">
                            <ScatterPlot selectedMember={selectedMember} faded={false} />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <TeamTable
                                selectedMember={selectedMember}
                                setSelectedMember={setSelectedMember}
                                resetDashboard={resetDashboard}
                                isSales={isSales}
                            />
                        </div>
                    </div>

                    {/* Footer spacer */}
                    <div className="h-4" />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;