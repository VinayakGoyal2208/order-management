import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/useAuth";
import { User, Mail, Shield, LogOut, Settings, ChevronRight } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth(); // Assuming logout is available in your context

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left px-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">Account Settings</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Manage your profile and account preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
          
          {/* Cover/Banner Area */}
          <div className="h-32 md:h-40 bg-emerald-600 flex items-end justify-center pb-4 relative">
             <div className="absolute top-4 right-4 hidden md:block">
                <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all">
                  <Settings size={20} />
                </button>
             </div>
             
             {/* Profile Image Avatar */}
             <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-2xl transform translate-y-12 md:translate-y-16 transition-transform">
                <User size={48} className="text-emerald-600" />
             </div>
          </div>
          
          {/* User Basic Info */}
          <div className="pt-16 md:pt-20 pb-8 px-6 text-center">
            <h2 className="text-xl md:text-2xl font-black text-slate-800">{user?.name || "Guest User"}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{user?.role || "Member"} Account</p>
            </div>
          </div>

          {/* Details List */}
          <div className="px-4 md:px-10 pb-10 space-y-3">
            
            {/* Email Field */}
            <div className="flex items-center gap-4 p-4 md:p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] transition-colors group">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-emerald-600 transition-colors">
                <Mail size={20} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="text-sm md:text-base font-bold text-slate-700 truncate">{user?.email || "Not provided"}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 md:hidden" />
            </div>

            {/* Status Field */}
            <div className="flex items-center gap-4 p-4 md:p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] transition-colors group">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-emerald-600 transition-colors">
                <Shield size={20} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                <p className="text-sm md:text-base font-bold text-slate-700">Verified Member</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 md:hidden" />
            </div>

            {/* Logout Button (Mobile Primary) */}
            <button 
                onClick={logout}
                className="w-full flex items-center gap-4 p-4 md:p-5 bg-red-50 hover:bg-red-100 rounded-[1.5rem] transition-all text-red-600 mt-4 active:scale-95"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-sm">
                <LogOut size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-70">Session Management</p>
                <p className="text-sm md:text-base font-black">Logout from Account</p>
              </div>
            </button>

          </div>
        </div>

        {/* Footer info for mobile */}
        <p className="text-center mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            App Version 1.0.4 • Secure Connection
        </p>
      </div>
    </Layout>
  );
}