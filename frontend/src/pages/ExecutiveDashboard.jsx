
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DynamicChart from '../components/DynamicChart';
import StatCard from '../components/StatCard';
import { DollarSign, TrendingUp, Users, Activity } from 'lucide-react';

const ExecutiveDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/executive');
                setData(response.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Executive Overview...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Executive Overview</h2>
                    <p className="text-gray-500">High-level banking performance metrics.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">Export PDF</button>
                    <button className="bg-[#1F4FD8] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Refresh Data</button>
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
                        icon={[DollarSign, TrendingUp, Users, Activity][index % 4]}
                        color={['blue', 'teal', 'purple', 'orange'][index % 4]}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96">
                    {data?.charts?.[0] && (
                        <DynamicChart
                            type={data.charts[0].type}
                            data={{
                                labels: data.charts[0].labels,
                                datasets: data.charts[0].datasets
                            }}
                            title={data.charts[0].title}
                        />
                    )}
                </div>
                <div className="h-96">
                    {data?.charts?.[1] && (
                        <DynamicChart
                            type={data.charts[1].type}
                            data={{
                                labels: data.charts[1].labels,
                                datasets: data.charts[1].datasets
                            }}
                            title={data.charts[1].title}
                        />
                    )}
                </div>
            </div>

            {/* Third Row (Placeholder for more data) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Alerts</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                            High transaction volume detected in NY Branch
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                            Server latency spike at 14:00 EST
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            System upgrade completed successfully
                        </li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">AI Insights</h3>
                    <p className="text-sm text-gray-600 italic">
                        "Revenue is projected to grow by 12% next month based on current loan application trends. Suggest focusing marketing efforts on the 'Growth Fund' product in the Europe region."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;
