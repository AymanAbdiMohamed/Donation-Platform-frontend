import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import { getAdminAnalytics } from "@/api/admin";

const AnalyticsCharts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAdminAnalytics();
                setData(response);
            } catch (err) {
                setError("Failed to load analytics");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (!data?.trends || data.trends.length === 0) {
        return <div className="text-gray-500 text-center p-4">Not enough data for charts yet.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Donation Trends Chart */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Donation Trends (Last 30 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.trends}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => val.slice(5)} // Show MM-DD
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `K${val / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount_kes"
                                stroke="#EC4899"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Charities Chart */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Charities by Volume</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.top_charities} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#FDF2F8' }}
                                contentStyle={{ borderRadius: '12px', border: 'none' }}
                                formatter={(value) => [`KES ${value.toLocaleString()}`, 'Raised']}
                            />
                            <Bar
                                dataKey="raised_kes"
                                fill="#DB2777"
                                radius={[0, 4, 4, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
