import Layout from "../../components/common/Layout";
import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import { Trash2, Store, Mail, Phone, MapPin, Tag, Briefcase, Search, Filter } from "lucide-react";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/vendors");
      setVendors(res.data);
      setFilteredVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const categories = [...new Set(vendors.map((v) => v.category))].filter(Boolean);

  useEffect(() => {
    let result = vendors;
    if (selectedCategory !== "") {
      result = result.filter((v) => v.category === selectedCategory);
    }
    if (searchTerm !== "") {
      result = result.filter((v) => 
        v.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredVendors(result);
  }, [selectedCategory, searchTerm, vendors]);

  const deleteVendor = async (id) => {
    if (window.confirm("Are you sure? This will remove all associated products.")) {
      try {
        await API.delete(`/vendors/${id}`);
        setVendors((prev) => prev.filter((v) => v._id !== id));
      } catch (err) {
        alert("Failed to delete vendor.");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
              <Store className="text-emerald-600" size={28} /> Vendor Directory
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage verified partners and supply chains.</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none cursor-pointer outline-none shadow-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Industries</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Company</th>
                  <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Ownership</th>
                  <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Contact Details</th>
                  <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Location</th>
                  <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr className="animate-pulse">
                    <td colSpan="5" className="p-20 text-center text-slate-300 font-bold">LOADING DIRECTORY...</td>
                  </tr>
                ) : filteredVendors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                          <Store size={22} />
                        </div>
                        <div>
                          <div className="font-black text-slate-800 leading-tight">{v.companyName}</div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-1.5 py-0.5 rounded">
                            {v.category || "General"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Briefcase size={14} className="text-slate-400" /> {v.ownerName}
                      </div>
                    </td>
                    <td className="p-5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Mail size={12} /> {v.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Phone size={12} /> {v.phone}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <MapPin size={14} className="text-emerald-500" /> {v.address}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button onClick={() => deleteVendor(v._id)} className="p-2.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-50">
            {loading ? (
               <div className="p-10 text-center animate-pulse font-black text-slate-300">SYNCING VENDORS...</div>
            ) : filteredVendors.map((v) => (
              <div key={v._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Store size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">{v.companyName}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.category}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteVendor(v._id)} className="text-rose-400 p-2"><Trash2 size={22} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Owner</p>
                    <p className="text-xs font-bold text-slate-700">{v.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Location</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{v.address}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><Mail size={12}/> {v.email}</div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><Phone size={12}/> {v.phone}</div>
                </div>
              </div>
            ))}
          </div>
          
          {!loading && filteredVendors.length === 0 && (
            <div className="p-20 text-center font-black text-slate-300 uppercase tracking-[0.2em]">No partners found</div>
          )}
        </div>
      </div>
    </Layout>
  );
}