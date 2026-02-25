import { teamMembers, getKpisForQuarterYear, getMonthlyDataForQuarterYear, regionalData, funnelData, productData } from '../store/useDashboardStore';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
    async getKpis({ mode = 'sales', year = '2026', quarter = 'Q1' } = {}) {
        await delay(80);
        return getKpisForQuarterYear(mode, year, quarter);
    },

    async getMonthlyData({ mode = 'sales', year = '2026', quarter = 'Q1' } = {}) {
        await delay(80);
        return getMonthlyDataForQuarterYear(mode, year, quarter);
    },

    async getTeamMembers({ mode, region, memberId } = {}) {
        await delay(100);
        let data = [...teamMembers];
        if (mode && mode !== 'all') data = data.filter((m) => m.department === mode);
        if (region && region !== 'all') data = data.filter((m) => m.region === region);
        if (memberId) data = data.filter((m) => m.id === memberId);
        return data;
    },

    async getRegionalData({ year = '2026' } = {}) {
        await delay(80);
        const multiplier = { '2023': 0.65, '2024': 0.82, '2025': 1.0, '2026': 1.18, '2027': 1.35 }[year] || 1;
        return regionalData.map((r) => ({ ...r, revenue: Math.round(r.revenue * multiplier) }));
    },

    async getFunnelData({ mode = 'sales', year = '2026', quarter = 'Q1' } = {}) {
        await delay(80);
        const multiplier = { '2023': 0.65, '2024': 0.82, '2025': 1.0, '2026': 1.18, '2027': 1.35 }[year] || 1;
        const qMult = { 'Q1': 0.85, 'Q2': 1.0, 'Q3': 1.05, 'Q4': 1.15 }[quarter] || 1;
        const m = multiplier * qMult;
        return funnelData.map((f) => ({ ...f, value: Math.round(f.value * m) }));
    },

    async getProductData({ year = '2026' } = {}) {
        await delay(80);
        const multiplier = { '2023': 0.65, '2024': 0.82, '2025': 1.0, '2026': 1.18, '2027': 1.35 }[year] || 1;
        return productData.map((p) => ({
            ...p,
            enterprise: Math.round(p.enterprise * multiplier),
            midMarket: Math.round(p.midMarket * multiplier),
            smb: Math.round(p.smb * multiplier),
        }));
    },

    async query(nlpQuery) {
        await delay(150);
        const q = nlpQuery.toLowerCase();
        const memberMatch = teamMembers.find((m) => q.includes(m.name.toLowerCase()) || m.name.toLowerCase().split(' ').some((p) => q.includes(p)));
        if (memberMatch) {
            return { type: 'member', data: memberMatch, message: `Showing analytics for ${memberMatch.name}` };
        }
        if (q.includes('top') || q.includes('best')) {
            const top = [...teamMembers].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
            return { type: 'ranking', data: top, message: 'Showing top 3 team performers' };
        }
        return { type: 'general', data: null, message: 'Showing global dashboard' };
    },
};
