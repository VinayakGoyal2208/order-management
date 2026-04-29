import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import {
    ShoppingBag, User, Store, MapPin,
    Filter, Trash2, Eye, X, AlertCircle
} from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        API.get("/orders/admin/all")
            .then(res => {
                setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            })
            .catch(err => console.error("Admin Fetch Error:", err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                // This will correctly call baseURL + "/orders/" + id
                await API.delete(`/orders/${id}`);
                setOrders(orders.filter(o => o._id !== id));
            } catch (err) {
                // This will tell us if it's a 404 (Route missing) or 403 (Admin check failed)
                console.error("Delete Error Status:", err.response?.status);
                alert(err.response?.data?.message || "Delete failed");
            }
        }
    };

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                        <p className="text-slate-500 font-medium">Viewing real-time status updates from all vendors</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <Filter size={18} className="text-slate-400 ml-2" />
                        <select
                            className="border-none focus:ring-0 text-sm font-bold text-slate-600 bg-transparent pr-8"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Filter: All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">

                                {/* Info Group */}
                                <div className="flex items-center gap-6 flex-1 w-full">
                                    <div className="hidden sm:block bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <ShoppingBag className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-black text-slate-900 uppercase">#{order._id.slice(-8)}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Vendor/Buyer Group */}
                                <div className="flex flex-col sm:flex-row gap-8 flex-[2] w-full border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-8">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Customer</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                                        <p className="text-[11px] text-slate-500">{order.customerPhone}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Seller / Vendor</p>
                                        <p className="text-sm font-bold text-slate-800">
                                           {order.vendor?.companyName || "Vendor Name Missing"}
                                        </p>
                                        {order.vendor?.email && (
                                            <p className="text-[11px] text-slate-500">{order.vendor.email}</p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Amount</p>
                                        <p className="text-lg font-black text-slate-900">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex-1 md:flex-none p-3 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex justify-center items-center gap-2 text-xs font-bold"
                                    >
                                        <Eye size={18} /> Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="flex-1 md:flex-none p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex justify-center items-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QUICK VIEW MODAL (Logic same as before, simplified for read-only) */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-6 flex justify-between items-center border-b">
                            <h3 className="font-black uppercase text-sm tracking-widest text-slate-400">Order Summary</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Shipping To</p>
                                    <p className="text-xs font-bold text-slate-700 mt-1">{selectedOrder.shippingAddress}</p>
                                    <p className="text-xs font-black text-blue-600 mt-2">PIN: {selectedOrder.pincode}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Vendor Contact</p>
                                    <p className="text-xs font-bold text-slate-700 mt-1">{selectedOrder.vendor?.businessName}</p>
                                    <p className="text-xs font-medium text-slate-500">{selectedOrder.vendor?.phoneNumber || "No Phone"}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Line Items</p>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm p-3 border rounded-xl">
                                            <span className="font-medium text-slate-600">x{item.quantity} {item.name}</span>
                                            <span className="font-black">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <span className="text-xs font-bold uppercase text-slate-400">Paid Total</span>
                            <span className="text-2xl font-black">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

function StatusBadge({ status }) {
    const config = {
        pending: "bg-orange-100 text-orange-600",
        processing: "bg-blue-100 text-blue-600",
        delivered: "bg-emerald-100 text-emerald-600",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config[status.toLowerCase()] || "bg-slate-100"}`}>
            {status}
        </span>
    );
}