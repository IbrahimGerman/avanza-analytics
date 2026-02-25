import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, DollarSign, Target, BarChart2, Activity,
} from 'lucide-react';

const ICON_MAP = {
    dollar: DollarSign,
    trending: TrendingUp,
    bar: BarChart2,
    target: Target,
    activity: Activity,
};

const KpiCard = ({ label, value, change, up, icon = 'activity', index = 0, faded = false }) => {
    const Icon = ICON_MAP[icon] || Activity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: faded ? 0.18 : 1, y: 0, filter: faded ? 'saturate(0.2)' : 'saturate(1)' }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            whileHover={!faded ? { y: -4 } : {}}
            className="kpi-card"
        >
            {/* Icon badge */}
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-avanza-50 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-avanza-500" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${up
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                    {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {change}
                </span>
            </div>

            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{value}</h3>

            {/* Progress bar accent */}
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-avanza-500 to-avanza-300 rounded-full"
                />
            </div>
        </motion.div>
    );
};

export default KpiCard;
