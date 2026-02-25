
import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar, Bubble } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title
);

const ChartContainer = ({ title, children, isActive }) => (
    <div className={`card-premium p-6 flex flex-col h-full bg-white transition-all duration-500 ${!isActive ? 'bi-fade' : 'bi-highlight'}`}>
        <h3 className="text-sm font-bold text-text-primary mb-6 uppercase tracking-wider">{title}</h3>
        <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {children}
        </div>
    </div>
);

const ChartsGrid = ({ activeContext }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 10, weight: '600' }
                }
            }
        }
    };

    const donutData = {
        labels: ['Banking', 'Retail', 'Telecom', 'Government'],
        datasets: [{
            data: [300, 50, 100, 80],
            backgroundColor: ['#C06080', '#6B2D5E', '#E83E6C', '#1A1A2E'],
            borderWidth: 0,
        }]
    };

    const barData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
            label: 'Actual',
            data: [65, 59, 80, 81],
            backgroundColor: '#C06080',
            borderRadius: 4,
        }, {
            label: 'Target',
            data: [75, 70, 85, 90],
            backgroundColor: '#F8F4F2',
            borderRadius: 4,
        }]
    };

    const bubbleData = {
        datasets: [{
            label: 'Opportunities',
            data: [
                { x: 10, y: 20, r: 15 },
                { x: 40, y: 10, r: 10 },
                { x: 25, y: 30, r: 25 },
                { x: 60, y: 40, r: 12 },
            ],
            backgroundColor: '#6B2D5E',
        }]
    };

    const hBarData = {
        labels: ['Finacle Int.', 'Digital Wallet', 'NeoBank Pro', 'ERP Connect'],
        datasets: [{
            label: 'Revenue (M)',
            data: [45, 38, 32, 28],
            backgroundColor: '#C06080',
            indexAxis: 'y',
            borderRadius: 4,
        }]
    };

    const isRelevant = (chartKey) => {
        if (!activeContext) return true;
        return activeContext.relevantCharts.includes(chartKey);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ChartContainer title="Projected Signing (Cat)" isActive={isRelevant('donut-signing')}>
                <Doughnut data={donutData} options={chartOptions} />
            </ChartContainer>

            <ChartContainer title="Opportunity Matrix" isActive={isRelevant('bubble-ops')}>
                <Bubble data={bubbleData} options={chartOptions} />
            </ChartContainer>

            <ChartContainer title="Leads Distribution" isActive={isRelevant('bar-leads')}>
                <Bar data={barData} options={chartOptions} />
            </ChartContainer>

            <div className="md:col-span-2">
                <ChartContainer title="Top Products vs Performance" isActive={isRelevant('hbar-products')}>
                    <Bar data={hBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
                </ChartContainer>
            </div>

            <ChartContainer title="Monthly Target vs Actual" isActive={isRelevant('bar-targets')}>
                <Bar data={barData} options={chartOptions} />
            </ChartContainer>
        </div>
    );
};

export default ChartsGrid;
