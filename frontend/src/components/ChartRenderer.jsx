import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ChartRenderer = ({ type, data, title }) => {
    if (!data || data.length === 0) return <div className="text-gray-400">No data to display</div>;

    // Generic data mapping logic (simplified for robust demo)
    // Assuming data is array of objects. We need to guess keys for labels and values if not strictly defined,
    // or use the first string column as label and first number column as value.

    const keys = Object.keys(data[0]);
    const labelKey = keys.find(k => typeof data[0][k] === 'string') || keys[0];
    const valueKey = keys.find(k => typeof data[0][k] === 'number') || keys[1];

    const chartData = {
        labels: data.map(d => d[labelKey]),
        datasets: [
            {
                label: title || valueKey,
                data: data.map(d => d[valueKey]),
                backgroundColor: [
                    'rgba(0, 26, 51, 0.9)',   // Avanza Navy
                    'rgba(153, 0, 0, 0.9)',   // Crimson
                    'rgba(0, 26, 51, 0.7)',   // Navy (lighter opacity alternate)
                    'rgba(153, 0, 0, 0.7)',   // Crimson (lighter opacity alternate)
                ],
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white' }
            },
            title: {
                display: !!title,
                text: title,
                color: 'white',
                font: { size: 16 }
            },
        },
        scales: {
            x: { ticks: { color: 'gray' }, grid: { color: '#334155' } },
            y: { ticks: { color: 'gray' }, grid: { color: '#334155' } }
        }
    };

    if (!type || type === 'table') return null; // handled elsewhere

    switch (type) {
        case 'bar': return <Bar options={options} data={chartData} />;
        case 'horizontalBar': return <Bar options={{ ...options, indexAxis: 'y' }} data={chartData} />;
        case 'line': return <Line options={options} data={chartData} />;
        case 'pie': return <Pie options={options} data={chartData} />;
        case 'doughnut': return <Doughnut options={options} data={chartData} />;
        default: return <Bar options={options} data={chartData} />;
    }
};

export default ChartRenderer;
