import LoginForm from "../../components/forms/LoginForm";
import API from "../../services/api";
import { useAuth } from "../../context/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if redirected from a successful registration
  useEffect(() => {
    if (new URLSearchParams(location.search).get("registered")) {
      setShowSuccess(true);
    }
  }, [location]);

  const handleLogin = async (form) => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);

      if (res.data.role === "admin") navigate("/admin-dashboard");
      else if (res.data.role === "vendor") navigate("/vendor-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Branding */}
        <Link to="/" className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight transition-all hover:opacity-80">
          B2B<span className="text-green-600">CONNECT</span>
        </Link>
        <h2 className="mt-6 text-2xl md:text-3xl font-black tracking-tight text-slate-800">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Sign in to manage your inventory and orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/60 rounded-[2.5rem] sm:px-10 border border-slate-100 relative overflow-hidden">
          
          {/* Loading State Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
              <div className="h-10 w-10 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin mb-3" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticating...</p>
            </div>
          )}

          {/* Success Message (Post-Registration) */}
          {showSuccess && !error && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} className="shrink-0" />
              Account created! Please log in to continue.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Form wrapper */}
          <div className="transition-all">
            <LoginForm onSubmit={handleLogin} />
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-tighter">
                <span className="bg-white px-4 text-slate-400 font-black">New to the platform?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                to="/register" 
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-slate-50 text-sm font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98]"
              >
                Create a business account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={14} className="text-green-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Secure Encrypted Login
          </p>
        </div>
        
        <p className="mt-4 text-center text-[10px] text-slate-300 font-medium">
          &copy; 2026 B2B Connect Marketplace.
        </p>
      </div>
    </div>
  );
}