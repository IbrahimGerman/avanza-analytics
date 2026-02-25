import { create } from 'zustand';

export const teamMembers = [
    { id: 1, name: 'Ahmed Khan', role: 'Senior Consultant', avatar: 'AK', department: 'sales', revenue: 87400, leads: 142, deals: 34, winRate: 72, avgDealValue: 2571, conversionRate: 24, activePipeline: 12, trend: 'up', color: '#e11d48', region: 'ME' },
    { id: 2, name: 'Sara Williams', role: 'Account Executive', avatar: 'SW', department: 'sales', revenue: 64200, leads: 118, deals: 27, winRate: 65, avgDealValue: 2378, conversionRate: 23, activePipeline: 9, trend: 'up', color: '#be123c', region: 'APA' },
    { id: 3, name: 'Michael Ross', role: 'Sales Director', avatar: 'MR', department: 'sales', revenue: 112000, leads: 89, deals: 41, winRate: 81, avgDealValue: 2732, conversionRate: 46, activePipeline: 14, trend: 'up', color: '#9f1239', region: 'ME' },
    { id: 4, name: 'Priya Mehta', role: 'Presales Engineer', avatar: 'PM', department: 'presales', revenue: 53800, leads: 201, deals: 18, winRate: 58, avgDealValue: 2989, conversionRate: 9, activePipeline: 21, trend: 'down', color: '#e11d48', region: 'APA' },
    { id: 5, name: 'James Carter', role: 'Business Analyst', avatar: 'JC', department: 'presales', revenue: 41000, leads: 96, deals: 15, winRate: 53, avgDealValue: 2733, conversionRate: 16, activePipeline: 8, trend: 'down', color: '#be123c', region: 'Global' },
    { id: 6, name: 'Fatima Al-Hassan', role: 'Presales Consultant', avatar: 'FA', department: 'presales', revenue: 71200, leads: 178, deals: 22, winRate: 68, avgDealValue: 3236, conversionRate: 12, activePipeline: 18, trend: 'up', color: '#7c3aed', region: 'ME' },
    { id: 7, name: 'Omar Khalid', role: 'Enterprise AE', avatar: 'OK', department: 'sales', revenue: 98500, leads: 131, deals: 36, winRate: 75, avgDealValue: 2736, conversionRate: 27, activePipeline: 11, trend: 'up', color: '#0891b2', region: 'Global' },
];

export const getKpisForQuarterYear = (mode, year, quarter) => {
    const multiplier = { '2023': 0.7, '2024': 0.85, '2025': 1.0, '2026': 1.15, '2027': 1.28 }[year] || 1;
    const qMult = { 'Q1': 0.85, 'Q2': 1.0, 'Q3': 1.05, 'Q4': 1.15 }[quarter] || 1;
    const m = multiplier * qMult;
    if (mode === 'sales') return [
        { label: 'Total Revenue', value: `$${(2.4 * m).toFixed(1)}M`, change: `+${(18.2 * m / 1.4).toFixed(1)}%`, up: true, icon: 'dollar' },
        { label: 'Deals Closed', value: String(Math.round(135 * m)), change: `+${(12.5 * m / 1.4).toFixed(1)}%`, up: true, icon: 'trending' },
        { label: 'Avg Deal Size', value: `$${Math.round(17800 * m).toLocaleString()}`, change: `+${(4.1 * m / 1.4).toFixed(1)}%`, up: true, icon: 'bar' },
        { label: 'Win Rate', value: `${Math.round(66 * (m * 0.95))}%`, change: '-1.3%', up: false, icon: 'target' },
        { label: 'Active Pipeline', value: `$${(1.8 * m).toFixed(1)}M`, change: `+${(8.4 * m / 1.4).toFixed(1)}%`, up: true, icon: 'activity' },
        { label: 'Forecast Q+1', value: `$${(2.9 * m).toFixed(1)}M`, change: `+${(22.1 * m / 1.4).toFixed(1)}%`, up: true, icon: 'trending' },
    ];
    return [
        { label: 'Total Leads', value: String(Math.round(646 * m)), change: `+${(22.4 * m / 1.4).toFixed(1)}%`, up: true, icon: 'trending' },
        { label: 'Qualified Leads', value: String(Math.round(412 * m)), change: `+${(15.1 * m / 1.4).toFixed(1)}%`, up: true, icon: 'target' },
        { label: 'Proposals Sent', value: String(Math.round(189 * m)), change: `+${(8.6 * m / 1.4).toFixed(1)}%`, up: true, icon: 'bar' },
        { label: 'Discovery Calls', value: String(Math.round(310 * m)), change: `+${(31.2 * m / 1.4).toFixed(1)}%`, up: true, icon: 'dollar' },
        { label: 'Conversion Rate', value: `${Math.round(12 * (m * 0.9))}%`, change: `+${(3.2 * m / 1.4).toFixed(1)}%`, up: true, icon: 'activity' },
        { label: 'Avg Lead Score', value: String(Math.round(74 * (m * 0.97))), change: `+${(5.8 * m / 1.4).toFixed(1)}%`, up: true, icon: 'trending' },
    ];
};

