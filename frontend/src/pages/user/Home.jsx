import { useEffect, useState } from "react";
import API from "../../services/api";
import VendorCard from "../../components/cards/VendorCard";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowRight } from "lucide-react";

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [searchInput, setSearchInput] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");   

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/vendors")
      .then(res => setVendors(res.data))
      .catch(() => setVendors([]));
  }, []);

  // 🔍 FILTER LOGIC (SAFE + MULTI FIELD)
  const filteredVendors = vendors.filter(v => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      v?.business?.companyName?.toLowerCase().includes(term) ||
      v?.category?.toLowerCase().includes(term) ||
      v?.business?.address?.toLowerCase().includes(term)
    );
  });

  return (
    <Layout>

      {/* ================= HERO ================= */}
      <div className="relative bg-slate-900 rounded-3xl p-10 mb-10 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Source Quality Products from{" "}
            <span className="text-green-500">Verified Vendors</span>
          </h1>

          <p className="text-slate-300 text-lg mb-8">
            The largest B2B network for wholesale supply chains.
          </p>

          {/* 🔍 SEARCH BAR */}
          <div className="flex bg-white p-2 rounded-2xl shadow-xl max-w-md">
            <Search className="text-gray-400 m-2" />

            <input
              type="text"
              placeholder="Search vendors, category, location..."
              className="flex-1 outline-none text-gray-700"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchTerm(searchInput);
              }}
            />

            <button
              onClick={() => setSearchTerm(searchInput)}
              className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex gap-8">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 hidden lg:block">
          <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Filter size={18} /> Categories
            </h3>

            {["All", "Electronics", "Manufacturing", "Food", "Textiles"].map(cat => (
              <div
                key={cat}
                onClick={() => setSearchTerm(cat === "All" ? "" : cat)}
                className="flex justify-between items-center cursor-pointer text-gray-500 hover:text-green-600 mb-3 group"
              >
                {cat}
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <div className="flex-1">

          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Featured Suppliers
              </h2>
              <p className="text-gray-500 text-sm">
                Showing {filteredVendors.length} results
              </p>
            </div>
          </div>

          {/* ================= GRID ================= */}
          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {filteredVendors.map(v => (
      <VendorCard
        key={v._id}
        vendor={{
          ...v, // 1. This keeps ALL your existing data (name, address, etc.)
          image: v.image || null, // 2. This ensures the image is picked up from the DB
        }}
        onClick={() => navigate(`/vendor/${v._id}`)}
      />
    ))}
  </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No vendors found for "<span className="font-semibold">{searchTerm}</span>"
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}