
import React from 'react';
import SearchBar from '../components/SearchBar';
import { BarChart3, PieChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModeSelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F4F2] flex flex-col">
            {/* Header */}
            <header className="h-20 px-8 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-[#C06080] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <span className="font-bold text-xl text-[#1A1A2E]">AVANZA</span>
                </div>

                <SearchBar placeholder="Predict next quarter's revenue..." />

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-text-primary">Executive User</p>
                        <p className="text-xs text-text-secondary">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#6B2D5E] border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-text-primary mb-4 tracking-tight">Select Analytics Context</h1>
                    <p className="text-lg text-text-secondary max-w-xl mx-auto">
                        Choose your focus area to load specialized metrics, KPI cards, and AI-driven performance insights.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">
                    {/* Sales Analytics Card */}
                    <div
                        onClick={() => navigate('/')}
                        className="card-premium group relative bg-white p-10 cursor-pointer overflow-hidden border-b-4 border-b-[#C06080] hover:border-b-[#E83E6C]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C06080]/5 rounded-bl-full group-hover:bg-[#C06080]/10 transition-colors"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-[#F8F4F2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="h-8 w-8 text-[#C06080]" />
                            </div>

                            <h2 className="text-3xl font-bold text-text-primary mb-4">SALES ANALYTICS</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                Monitor active leads, actual signings, and revenue performance. Real-time tracking of regional sales targets and success rates.
                            </p>

                            <ul className="space-y-3 mb-10">
                                {['Direct Sales Tracking', 'Revenue Forecasting', 'Regional Pipeline', 'Deal Win-Loss Analysis'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#C06080]"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center gap-2 text-[#C06080] font-bold group-hover:gap-4 transition-all">
                                Enter Sales Dashboard <ArrowRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Presales Analytics Card */}
                    <div
                        onClick={() => navigate('/')}
                        className="card-premium group relative bg-white p-10 cursor-pointer overflow-hidden border-b-4 border-b-[#6B2D5E] hover:border-b-[#9D418A]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B2D5E]/5 rounded-bl-full group-hover:bg-[#6B2D5E]/10 transition-colors"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-[#F8F4F2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <PieChart className="h-8 w-8 text-[#6B2D5E]" />
                            </div>

                            <h2 className="text-3xl font-bold text-text-primary mb-4">PRESALES ANALYTICS</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                Analyze solution architect workloads, POC success rates, and presales-to-sale conversion metrics across all product lines.
                            </p>

                            <ul className="space-y-3 mb-10">
                                {['POC Health Monitor', 'Resource Allocation', 'Solutioning Pipeline', 'Bid Success Metrics'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#6B2D5E]"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center gap-2 text-[#6B2D5E] font-bold group-hover:gap-4 transition-all">
                                Enter Presales Dashboard <ArrowRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-text-secondary flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium uppercase tracking-widest">System Status: Optimal</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium uppercase tracking-widest italic font-serif">Avanza AI Engine v4.0</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ModeSelectionPage;