export const getMonthlyDataForQuarterYear = (mode, year, quarter) => {
    const multiplier = { '2023': 0.65, '2024': 0.82, '2025': 1.0, '2026': 1.18, '2027': 1.35 }[year] || 1;
    const qMonths = { 'Q1': ['Jan', 'Feb', 'Mar'], 'Q2': ['Apr', 'May', 'Jun'], 'Q3': ['Jul', 'Aug', 'Sep'], 'Q4': ['Oct', 'Nov', 'Dec'] }[quarter] || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const base = [
        { revenue: 320000, cost: 180000, leads: 95, qualified: 62 },
        { revenue: 410000, cost: 220000, leads: 118, qualified: 78 },
        { revenue: 375000, cost: 195000, leads: 102, qualified: 67 },
        { revenue: 490000, cost: 245000, leads: 145, qualified: 98 },
        { revenue: 445000, cost: 210000, leads: 132, qualified: 91 },
        { revenue: 520000, cost: 260000, leads: 158, qualified: 115 },
        { revenue: 480000, cost: 230000, leads: 143, qualified: 102 },
        { revenue: 565000, cost: 275000, leads: 167, qualified: 128 },
    ];
    return qMonths.map((month, i) => ({
        month,
        revenue: Math.round(base[i % base.length].revenue * multiplier),
        cost: Math.round(base[i % base.length].cost * multiplier),
        leads: Math.round(base[i % base.length].leads * multiplier),
        qualified: Math.round(base[i % base.length].qualified * multiplier),
        dealValue: Math.round((base[i % base.length].revenue / 18) * multiplier),
        conversion: Math.round(base[i % base.length].qualified / base[i % base.length].leads * 100),
    }));
};

export const regionalData = [
    { region: 'Middle East', revenue: 820000, leads: 215, deals: 52, color: '#e11d48' },
    { region: 'APA', revenue: 640000, leads: 178, deals: 38, color: '#be123c' },
    { region: 'Europe', revenue: 520000, leads: 142, deals: 29, color: '#9f1239' },
    { region: 'Americas', revenue: 380000, leads: 98, deals: 21, color: '#fda4af' },
    { region: 'Africa', revenue: 180000, leads: 61, deals: 12, color: '#fecdd3' },
];

export const funnelData = [
    { name: 'Total Leads', value: 646, fill: '#e11d48' },
    { name: 'Qualified', value: 412, fill: '#be123c' },
    { name: 'Proposal Sent', value: 189, fill: '#9f1239' },
    { name: 'Negotiations', value: 98, fill: '#7c3aed' },
    { name: 'Closed Won', value: 135, fill: '#0891b2' },
];

export const productData = [
    { product: 'CRM Suite', enterprise: 420, midMarket: 280, smb: 180 },
    { product: 'Analytics Pro', enterprise: 380, midMarket: 210, smb: 140 },
    { product: 'AI Engine', enterprise: 520, midMarket: 190, smb: 90 },
    { product: 'Cloud Infra', enterprise: 290, midMarket: 320, smb: 210 },
    { product: 'Security', enterprise: 350, midMarket: 240, smb: 160 },
];

