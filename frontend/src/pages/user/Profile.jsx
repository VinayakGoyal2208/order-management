import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/useAuth";
import API from "../../services/api";
import { 
  User, Mail, Shield, LogOut, Settings, 
  X, ShoppingBag, Menu, Save, Camera, RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("profile"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/users/profile", formData);
      login({ ...res.data, token: user.token }); 
      alert("Profile updated!");
      setActiveTab("profile");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={20} />, action: () => setActiveTab('profile') },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={20} />, action: () => navigate('/orders') },
    { id: 'settings', label: 'Account Settings', icon: <Settings size={20} />, action: () => setActiveTab('settings') },
  ];

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-[#fcfcfd] overflow-hidden relative">
        
        {/* --- MOBILE HEADER --- */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center px-4 justify-between z-20">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-xl"><Menu size={20}/></button>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">{activeTab}</span>
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)}</div>
        </div>

        {/* --- SIDEBAR --- */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-10 px-2">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
          </div>

          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => { item.action(); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <button onClick={logout} className="mt-auto w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50"><LogOut size={20}/> Logout</button>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-10 pb-10 px-4 md:px-10">
          <div className="max-w-3xl mx-auto">
            
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-32 md:h-40 bg-emerald-600 relative">
                    {/* Image Upload Trigger */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 group">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-xl overflow-hidden">
                        {user?.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="text-emerald-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-16 md:pt-6 md:pl-48 pb-10 px-6">
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl font-black text-slate-900 break-words">{user?.name}</h2>
                      <div className="inline-block mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">{user?.role} Account</div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Fixed Email Box for Responsiveness */}
                      <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 min-w-0">
                        <div className="p-2.5 bg-white rounded-xl text-slate-400 flex-shrink-0"><Mail size={20}/></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                          <p className="text-sm font-bold text-slate-700 truncate hover:text-clip hover:whitespace-normal break-all">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-10 shadow-sm space-y-8 animate-in fade-in">
                <h1 className="text-3xl font-black text-slate-900">Settings</h1>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Name</label>
                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email</label>
                    <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all"/>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50">
                  {loading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}