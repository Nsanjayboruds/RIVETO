import React, { useEffect, useState, useContext } from "react";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { authDataContext } from "../Context/AuthProvider";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const activityData = [
  { day: "Mon", activity: 65 },
  { day: "Tue", activity: 90 },
  { day: "Wed", activity: 75 },
  { day: "Thu", activity: 120 },
  { day: "Fri", activity: 105 },
  { day: "Sat", activity: 80 },
  { day: "Sun", activity: 60 },
];

function Analytics() {
  const { serverUrl } = useContext(authDataContext);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyUsers: [],
    recentUsers: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/user/analytics`, {
        withCredentials: true,
      });

      setAnalytics(data);
    } catch (error) {
      console.error("Analytics fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Nav />
      <Sidebar />

      <div className="ml-0 lg:ml-64 p-6 pt-24 lg:pt-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Monitor platform performance and user activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-900/40 rounded-2xl p-6 border border-blue-700/30">
            <p className="text-blue-300 text-sm">Total Users</p>
            <h2 className="text-4xl font-bold mt-2">
              {loading ? "..." : analytics.totalUsers}
            </h2>
          </div>

          <div className="bg-green-900/40 rounded-2xl p-6 border border-green-700/30">
            <p className="text-green-300 text-sm">Active Users</p>
            <h2 className="text-4xl font-bold mt-2">
              {loading ? "..." : Math.round(analytics.totalUsers * 0.7)}
            </h2>
          </div>

          <div className="bg-purple-900/40 rounded-2xl p-6 border border-purple-700/30">
            <p className="text-purple-300 text-sm">Total Orders</p>
            <h2 className="text-4xl font-bold mt-2">
              {loading ? "..." : analytics.totalOrders}
            </h2>
          </div>

          <div className="bg-amber-900/40 rounded-2xl p-6 border border-amber-700/30">
            <p className="text-amber-300 text-sm">Total Revenue</p>

            <h2 className="text-4xl font-bold mt-2">
              ₹{loading ? "..." : analytics.totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity Logs</h3>

          <div className="space-y-4">
            {analytics.recentUsers.map((user, index) => (
              <div
                key={user._id || index}
                className="flex justify-between items-center border-b border-gray-700 pb-3"
              >
                <span>New User: {user.name}</span>

                <span className="text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
