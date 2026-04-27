import Layout from "../../components/common/Layout";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { Package, X, ShoppingCart, CreditCard, Calendar, Hash, ArrowLeft, Download } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    API.get("/orders/user")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Purchase History</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {orders.map(o => (
              <div key={o._id} className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-emerald-600 shrink-0">
                    <Package size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusStyle(o.status)}`}>
                            {o.status || 'Unknown'}
                        </span>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">
                            ID: {o._id?.slice(-8)}
                        </p>
                    </div>
                    <p className="text-xl font-black text-slate-800">₹{o.totalAmount?.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-bold">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Date Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-50 sm:border-0">
                  <button 
                    onClick={() => setSelectedOrder(o)} 
                    className="w-full sm:w-auto text-center text-sm font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-xl transition-all border border-emerald-100 active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 px-6">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No transactions yet</p>
          </div>
        )}

        {/* ================= ORDER DETAILS MODAL ================= */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 transition-all">
            <div className="bg-white w-full max-w-2xl h-[92vh] md:h-auto md:max-h-[85vh] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom md:zoom-in duration-300">
              
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 truncate">Order Details</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
                    <Hash size={10}/> {selectedOrder._id}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><Calendar size={12}/> Order Placed</p>
                    <p className="font-black text-slate-700 text-sm md:text-base">
                        {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-2 mb-2"><CreditCard size={12}/> Payment</p>
                    <p className="font-black text-emerald-700 text-sm md:text-base uppercase tracking-tight">Verified Secure</p>
                  </div>
                </div>

                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                  <ShoppingCart size={14} className="text-emerald-500" /> Items Breakdown
                </h3>

                <div className="space-y-3">
                  {(selectedOrder?.items || selectedOrder?.products || []).length > 0 ? (
                    (selectedOrder?.items || selectedOrder?.products).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 md:p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div className="min-w-0 pr-4">
                          <p className="font-black text-slate-800 text-sm md:text-base truncate">{item.productName || item.name || "Product Name"}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Unit Price: ₹{(item.price || 0).toLocaleString()} • Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="font-black text-slate-900 shrink-0">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400 italic">No specific line items available.</p>
                    </div>
                  )}
                </div>

                {/* Final Breakdown */}
                <div className="mt-10 space-y-3 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-slate-800 font-black">₹{(selectedOrder?.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span>Tax & Logistics</span>
                    <span className="text-emerald-600">Inclusive</span>
                  </div>
                  <div className="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
                    <p className="font-black text-slate-900 text-lg uppercase tracking-tighter">Total Paid</p>
                    <p className="text-2xl font-black text-emerald-600">₹{(selectedOrder?.totalAmount || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0 bg-white">
                 <button 
                  onClick={() => window.print()} 
                  className="w-full md:w-auto flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-all p-2"
                >
                  <Download size={14} /> Get Invoice PDF
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full md:hidden bg-slate-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
                >
                  CLOSE DETAILS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}