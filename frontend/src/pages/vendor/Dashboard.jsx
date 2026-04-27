import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import StatCard from "../../components/cards/StatCard";
import { LayoutDashboard, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/vendor")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Vendor Overview
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">
              Real-time Business Analytics
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* ✅ FIX: Pass the Component reference (TrendingUp) not the JSX (<TrendingUp />) */}
            <StatCard 
              title="Gross Revenue" 
              value={`₹${totalRevenue.toLocaleString()}`} 
              icon={TrendingUp} 
              color="emerald"
            />

            <StatCard 
              title="Total Orders" 
              value={orders.length} 
              icon={LayoutDashboard} 
              color="blue"
            />

            <StatCard
              title="Pending Action"
              value={orders.filter((o) => o.status?.toLowerCase() === "pending").length}
              icon={Clock} 
              color="orange"
            />

            <StatCard
              title="Successful"
              value={orders.filter((o) => o.status?.toLowerCase() === "delivered" || o.status?.toLowerCase() === "completed").length}
              icon={CheckCircle} 
              color="purple"
            />
          </div>
        )}

        <div className="mt-10 p-10 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                Detailed Analytics & Order History Coming Soon
             </p>
        </div>
      </div>
    </Layout>
  );
}