import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, ArrowRight, BarChart2, Users, CheckCircle } from 'lucide-react';

const ModeSelection = () => {
    const setMode = useDashboardStore((s) => s.setMode);
    const navigate = useNavigate();

    const handleSelect = (mode) => {
        setMode(mode);
        navigate(`/dashboard/${mode}`);
    };

    const cards = [
        {
            mode: 'sales',
            title: 'Sales Analytics',
            icon: TrendingUp,
            accent: 'avanza',
            desc: 'Track revenue targets, conversion funnels, closed deals and team performance across all accounts.',
            stats: [{ label: 'Revenue YTD', value: '$2.4M' }, { label: 'Win Rate', value: '66%' }, { label: 'Deals', value: '135' }],
            features: ['Revenue vs Cost charts', 'Monthly trend analysis', 'Deal pipeline visualisation'],
        },
        {
            mode: 'presales',
            title: 'Presales Analytics',
            icon: Target,
            accent: 'mauve',
            desc: 'Monitor pipeline health, lead qualification rates, proposal conversion and client engagement KPIs.',
            stats: [{ label: 'Total Leads', value: '646' }, { label: 'Qualified', value: '412' }, { label: 'Proposals', value: '189' }],
            features: ['Lead gen pipeline', 'Qualification scoring', 'Discovery call tracking'],
        },
    ];

    const accentMap = {
        avanza: {
            icon: 'bg-avanza-50 text-avanza-500 group-hover:bg-avanza-500 group-hover:text-white',
            border: 'hover:border-avanza-400',
            cta: 'text-avanza-600',
            stat: 'text-avanza-500',
        },
        mauve: {
            icon: 'bg-mauve-50 text-mauve-600 group-hover:bg-mauve-600 group-hover:text-white',
            border: 'hover:border-mauve-400',
            cta: 'text-mauve-700',
            stat: 'text-mauve-600',
        },
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-avanza-900 rounded-full blur-[150px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-mauve-900 rounded-full blur-[150px] opacity-20 pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14 text-center relative z-10"
            >
                <div className="w-16 h-16 bg-avanza-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-5 shadow-glow animate-pulse-glow">
                    A
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">
                    AVANZA <span className="text-avanza-400 italic">AI</span>
                </h1>
                <p className="text-slate-400 mt-3 text-base">Select your analytics environment to continue</p>
            </motion.div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-7 max-w-4xl w-full relative z-10">
                {cards.map(({ mode, title, icon: Icon, accent, desc, stats, features }, idx) => {
                    const a = accentMap[accent];
                    return (
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.5, ease: 'easeOut' }}
                            whileHover={{ y: -8, scale: 1.015 }}
                            onClick={() => handleSelect(mode)}
                            className={`group cursor-pointer bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 ${a.border} transition-all duration-300`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${a.icon}`}>
                                <Icon size={28} />
                            </div>

                            <h2 className="text-xl font-extrabold text-white mb-3">{title}</h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>

                            {/* Stats */}
                            <div className="flex gap-6 mb-6 pb-6 border-b border-white/10">
                                {stats.map(({ label, value }) => (
                                    <div key={label}>
                                        <p className={`text-lg font-black ${a.stat}`}>{value}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                {features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                                        <CheckCircle size={14} className={`flex-shrink-0 ${a.stat}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className={`flex items-center gap-2 font-bold text-sm ${a.cta} group-hover:gap-3 transition-all`}>
                                Enter Workspace <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-slate-600 text-xs relative z-10"
            >
                Enterprise-grade data encryption active · Avanza-PostgreSQL Cluster
            </motion.p>
        </div>
    );
};

export default ModeSelection;