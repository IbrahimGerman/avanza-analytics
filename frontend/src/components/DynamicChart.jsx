
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
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

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

const DynamicChart = ({ type, data, options, title }) => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6
                }
            },
            title: {
                display: !!title,
                text: title,
                font: { size: 14, weight: 'bold' }
            },
        },
        ...options
    };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return <Bar data={data} options={defaultOptions} />;
            case 'line':
                return <Line data={data} options={defaultOptions} />;
            case 'doughnut':
                return <Doughnut data={data} options={defaultOptions} />;
            case 'pie':
                return <Pie data={data} options={defaultOptions} />;
            case 'kpi_card':
                return (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                        <span className="text-gray-500 text-sm">{data.title}</span>
                        <span className="text-3xl font-bold text-gray-800 my-2">{data.value}</span>
                        <span className={`text-sm font-medium ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {data.change}
                        </span>
                    </div>
                );
            default:
                return <div className="flex items-center justify-center h-full text-gray-400">Unsupported Chart Type</div>;
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full w-full">
            {renderChart()}
        </div>
    );
};

export default DynamicChart;