export const radarData = [
    { metric: 'Lead Gen', 'Ahmed Khan': 85, 'Sara Williams': 72, 'Michael Ross': 90 },
    { metric: 'Conversion', 'Ahmed Khan': 72, 'Sara Williams': 65, 'Michael Ross': 81 },
    { metric: 'Avg Deal', 'Ahmed Khan': 68, 'Sara Williams': 75, 'Michael Ross': 88 },
    { metric: 'Retention', 'Ahmed Khan': 90, 'Sara Williams': 82, 'Michael Ross': 76 },
    { metric: 'Upsell', 'Ahmed Khan': 60, 'Sara Williams': 70, 'Michael Ross': 85 },
    { metric: 'NPS', 'Ahmed Khan': 78, 'Sara Williams': 80, 'Michael Ross': 92 },
];

export const donutData = [
    { name: 'Enterprise', value: 38, color: '#e11d48' },
    { name: 'Mid-Market', value: 29, color: '#be123c' },
    { name: 'SMB', value: 19, color: '#fda4af' },
    { name: 'Other', value: 14, color: '#fecdd3' },
];

export const scatterData = [
    { x: 12, y: 87, z: 34, name: 'Ahmed Khan' },
    { x: 8, y: 65, z: 27, name: 'Sara Williams' },
    { x: 15, y: 112, z: 41, name: 'Michael Ross' },
    { x: 6, y: 54, z: 18, name: 'Priya Mehta' },
    { x: 5, y: 41, z: 15, name: 'James Carter' },
    { x: 11, y: 71, z: 22, name: 'Fatima Al-Hassan' },
    { x: 13, y: 98, z: 36, name: 'Omar Khalid' },
];

export const initialNotifications = [
    { id: 1, type: 'alert', title: 'Win Rate Drop', message: 'James Carter win rate fell below 55%', time: '2m ago', read: false },
    { id: 2, type: 'success', title: 'Target Achieved!', message: 'Michael Ross hit $112K revenue milestone', time: '15m ago', read: false },
    { id: 3, type: 'info', title: 'New Leads Added', message: '28 new qualified leads assigned to ME region', time: '1h ago', read: false },
    { id: 4, type: 'alert', title: 'Pipeline Drop', message: 'Presales pipeline down 8% vs last quarter', time: '3h ago', read: true },
    { id: 5, type: 'success', title: 'Deal Closed', message: 'Omar Khalid closed $98K enterprise deal', time: '5h ago', read: true },
];

export const parseSearchQuery = (query, mode, members) => {
    const q = query.toLowerCase().trim();
    if (!q) return { type: 'reset', filter: null, member: null, highlight: [] };

    const memberMatch = members.find((m) =>
        q.includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().split(' ').some((part) => q.includes(part))
    );
    if (memberMatch) return { type: 'member', filter: memberMatch.name, member: memberMatch, highlight: ['kpi', 'hbar', 'scatter', 'table'] };

    if (q.includes('revenue') || q.includes('sales') || q.includes('deal')) return { type: 'metric', filter: 'revenue', member: null, highlight: ['bar', 'line', 'kpi'] };
    if (q.includes('lead') || q.includes('pipeline') || q.includes('funnel')) return { type: 'metric', filter: 'leads', member: null, highlight: ['funnel', 'line', 'kpi'] };
    if (q.includes('top') || q.includes('best') || q.includes('highest')) return { type: 'ranking', filter: 'top', member: null, highlight: ['hbar', 'scatter', 'table'] };
    if (q.includes('region') || q.includes('me') || q.includes('apa') || q.includes('middle east')) return { type: 'region', filter: q.includes('me') || q.includes('middle east') ? 'ME' : 'APA', member: null, highlight: ['heatmap', 'kpi'] };
    if (q.includes('performance') || q.includes('efficiency') || q.includes('team')) return { type: 'team', filter: 'team', member: null, highlight: ['radar', 'hbar', 'scatter', 'table'] };
    if (q.includes('target') || q.includes('goal') || q.includes('quota')) return { type: 'target', filter: 'target', member: null, highlight: ['kpi', 'bar'] };
    if (q.includes('product') || q.includes('product mix') || q.includes('crm') || q.includes('ai')) return { type: 'product', filter: 'product', member: null, highlight: ['stacked', 'donut'] };

    return { type: 'general', filter: null, member: null, highlight: ['kpi', 'bar', 'line'] };
};

