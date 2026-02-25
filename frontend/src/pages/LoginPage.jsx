import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); navigate('/select'); }, 900);
    };

    return (
        <div className="min-h-screen flex bg-enterprise-bg font-sans">
            {/* ── Left branding panel ── */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0f172a] relative overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-avanza-700 rounded-full blur-[120px] opacity-20 pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-mauve-800 rounded-full blur-[140px] opacity-20 pointer-events-none" />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-avanza-500 rounded-xl flex items-center justify-center shadow-glow">
                        <span className="text-white font-black text-xl">A</span>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">
                        AVANZA <span className="text-avanza-400 italic">AI</span>
                    </span>
                </div>

                {/* Hero copy */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <p className="text-avanza-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
                            Enterprise Intelligence Platform
                        </p>
                        <h1 className="text-5xl font-extrabold leading-tight text-white mb-6">
                            Empowering <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-avanza-400 to-mauve-400 italic">
                                Executive Decisions
                            </span>
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                            Real-time BI analytics unified with enterprise AI.
                            Visualise data, predict trends and optimise performance across all regions.
                        </p>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-12 flex gap-10"
                    >
                        {[['$2.4M', 'Revenue YTD'], ['135', 'Deals Closed'], ['66%', 'Win Rate']].map(([val, label]) => (
                            <div key={label}>
                                <p className="text-2xl font-black text-white">{val}</p>
                                <p className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom badge */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-slate-500 text-xs">Connected to Avanza-PostgreSQL Cluster</span>
                </div>
            </div>

            {/* ── Right login form ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8">
                        <div className="w-9 h-9 bg-avanza-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-lg">A</span>
                        </div>
                        <span className="font-bold text-lg text-slate-800">AVANZA <span className="text-avanza-500 italic">AI</span></span>
                    </div>

                    <div className="bg-white rounded-2xl border border-enterprise-border shadow-card-lg p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h2>
                            <p className="text-slate-500 text-sm">Sign in to your Avanza dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Corporate Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@avanza.corp"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-black outline-none focus:border-avanza-500 focus:ring-2 focus:ring-avanza-100 transition-all placeholder:text-slate-400"
                                    style={{ color: '#0f172a' }}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <a href="#" className="text-xs font-semibold text-avanza-600 hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm text-black bg-white outline-none focus:border-avanza-500 focus:ring-2 focus:ring-avanza-100 transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-avanza-500" />
                                <span className="text-sm text-slate-500">Remember this device</span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-avanza-600 to-avanza-500 hover:from-avanza-700 hover:to-avanza-600 text-white rounded-xl font-bold text-sm shadow-md shadow-avanza-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <>Sign In to Dashboard <ChevronRight size={18} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-400">
                                New to the platform?{' '}
                                <a href="#" className="text-avanza-600 font-bold hover:underline">Contact IT Administrator</a>
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        © 2026 Avanza Solutions · Enterprise Analytics v3.1
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
