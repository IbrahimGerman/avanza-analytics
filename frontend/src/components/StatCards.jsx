
import React from 'react';
import { TrendingUp, Users, Target, Award, ArrowUpRight } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color, isActive }) => {
    return (
        <div className={`card-premium p-6 relative overflow-hidden transition-all duration-300 ${!isActive ? 'bi-fade' : 'bi-highlight active-kpi'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 flex items-center justify-center`}>
                    <Icon className="h-6 w-6" style={{ color }} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">
                        {trend}% <ArrowUpRight className="h-3 w-3" />
                    </div>
                )}
            </div>
            <div>
                <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-text-primary tracking-tight">{value}</h3>
            </div>

            {/* Sparkline decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                <div className="h-full" style={{ width: '45%', backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const StatCards = ({ stats, highlightContext }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {stats.map((stat) => (
                <StatCard
                    key={stat.label}
                    {...stat}
                    isActive={!highlightContext || highlightContext.relevantKPIs.includes(stat.label)}
                />
            ))}
        </div>
    );
};

export default StatCards;
