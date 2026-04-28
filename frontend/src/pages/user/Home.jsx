import { useEffect, useState } from "react";
import API from "../../services/api";
import VendorCard from "../../components/cards/VendorCard";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowRight, XCircle } from "lucide-react";

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/vendors/all-vendors")
      .then((res) => setVendors(res.data))
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setVendors([]);
      });
  }, []);

  const filteredVendors = vendors.filter((v) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v?.companyName?.toLowerCase().includes(term) ||
      v?.category?.toLowerCase().includes(term) ||
      v?.city?.toLowerCase().includes(term) ||
      v?.state?.toLowerCase().includes(term)
    );
  });

  const categories = ["All", "Logistics", "Food & Beverage", "Technology", "Retail", "Manufacturing", "Others"];

  return (
    <Layout>
      {/* ================= HERO SECTION ================= */}
      <section className="relative mb-12 overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-12 md:px-12 md:py-20 shadow-2xl">
        <div className="relative z-10 mx-auto max-w-3xl text-center lg:text-left">
          <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Global Supply <br className="hidden md:block" />
            <span className="text-green-500">Simplified.</span>
          </h1>
          <p className="mb-10 text-lg text-slate-400 md:text-xl">
            Connect with verified manufacturers and logistics partners in one unified marketplace.
          </p>

          {/* 🔍 SEARCH BAR - Modern Glass Effect */}
          <div className="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-3xl bg-white/10 p-2 backdrop-blur-md sm:flex-row lg:mx-0">
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <Search className="text-green-400" size={22} />
              <input
                type="text"
                placeholder="Search company, city or category..."
                className="w-full bg-transparent text-white placeholder-slate-400 outline-none focus:ring-0"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearchTerm(searchInput)}
              />
              {searchInput && (
                <XCircle 
                  className="cursor-pointer text-slate-500 hover:text-white" 
                  size={18} 
                  onClick={() => {setSearchInput(""); setSearchTerm("");}}
                />
              )}
            </div>
            <button
              onClick={() => setSearchTerm(searchInput)}
              className="rounded-2xl bg-green-500 px-8 py-3 font-bold text-slate-900 transition-all hover:bg-green-400 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-green-500/20 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ================= CATEGORIES ================= */}
        {/* On Mobile: Horizontal Scroll | On Desktop: Sidebar */}
        <aside className="lg:w-72">
          <div className="sticky top-24">
            <h3 className="mb-4 hidden items-center gap-2 text-lg font-bold text-slate-800 lg:flex">
              <Filter size={20} className="text-green-600" />
              Industries
            </h3>
            
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
              {categories.map((cat) => {
                const isActive = searchTerm === cat || (cat === "All" && searchTerm === "");
                return (
                  <button
                    key={cat}
                    onClick={() => setSearchTerm(cat === "All" ? "" : cat)}
                    className={`flex shrink-0 items-center justify-between whitespace-nowrap rounded-2xl px-5 py-3 transition-all lg:w-full ${
                      isActive
                        ? "bg-green-600 text-white shadow-lg shadow-green-200"
                        : "bg-white text-slate-600 border border-slate-100 hover:border-green-300 hover:text-green-600 shadow-sm"
                    }`}
                  >
                    <span className="text-sm font-medium md:text-base">{cat}</span>
                    <ArrowRight size={16} className={`hidden lg:block transition-transform ${isActive ? "translate-x-1" : "opacity-0"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= MAIN GRID ================= */}
        <main className="flex-1">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Featured Suppliers</h2>
              <p className="text-slate-500">
                Discover {filteredVendors.length} verified businesses matching your needs.
              </p>
            </div>
            {searchTerm && (
               <button 
                onClick={() => {setSearchTerm(""); setSearchInput("");}}
                className="flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
              >
                Clear Filter: <span className="text-green-700">{searchTerm}</span>
              </button>
            )}
          </div>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredVendors.map((v) => (
                <div key={v._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <VendorCard
                    vendor={{
                      ...v,
                      image: v.logo?.startsWith("http") ? v.logo : `http://localhost:5000/${v.logo}` || "https://via.placeholder.com/400x300",
                      address: `${v.city}, ${v.state}`,
                    }}
                    onClick={() => navigate(`/vendor/${v._id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-24 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                <Search size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No vendors found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your search terms or category filters.</p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}