export const useDashboardStore = create((set, get) => ({
    selectedMember: null,
    dashboardMode: 'sales',
    searchQuery: '',
    searchResult: null,
    selectedYear: '2026',
    selectedQuarter: 'Q1',
    notifications: initialNotifications,
    notificationsOpen: false,
    profileOpen: false,
    currentUser: { name: 'Global Manager', role: 'Administrator', department: 'Executive', initials: 'GM', email: 'admin@avanza.corp' },
    theme: 'light',

    setSelectedMember: (member) => {
        // Handle both object and string (name)
        const name = typeof member === 'object' ? member?.name : member;
        set({ selectedMember: name });
    },
    resetDashboard: () => set({ selectedMember: null, searchQuery: '', searchResult: null }),
    setMode: (mode) => {
        set({ dashboardMode: mode });
    },
    setSearchQuery: (q) => {
        const { dashboardMode } = get();
        const result = parseSearchQuery(q, dashboardMode, teamMembers);
        set({ searchQuery: q, searchResult: q ? result : null, selectedMember: result?.member?.name || get().selectedMember });
    },
    setYear: (year) => set({ selectedYear: year }),
    setQuarter: (quarter) => set({ selectedQuarter: quarter }),
    toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen, profileOpen: false })),
    closeNotifications: () => set({ notificationsOpen: false }),
    toggleProfile: () => set((s) => ({ profileOpen: !s.profileOpen, notificationsOpen: false })),
    closeProfile: () => set({ profileOpen: false }),
    markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    dismissNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
    toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

    getRadarData: (memberName) => {
        // Metrics: Speed, Accuracy, Signing Value, Lead Quality, Technical Depth
        const metrics = ['Speed', 'Accuracy', 'Signing Value', 'Lead Quality', 'Technical Depth'];

        // If no member selected, return average or baseline
        if (!memberName) {
            return metrics.map(m => ({
                metric: m,
                'Value': 70 // Baseline for team
            }));
        }

        const member = teamMembers.find(m => m.name === memberName);

        // Mock balanced data based on member attributes or balanced defaults for Priya/Umer/etc.
        const seed = (member?.id || 1) * 7;
        const hash = (str) => str.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), seed);

        return metrics.map(m => {
            const baseVal = member?.winRate || 65;
            const variance = hash(m) % 25;
            return {
                metric: m,
                'Value': Math.min(95, Math.max(40, baseVal - 10 + variance))
            };
        });
    },

    getKpis: () => {
        const { dashboardMode, selectedYear, selectedQuarter, searchResult } = get();
        let kpis = getKpisForQuarterYear(dashboardMode, selectedYear, selectedQuarter);
        if (searchResult?.type === 'region') {
            const mult = searchResult.filter === 'ME' ? 1.2 : 0.8;
            kpis = kpis.map(k => ({ ...k, value: typeof k.value === 'string' && k.value.startsWith('$') ? `$${(parseFloat(k.value.replace(/[$,M]/g, '')) * mult).toFixed(1)}M` : k.value }));
        }
        return kpis;
    },
    getMonthlyData: () => {
        const { dashboardMode, selectedYear, selectedQuarter, searchResult } = get();
        let data = getMonthlyDataForQuarterYear(dashboardMode, selectedYear, selectedQuarter);
        if (searchResult?.type === 'region') {
            const mult = searchResult.filter === 'ME' ? 1.15 : 0.85;
            data = data.map(d => ({ ...d, revenue: Math.round(d.revenue * mult), cost: Math.round(d.cost * mult) }));
        }
        return data;
    },
    getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
}));