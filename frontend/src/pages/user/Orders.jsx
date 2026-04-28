import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/useAuth";
import API from "../../services/api";
import { 
  Package, X, Menu, LogOut, User, Settings, ShoppingBag, 
  Image as ImageIcon, ChevronRight, Box 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    API.get("/orders/user")
      .then(res => {
        const sortedOrders = res.data.sort((a, b) => 
          new Date(b.createdAt || parseInt(b._id.substring(0, 8), 16) * 1000) - 
          new Date(a.createdAt || parseInt(a._id.substring(0, 8), 16) * 1000)
        );
        setOrders(sortedOrders);
      })
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
      <div className="flex h-[calc(100vh-64px)] bg-[#fcfcfd] overflow-hidden relative font-sans">
        
        {/* --- MOBILE HEADER --- */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center px-4 justify-between z-20">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-xl"><Menu size={20}/></button>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">My Orders</span>
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)}</div>
        </div>

        {/* --- SIDEBAR --- */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-10 px-2">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
          </div>
          <nav className="space-y-1 flex-1">
             <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all"><User size={20} /> My Profile</button>
             <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm bg-emerald-600 text-white shadow-lg shadow-emerald-100"><ShoppingBag size={20} /> My Orders</button>
             <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all"><Settings size={20} />Account Settings</button>
          </nav>
          <button onClick={logout} className="mt-auto w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"><LogOut size={20}/> Logout</button>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-10 pb-10 px-4 md:px-10">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Purchase History</h1>
              <p className="text-slate-500 font-medium">Overview of your recent transactions</p>
            </header>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o._id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 border border-slate-100 shrink-0">
                        <Box size={32} strokeWidth={1.5} />
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${getStatusStyle(o.status)}`}>
                            {o.status || 'Verified'}
                          </span>
                        </div>
                        <p className="text-lg font-black text-slate-800 leading-tight">₹{o.totalAmount?.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {o.items?.length || o.products?.length || 0} Items • ID: {o._id?.slice(-6)}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedOrder(o)} 
                      className="flex items-center justify-center gap-2 text-xs font-black text-slate-600 bg-slate-50 hover:bg-emerald-600 hover:text-white px-6 py-4 rounded-2xl transition-all active:scale-95"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 border-dashed">
                <Package size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No orders found</p>
              </div>
            )}
          </div>
        </main>

        {/* --- ORDER DETAILS MODAL --- */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 transition-all">
            <div className="bg-white w-full max-w-2xl h-[92vh] md:h-auto md:max-h-[85vh] rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
              
              <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div className="min-w-0 px-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800">Order Details</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {selectedOrder._id}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto flex-1 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Items Breakdown</h3>
                  {(selectedOrder?.items || selectedOrder?.products || []).map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                        {item.image || item.productImage || item.product?.image ? (
                          <img 
                            src={item.image || item.productImage || item.product?.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-800 text-sm truncate">{item.productName || item.name || "Product"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                          ₹{(item.price || 0).toLocaleString()} × {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-black text-slate-900 text-sm">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between items-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <span>Total Bill</span>
                    <span className="text-2xl font-black text-emerald-600">₹{(selectedOrder?.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:hidden border-t border-slate-50 bg-white shrink-0">
                 <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}