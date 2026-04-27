import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import {
    Package,
    User,
    MapPin,
    Clock,
    CheckCircle,
    Filter,
    ChevronRight
} from "lucide-react";

export default function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/orders/vendor")
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    const updateStatus = (id, status) => {
        API.put(`/orders/${id}`, { status }).then(() => {
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
        });
    };

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());

    if (loading) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 mb-4"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching Orders...</p>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
                {/* Header & Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Incoming Orders</h1>
                        <p className="text-slate-500 text-sm md:text-base font-medium">Manage business shipments and logistics</p>
                    </div>

                    <div className="w-full sm:w-auto flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
                        <div className="p-2 bg-slate-50 rounded-xl">
                            <Filter size={16} className="text-slate-400" />
                        </div>
                        <select
                            className="flex-1 sm:flex-none bg-transparent border-none focus:ring-0 text-xs font-black text-slate-700 pr-10 uppercase tracking-widest"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Shipments</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4 md:space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white p-12 md:p-20 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100">
                            <Package size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No orders found in this category.</p>
                        </div>
                    ) : (
                        filteredOrders.map(o => (
                            <div key={o._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:border-emerald-200 transition-all duration-300">
                                
                                {/* Responsive Top Bar */}
                                <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100">
                                            ID: #{o._id.slice(-6)}
                                        </span>
                                        <StatusBadge status={o.status} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <span className="text-[10px] uppercase text-slate-400">Total Value</span>
                                        <span className="text-lg font-black text-emerald-600">₹{o.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Order Content Grid */}
                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    
                                    {/* Customer Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                            <User size={14} className="text-emerald-500" /> Customer Details
                                        </h3>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="font-black text-slate-800 text-sm">{o.customerName}</p>
                                            <p className="text-[11px] text-slate-500 font-medium mb-3 truncate">{o.customerEmail}</p>
                                            <div className="flex items-start gap-2 pt-3 border-t border-slate-200/50">
                                                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                                <p className="text-xs leading-relaxed text-slate-600 font-medium">{o.shippingAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                            <Package size={14} className="text-emerald-500" /> Manifest
                                        </h3>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                            {o.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white border border-slate-50 rounded-lg shadow-sm">
                                                    <p className="font-bold text-slate-700">
                                                        <span className="inline-block w-6 text-emerald-600">x{item.quantity}</span> 
                                                        <span className="truncate">{item.name}</span>
                                                    </p>
                                                    <p className="text-slate-400 font-black">₹{item.price?.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-3 bg-slate-50/50 p-4 rounded-[1.5rem] lg:bg-transparent lg:p-0">
                                        <h3 className="lg:hidden text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Update Status</h3>
                                        <button
                                            onClick={() => updateStatus(o._id, "processing")}
                                            className={`flex items-center justify-center gap-3 py-3.5 rounded-xl font-black text-[10px] tracking-widest transition-all active:scale-95 ${
                                                o.status === 'processing' 
                                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-500 hover:text-white'
                                            }`}
                                        >
                                            <Clock size={16} /> {o.status === 'processing' ? 'IN PROCESSING' : 'START PROCESSING'}
                                        </button>
                                        <button
                                            onClick={() => updateStatus(o._id, "delivered")}
                                            className={`flex items-center justify-center gap-3 py-3.5 rounded-xl font-black text-[10px] tracking-widest transition-all active:scale-95 ${
                                                o.status === 'delivered' 
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-600 hover:text-white'
                                            }`}
                                        >
                                            <CheckCircle size={16} /> {o.status === 'delivered' ? 'SHIPMENT DELIVERED' : 'MARK DELIVERED'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: "bg-orange-50 text-orange-600 border-orange-100",
        processing: "bg-amber-50 text-amber-600 border-amber-100",
        delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    const s = status.toLowerCase();

    return (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border ${styles[s] || "bg-slate-50 text-slate-500"}`}>
            {status}
        </span>
    );
}