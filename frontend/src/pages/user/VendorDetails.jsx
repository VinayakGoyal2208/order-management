import Layout from "../../components/common/Layout";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import ProductCard from "../../components/cards/ProductCard";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import { ShoppingBag, MapPin, ShieldCheck, ArrowLeft, Store, Lock, LogIn } from "lucide-react";

export default function VendorDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vRes = await API.get(`/vendors`);
        const found = vRes.data.find(v => v._id === id);
        setVendor(found);

        const pRes = await API.get(`/products/${id}`);
        setProducts(pRes.data);
      } catch (err) {
        console.error("Error loading vendor page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 mb-4"></div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Catalog...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!vendor ? (
        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-black text-slate-800">Vendor Profile Not Found</h2>
          <Link to="/" className="text-emerald-600 mt-6 inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest bg-emerald-50 px-6 py-3 rounded-xl">
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
          {/* Vendor Header */}
          <div className="relative bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 md:mb-12 overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <ShieldCheck size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Supplier</span>
              </div>
              
              <h1 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight">
                {vendor.companyName}
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
                <span className="w-fit bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {vendor.category || "General"}
                </span>
                <p className="flex items-start md:items-center gap-2 text-slate-500 font-medium text-sm">
                  <MapPin size={18} className="text-emerald-500 shrink-0" />
                  <span className="line-clamp-1">{vendor.address}</span>
                </p>
              </div>
            </div>
            
            {/* Background Icon Tease */}
            <Store className="absolute -bottom-6 -right-6 w-32 h-32 md:w-48 md:h-48 text-slate-100 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

          {/* Products Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Available Catalog</h2>
            </div>
            {user && (
               <span className="w-fit text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl uppercase tracking-widest">
                 {products.length} Products
               </span>
            )}
          </div>

          {/* --- CONDITIONAL RENDERING LOGIC --- */}
          {!user ? (
            /* 1. LOCKED STATE (Mobile optimized) */
            <div className="relative bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-8 md:p-20 text-center overflow-hidden">
              {/* Blurred background elements */}
              <div className="absolute inset-0 opacity-20 blur-xl pointer-events-none grid grid-cols-2 md:grid-cols-3 gap-4 p-10">
                  <div className="aspect-square bg-slate-300 rounded-3xl"></div>
                  <div className="aspect-square bg-slate-300 rounded-3xl"></div>
                  <div className="aspect-square bg-slate-300 rounded-3xl hidden md:block"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center text-emerald-600 mb-8 border border-slate-50">
                  <Lock size={32} className="md:w-10 md:h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Prices are Protected</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-4 mb-10 font-medium text-sm md:text-base leading-relaxed">
                  To view our wholesale rates and specific catalog details, please sign in to your verified account.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link 
                        to="/login" 
                        className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                    >
                        <LogIn size={20} /> LOGIN TO UNLOCK
                    </Link>
                    <Link 
                        to="/register" 
                        className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95"
                    >
                        REGISTER
                    </Link>
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            /* 2. EMPTY STATE */
            <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShoppingBag className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active listings currently.</p>
            </div>
          ) : (
            /* 3. PRODUCT GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}