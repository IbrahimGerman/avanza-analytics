
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import StatCards from '../components/StatCards';
import ChartsGrid from '../components/ChartsGrid';
import TeamTable from '../components/TeamTable';
import { Filter, Calendar, MapPin, Building2, Bell, User } from 'lucide-react';

const MOCK_TEAM = [
    { id: 1, name: 'Adnan Farooq', region: 'Karachi', leads: 42, projected: 850, actual: 620, won: 12, success: 78 },
    { id: 2, name: 'Sara Ahmed', region: 'Lahore', leads: 38, projected: 720, actual: 580, won: 10, success: 82 },
    { id: 3, name: 'Zainab Ali', region: 'Islamabad', leads: 45, projected: 910, actual: 740, won: 14, success: 85 },
    { id: 4, name: 'Omar Khan', region: 'Dubai', leads: 31, projected: 640, actual: 420, won: 8, success: 65 },
    { id: 5, name: 'Mehwish Gul', region: 'Riyadh', leads: 29, projected: 580, actual: 510, won: 11, success: 88 },
];

const MOCK_STATS = [
    { label: 'Active Leads', value: '185', trend: 12, icon: Filter, color: '#C06080' },
    { label: 'Projected Signing', value: '$3.7M', trend: 8, icon: Calendar, color: '#6B2D5E' },
    { label: 'Actual Signing', value: '$2.9M', trend: 15, icon: Target, color: '#E83E6C' },
    { label: 'Won Deals', value: '56', trend: 4, icon: Award, color: '#1A1A2E' },
    { label: 'Success Rate %', value: '74%', trend: 2, icon: Users, color: '#C06080' },
];

const MainDashboard = () => {
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [currentTab, setCurrentTab] = useState('ALL');
    const [activeQuery, setActiveQuery] = useState('');
    const [highlightContext, setHighlightContext] = useState(null);

    // Logic to handle "Power BI" interaction when a member is selected
    useEffect(() => {
        if (selectedMemberId) {
            // Define what is relevant for a team member selection
            setHighlightContext({
                relevantKPIs: ['Active Leads', 'Actual Signing', 'Success Rate %'],
                relevantCharts: ['hbar-products', 'bar-targets', 'bar-leads']
            });
        } else {
            setHighlightContext(null);
        }
    }, [selectedMemberId]);

    const resetDashboard = () => {
        setSelectedMemberId(null);
        setCurrentTab('ALL');
        setActiveQuery('');
        setHighlightContext(null);
    };

    return (
        <div className="flex bg-[#F8F4F2] min-h-screen">
            <Sidebar onReset={resetDashboard} />

            <main className="flex-1 ml-64 p-8">
                {/* Top Header */}
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-1">Executive Sales Dashboard</h1>
                        <p className="text-text-secondary text-sm">Enterprise Intelligence Platform • Real-time Data</p>
                    </div>

                    <div className="flex-1 max-w-xl mx-12">
                        <SearchBar placeholder="Try 'Show Adnan Farooq performance' or 'Compare ME vs APA'..." />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer hover:scale-110 transition-transform">
                            <Bell className="h-6 w-6 text-text-primary" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
                        </div>
                        <div className="h-10 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-text-primary">Executive User</p>
                                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C06080] to-[#6B2D5E] flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                                EU
                            </div>
                        </div>
                    </div>
                </header>

                {/* Filters & Tabs Row */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        {['APA', 'ME', 'ALL'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setCurrentTab(tab)}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${currentTab === tab
                                        ? 'bg-[#1A1A2E] text-white shadow-xl'
                                        : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-text-primary">Global Regions</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-text-primary">FY 2024</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-text-primary">All Branches</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content Grid */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {/* Row 1: KPI Cards */}
                    <StatCards stats={MOCK_STATS} highlightContext={highlightContext} />

                    {/* Row 2-4: Charts */}
                    <ChartsGrid activeContext={highlightContext} />

                    {/* Row 5: Team Performance Table */}
                    <TeamTable
                        teamMembers={MOCK_TEAM}
                        selectedId={selectedMemberId}
                        onSelect={setSelectedMemberId}
                    />
                </div>

                {/* Reset Indicator (Visible when filtering) */}
                {selectedMemberId && (
                    <div className="fixed bottom-8 right-8 animate-bounce">
                        <button
                            onClick={resetDashboard}
                            className="px-6 py-3 bg-primary text-white rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-secondary transition-colors"
                        >
                            Clear Filters
                            <span className="bg-white/20 px-2 rounded-lg text-xs">ESC</span>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MainDashboard;
