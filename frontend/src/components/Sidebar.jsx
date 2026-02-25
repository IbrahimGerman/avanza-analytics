import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, BarChart2, Settings, LogOut,
    TrendingUp, Target, ChevronRight,
} from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const getNav = (mode) => [
    { label: 'Overview', icon: LayoutDashboard, path: `/dashboard/${mode}` },
    { label: 'Team Analytics', icon: Users, path: '/dashboard/team' },
    { label: 'Reports', icon: BarChart2, path: '/dashboard/reports' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const Sidebar = () => {
    const { dashboardMode, resetDashboard } = useDashboardStore();
    const navigate = useNavigate();
    const isSales = dashboardMode === 'sales';

    const handleLogoClick = () => {
        resetDashboard();
        navigate('/select');
    };

    const handleSwitchMode = () => {
        const nextMode = dashboardMode === 'sales' ? 'presales' : 'sales';
        useDashboardStore.getState().setMode(nextMode);
        navigate(`/dashboard/${nextMode}`);
    };

    return (
        <aside className="w-[220px] flex-shrink-0 bg-[#0f172a] text-white flex flex-col h-full">
            {/* Logo */}
            <div
                onClick={handleLogoClick}
                className="h-16 px-5 flex items-center gap-3 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors group"
            >
                <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-8 h-8 bg-avanza-500 rounded-lg flex items-center justify-center shadow-glow flex-shrink-0"
                >
                    <span className="text-white font-black text-base">A</span>
                </motion.div>
                <div>
                    <p className="text-sm font-extrabold tracking-tight leading-none">AVANZA</p>
                    <p className="text-[10px] text-avanza-400 font-bold italic leading-tight">AI Analytics</p>
                </div>
            </div>

            {/* Mode badge */}
            <div className="px-4 py-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${isSales ? 'bg-avanza-500/15 text-avanza-300' : 'bg-mauve-500/15 text-mauve-300'}`}>
                    {isSales ? <TrendingUp size={13} /> : <Target size={13} />}
                    {isSales ? 'Sales Division' : 'Presales Division'}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-2 space-y-0.5">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">Main Menu</p>
                {getNav(dashboardMode).map(({ label, icon: Icon, path }) => (
                    <NavLink
                        key={label}
                        to={path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${isActive
                                ? 'bg-avanza-500 text-white shadow-sm'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={16} className="flex-shrink-0" />
                                <span className="flex-1 text-left">{label}</span>
                                {isActive && <ChevronRight size={14} className="opacity-70" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-white/5 pt-3">
                <button
                    onClick={handleSwitchMode}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 font-semibold hover:text-white hover:bg-white/10 transition-all group cursor-pointer"
                >
                    <div className={`w-2 h-2 rounded-full ${isSales ? 'bg-mauve-400' : 'bg-avanza-400'} group-hover:animate-pulse`} />
                    <span>Switch to {isSales ? 'Presales' : 'Sales'}</span>
                </button>
                <div className="flex items-center gap-3 mt-3 px-3 py-2.5 bg-white/5 rounded-lg">
                    <div className="w-7 h-7 bg-avanza-500 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">GM</div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">Global Manager</p>
                        <p className="text-[10px] text-slate-500 truncate">admin@avanza.corp</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
