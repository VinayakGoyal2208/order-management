import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/admin.api";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.log("Stats error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6">
          <Card title="Users" value={stats.users || 0} />
          <Card title="Restaurants" value={stats.restaurants || 0} />
          <Card title="Orders" value={stats.orders || 0} />
          <Card title="Revenue" value={`₹${stats.revenue || 0}`} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}