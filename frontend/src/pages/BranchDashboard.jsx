
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DynamicChart from '../components/DynamicChart';
import StatCard from '../components/StatCard';
import { Target, TrendingUp, Award, MapPin } from 'lucide-react';

const BranchDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/branch');
                setData(response.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Branch Performance...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Branch Performance</h2>
                    <p className="text-gray-500">Comparative analytics across regional branches.</p>
                </div>
                <div className="flex space-x-2">
                    <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition outline-none">
                        <option>All Regions</option>
                        <option>North America</option>
                        <option>Europe</option>
                        <option>Asia Pacific</option>
                    </select>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data?.kpis?.map((kpi, index) => (
                    <StatCard
                        key={index}
                        title={kpi.label}
                        value={kpi.value}
                        change={kpi.change}
                        trend={kpi.trend}
                        icon={[Target, TrendingUp, Award, MapPin][index % 4]}
                        color={['blue', 'teal', 'purple', 'orange'][index % 4]}
                    />
                ))}
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                {data?.charts?.map((chart, index) => (
                    <div key={index} className="h-full">
                        <DynamicChart
                            type={chart.type}
                            data={{
                                labels: chart.labels,
                                datasets: chart.datasets
                            }}
                            title={chart.title}
                        />
                    </div>
                ))}
            </div>

            {/* Branch Table */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Top Performing Branches</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">New York HQ</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">North America</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$4.5M</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">112%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">London Central</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Europe</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$3.2M</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">105%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BranchDashboard;
