import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, X, CheckCircle, AlertTriangle, Info, LogOut, Settings, User, FileText, Download, Loader2 } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const YEARS = ['2023', '2024', '2025', '2026', '2027'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const notifIcon = { alert: AlertTriangle, success: CheckCircle, info: Info };
const notifColor = { alert: 'text-red-500 bg-red-50', success: 'text-green-500 bg-green-50', info: 'text-blue-500 bg-blue-50' };

const Header = ({ title = 'Dashboard Overview' }) => {

    const {
        selectedMember, dashboardMode, resetDashboard,
        selectedYear, selectedQuarter, setYear, setQuarter,
        notifications, notificationsOpen, toggleNotifications, closeNotifications, markAllRead, dismissNotification,
        profileOpen, toggleProfile, closeProfile, currentUser,
    } = useDashboardStore();
    const navigate = useNavigate();
    const [focused, setFocused] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) closeNotifications();
            if (profileRef.current && !profileRef.current.contains(e.target)) closeProfile();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [closeNotifications, closeProfile]);

    const handleLogout = () => { navigate('/'); };

    const handleLogoClick = () => {
        resetDashboard();
        navigate('/select');
    };

    const handleExportPdf = () => {
        window.print();
    };

    const handleExportCsv = () => {
        const headers = ["Member", "Revenue", "Deals", "Win Rate"];
        const rows = [
            ["Ahmed Khan", "87400", "34", "72%"],
            ["Sara Williams", "64200", "27", "65%"]
        ];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Avanza_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <header className="h-16 bg-white border-b border-enterprise-border px-6 flex items-center gap-4 sticky top-0 z-30 flex-shrink-0">
            {/* Logo */}
            <div
                onClick={handleLogoClick}
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity pr-4 border-r border-slate-100"
            >
                <div className="w-8 h-8 bg-avanza-500 rounded-lg flex items-center justify-center shadow-glow">
                    <span className="text-white font-black text-base">A</span>
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-black tracking-tighter leading-none text-slate-900">AVANZA</p>
                    <p className="text-[8px] text-avanza-500 font-bold italic leading-tight">Analytics</p>
                </div>
            </div>

            <div className="flex items-center gap-2 min-w-[120px]">
                <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
                <span className={`text-[10px] ${dashboardMode === 'sales' ? 'bg-avanza-50 text-avanza-600' : 'bg-mauve-50 text-mauve-600'} font-bold px-2 py-0.5 rounded-full capitalize`}>{dashboardMode}</span>
            </div>

            {/* Search bar */}
            <div className={`flex-1 flex max-w-2xl transition-all ${focused ? 'max-w-3xl' : ''}`}>
                <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-3">
                {/* Active member banner */}
                <AnimatePresence>
                    {selectedMember && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-2 bg-avanza-50 border border-avanza-200 text-avanza-700 text-xs font-bold px-3 py-1.5 rounded-full"
                        >
                            <div className="w-1.5 h-1.5 bg-avanza-500 rounded-full animate-pulse" />
                            Viewing: {selectedMember}
                            <button onClick={resetDashboard} className="ml-1 text-avanza-400 hover:text-avanza-700"><X size={11} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Year filter */}
                <div className="relative">
                    <select
                        value={selectedYear}
                        onChange={(e) => setYear(e.target.value)}
                        className="appearance-none text-xs text-slate-600 font-semibold border border-slate-200 px-3 py-1.5 pr-7 rounded-lg hover:bg-slate-50 focus:outline-none focus:border-avanza-300 bg-white cursor-pointer"
                    >
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Quarter filter */}
                <div className="relative">
                    <select
                        value={selectedQuarter}
                        onChange={(e) => setQuarter(e.target.value)}
                        className="appearance-none text-xs text-slate-600 font-semibold border border-slate-200 px-3 py-1.5 pr-7 rounded-lg hover:bg-slate-50 hover:border-avanza-300 focus:outline-none focus:ring-2 focus:ring-avanza-100 bg-white cursor-pointer transition-all"
                    >
                        {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-1 border-l border-slate-100 pl-3 ml-1">
                    <button
                        onClick={handleExportPdf}
                        title="Export PDF"
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-avanza-600 hover:bg-avanza-50 rounded-lg transition-all"
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        onClick={handleExportCsv}
                        title="Export Excel (CSV)"
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    >
                        <Download size={16} />
                    </button>
                </div>

                {/* Bell */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="relative w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Bell size={16} className="text-slate-500" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-avanza-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <AnimatePresence>
                        {notificationsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                            >
                                <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                                    <p className="font-bold text-slate-800 text-sm">Notifications</p>
                                    <button onClick={markAllRead} className="text-xs text-avanza-600 font-semibold hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((n) => {
                                        const Icon = notifIcon[n.type] || Info;
                                        return (
                                            <div
                                                key={n.id}
                                                className={`px-4 py-3 border-b border-slate-50 flex items-start gap-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-avanza-50/30' : ''}`}
                                            >
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notifColor[n.type]}`}>
                                                    <Icon size={13} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                                </div>
                                                <button onClick={() => dismissNotification(n.id)} className="text-slate-300 hover:text-slate-500 flex-shrink-0">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {notifications.length === 0 && (
                                        <div className="px-4 py-8 text-center text-slate-400 text-sm">All caught up! 🎉</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Avatar / Profile */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={toggleProfile}
                        className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 py-1 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-avanza-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {currentUser.initials}
                        </div>
                        <ChevronDown size={13} className="text-slate-400" />
                    </button>
                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                            >
                                <div className="px-4 py-4 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-avanza-500 flex items-center justify-center text-white font-black text-sm">
                                            {currentUser.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                                            <p className="text-[10px] text-slate-500">{currentUser.role}</p>
                                            <p className="text-[10px] text-avanza-500 font-semibold">{currentUser.department}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => { closeProfile(); navigate('/dashboard/settings'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                    >
                                        <Settings size={14} />
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => { closeProfile(); navigate('/dashboard/settings'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                    >
                                        <User size={14} />
                                        My Profile
                                    </button>
                                    <div className="my-1 border-t border-slate-50" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
