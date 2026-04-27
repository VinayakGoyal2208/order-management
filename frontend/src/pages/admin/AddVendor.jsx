import Layout from "../../components/common/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Store, User, Mail, Phone, MapPin, Lock, Tag, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";

const InputField = ({ label, name, icon: Icon, type = "text", placeholder, isTextArea = false, value, onChange, error }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1 tracking-wider">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400">
        <Icon size={18} />
      </div>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows="2"
          className={`w-full bg-gray-50 border ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'} rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-gray-50 border ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'} rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
        />
      )}
    </div>
    {error && (
      <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">
        <AlertCircle size={10} /> {error}
      </span>
    )}
  </div>
);

export default function AddVendor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    password: "",
    image: "" // ✅ New state field
  });

  const categories = ["Logistics", "Food & Beverage", "Technology", "Retail", "Manufacturing"];

  const validateForm = () => {
    let newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!form.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email address";

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Invalid 10-digit number";

    if (!form.category) newErrors.category = "Category is required";
    if (form.address.length < 10) newErrors.address = "Address too short";
    if (form.password.length < 6) newErrors.password = "Min 6 characters";
    
    // ✅ Optional: Basic URL validation if they provided one
    if (form.image && !form.image.startsWith("http")) {
      newErrors.image = "Must be a valid URL (starting with http)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await API.post("/vendors", form);
      navigate("/admin-vendors");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-800">Onboard New Partner</h1>
          <p className="text-gray-500">Register a new B2B vendor to the marketplace.</p>
        </div>

        <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <InputField label="Company Name" name="companyName" icon={Store} placeholder="e.g. Goyal Industries" value={form.companyName} onChange={handleChange} error={errors.companyName} />
            <InputField label="Owner Name" name="ownerName" icon={User} placeholder="Full name" value={form.ownerName} onChange={handleChange} error={errors.ownerName} />
            <InputField label="Email" name="email" type="email" icon={Mail} placeholder="vendor@example.com" value={form.email} onChange={handleChange} error={errors.email} />
            <InputField label="Phone" name="phone" icon={Phone} placeholder="10-digit number" value={form.phone} onChange={handleChange} error={errors.phone} />

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1 tracking-wider">Business Category</label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    value={categories.includes(form.category) ? form.category : ""}
                  >
                    <option value="">Select Predefined</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="Other">Other (Custom Type)</option>
                  </select>
                </div>
                <input 
                  name="category"
                  placeholder="Or type custom category..."
                  value={form.category}
                  className={`flex-1 bg-gray-50 border ${errors.category ? 'border-red-300' : 'border-gray-100'} p-2.5 rounded-xl outline-none transition-all`}
                  onChange={handleChange}
                />
              </div>
              {errors.category && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.category}</span>}
            </div>

            {/* ✅ Vendor Image Link Field */}
            <div className="col-span-2">
              <InputField 
                label="Vendor Image/Logo URL" 
                name="image" 
                icon={ImageIcon} 
                placeholder="https://example.com/logo.png" 
                value={form.image} 
                onChange={handleChange} 
                error={errors.image} 
              />
              {form.image && !errors.image && (
                <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-100"
                    onError={(e) => e.target.style.display = 'none'} // Hide if link is broken
                  />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Logo Preview</span>
                </div>
              )}
            </div>

            <div className="col-span-2">
              <InputField label="Address" name="address" icon={MapPin} isTextArea value={form.address} onChange={handleChange} error={errors.address} />
            </div>

            <div className="col-span-2">
              <InputField label="Password" name="password" type="password" icon={Lock} value={form.password} onChange={handleChange} error={errors.password} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-10 py-4 rounded-2xl font-black text-white flex justify-center items-center gap-3 transition-all ${loading ? "bg-gray-300" : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"}`}
          >
            {loading ? "Processing..." : <><CheckCircle2 size={20} /> COMPLETE REGISTRATION</>}
          </button>
        </form>
      </div>
    </Layout>
  );
}