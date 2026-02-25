
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DynamicChart from '../components/DynamicChart';
import StatCard from '../components/StatCard';
import { Activity, Clock, Server, AlertTriangle } from 'lucide-react';

const OperationalDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock operational data locally if backend not fully wired for this specific endpoint yet, 
    // but we'll try to fetch from the generic endpoint.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/ops');
                setData(response.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Operational Analytics...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Operational Analytics</h2>
                    <p className="text-gray-500">System health, transaction volumes, and latency metrics.</p>
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
                        icon={[Activity, Clock, Server, AlertTriangle][index % 4]}
                        color={['blue', 'teal', 'purple', 'orange'][index % 4]}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
                {data?.charts?.map((chart, index) => (
                    <div key={index} className="h-full col-span-1">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">System Health Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Core Banking System</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Gateway</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mobile App API</span>
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Degraded Performance</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Reporting Server</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Operational</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Error Logs (Last Hour)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Timestamp</th>
                                    <th className="px-4 py-2 text-left">Error Code</th>
                                    <th className="px-4 py-2 text-left">Service</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2 text-gray-600">10:45:22</td>
                                    <td className="px-4 py-2 text-red-500">503</td>
                                    <td className="px-4 py-2 text-gray-600">API Gateway</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 text-gray-600">10:42:10</td>
                                    <td className="px-4 py-2 text-orange-500">408</td>
                                    <td className="px-4 py-2 text-gray-600">Auth Service</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationalDashboard;
