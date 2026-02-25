
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api'; // Ensure API is imported

const Analytics = () => {
    const [topProducts, setTopProducts] = useState(null);
    const [regionPerformance, setRegionPerformance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, regionRes] = await Promise.all([
                    api.get('/dashboard/analytics/top-products'),
                    api.get('/dashboard/analytics/region-performance')
                ]);

                // Transform for ChartJS
                setTopProducts({
                    labels: productsRes.data.map(p => p.label),
                    datasets: [{
                        label: 'Revenue by Product',
                        data: productsRes.data.map(p => p.value),
                        backgroundColor: ['#1F4FD8', '#00D1B2', '#0B1F36', '#FFCA28', '#F44336']
                    }]
                });

                setRegionPerformance({
                    labels: regionRes.data.map(r => r.label),
                    datasets: [{
                        label: 'Revenue by Region',
                        data: regionRes.data.map(r => r.value),
                        backgroundColor: ['#1F4FD8', '#00D1B2', '#0B1F36', '#FFCA28']
                    }]
                });

            } catch (error) {
                console.error("Error fetching analytics", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Top 5 Products</h3>
                    <div className="h-64">
                        {topProducts && <Bar data={topProducts} options={{ responsive: true, maintainAspectRatio: false }} />}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Regional Performance</h3>
                    <div className="h-64">
                        {regionPerformance && <Doughnut data={regionPerformance} options={{ responsive: true, maintainAspectRatio: false }} />}
                    </div>
                </div>
            </div>

            {/* Drill Down Table Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Detailed Report</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Static rows for demo */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">North America</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Enterprise Cloud</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,200,500</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Europe</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cyber Security</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$980,000</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
