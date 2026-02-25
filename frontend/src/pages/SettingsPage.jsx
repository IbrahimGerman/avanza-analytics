import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User, Lock, Palette, Bell, CheckCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
    <div className="card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-50">
            <div className="w-8 h-8 bg-avanza-50 rounded-lg flex items-center justify-center">
                <Icon size={15} className="text-avanza-500" />
            </div>
            <h2 className="font-bold text-slate-800">{title}</h2>
        </div>
        {children}
    </div>
);

const Settings = () => {
    const { currentUser, theme, toggleTheme } = useDashboardStore();
    const [saved, setSaved] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [notifs, setNotifs] = useState({ kpiAlerts: true, dealWon: true, newLeads: true, weeklyReport: false, chatMentions: true });
    const [profileData, setProfileData] = useState({ name: currentUser.name, email: currentUser.email, role: currentUser.role, department: currentUser.department });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="flex h-screen bg-enterprise-bg overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title="Settings" />
                <main className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-800">Account Settings</h1>
                            <p className="text-sm text-slate-400 mt-0.5">Manage your profile, security and preferences</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-avanza-500 hover:bg-avanza-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                        >
                            {saved ? <><CheckCircle size={15} /> Saved!</> : 'Save Changes'}
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Profile Info */}
                        <Section icon={User} title="Profile Information">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-16 h-16 rounded-2xl bg-avanza-500 flex items-center justify-center text-white font-black text-xl">
                                    {currentUser.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{profileData.name}</p>
                                    <p className="text-sm text-slate-400">{profileData.email}</p>
                                    <button className="text-xs text-avanza-600 font-semibold mt-1 hover:underline">Change photo</button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Full Name', key: 'name', type: 'text' },
                                    { label: 'Email Address', key: 'email', type: 'email' },
                                    { label: 'Role', key: 'role', type: 'text' },
                                    { label: 'Department', key: 'department', type: 'text' },
                                ].map(({ label, key, type }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                                        <input
                                            type={type}
                                            value={profileData[key]}
                                            onChange={(e) => setProfileData((d) => ({ ...d, [key]: e.target.value }))}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-avanza-400 focus:ring-2 focus:ring-avanza-100 transition-all"
                                            style={{ color: '#0f172a' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Password Change */}
                        <Section icon={Lock} title="Security">
                            <div className="space-y-4">
                                {[
                                    { label: 'Current Password', placeholder: '••••••••' },
                                    { label: 'New Password', placeholder: 'Min 8 characters' },
                                    { label: 'Confirm New Password', placeholder: 'Repeat new password' },
                                ].map(({ label, placeholder }, i) => (
                                    <div key={label}>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                                        <div className="relative">
                                            <input
                                                type={showPw ? 'text' : 'password'}
                                                placeholder={placeholder}
                                                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-avanza-400 focus:ring-2 focus:ring-avanza-100 transition-all"
                                                style={{ color: '#0f172a' }}
                                            />
                                            {i === 0 && (
                                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-xs text-amber-700 font-medium">Password must be 8+ characters with uppercase, number, and symbol.</p>
                                </div>
                                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-sm transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </Section>

                        {/* Theme Toggle */}
                        <Section icon={Palette} title="Appearance">
                            <p className="text-xs text-slate-400 mb-4">Customize the visual appearance of your dashboard.</p>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    {theme === 'light' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-500" />}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
                                        <p className="text-[10px] text-slate-400">{theme === 'light' ? 'Clean enterprise look' : 'Reduced eye strain'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-avanza-500' : 'bg-slate-200'}`}
                                >
                                    <motion.div
                                        layout
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                        animate={{ left: theme === 'dark' ? '1.5rem' : '0.25rem' }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {[
                                    { name: 'Avanza Red', primary: '#e11d48', secondary: '#fecdd3' },
                                    { name: 'Ocean Blue', primary: '#0891b2', secondary: '#bae6fd' },
                                    { name: 'Forest', primary: '#059669', secondary: '#bbf7d0' },
                                ].map(({ name, primary }) => (
                                    <button key={name} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors text-left">
                                        <div className="w-5 h-5 rounded-full" style={{ background: primary }} />
                                        <span className="text-xs font-medium text-slate-600">{name}</span>
                                    </button>
                                ))}
                            </div>
                        </Section>

                        {/* Notifications */}
                        <Section icon={Bell} title="Notification Preferences">
                            <div className="space-y-3">
                                {[
                                    { key: 'kpiAlerts', label: 'KPI Alert Notifications', desc: 'Get notified when KPIs drop below thresholds' },
                                    { key: 'dealWon', label: 'Deal Won Celebrations', desc: 'Notifications when team closes a deal' },
                                    { key: 'newLeads', label: 'New Lead Assignments', desc: 'Alert when new leads are assigned' },
                                    { key: 'weeklyReport', label: 'Weekly Report Digest', desc: 'Summary every Monday 9 AM' },
                                    { key: 'chatMentions', label: 'Chat Mentions', desc: 'When someone @mentions you' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{label}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                                            className={`relative w-10 h-5.5 h-6 rounded-full transition-colors flex-shrink-0 ${notifs[key] ? 'bg-avanza-500' : 'bg-slate-200'}`}
                                        >
                                            <motion.div
                                                layout
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                                animate={{ left: notifs[key] ? '1.25rem' : '0.25rem' }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </div>
                    <div className="h-4" />
                </main>
            </div>
        </div>
    );
};

export default Settings;
