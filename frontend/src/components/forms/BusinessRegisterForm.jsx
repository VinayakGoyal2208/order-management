import { useState, useEffect } from "react";
import { 
  Store, User, Mail, Phone, MapPin, Lock, 
  Upload, X, Building, Home, Link as LinkIcon, 
  AlertCircle, Globe, CheckCircle2
} from "lucide-react";
import API from "../../services/api";

const InputField = ({ label, name, icon: Icon, type = "text", placeholder, isTextArea = false, value, onChange, error }) => (
  <div className="flex flex-col w-full">
    <label className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase ml-1 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400"><Icon size={18} /></div>
      {isTextArea ? (
        <textarea 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          rows="3"
          className={`w-full bg-gray-50 border ${error ? 'border-red-300 ring-1 ring-red-50' : 'border-gray-100'} rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none transition-all resize-none`} 
        />
      ) : (
        <input 
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          className={`w-full bg-gray-50 border ${error ? 'border-red-300 ring-1 ring-red-50' : 'border-gray-100'} rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none transition-all`} 
        />
      )}
    </div>
    {error && <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase"><AlertCircle size={10} /> {error}</span>}
  </div>
);

export default function BusinessRegisterForm({ onCancel }) {
  const initialState = {
    companyName: "", ownerName: "", email: "", phone: "", category: "",
    image: "", imageFile: null, streetAddress: "", city: "", state: "", pincode: "", password: ""
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [imageMode, setImageMode] = useState("upload"); 
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [form, setForm] = useState(initialState);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => { if (preview && imageMode === "upload") URL.revokeObjectURL(preview); };
  }, [preview, imageMode]);

  const categories = ["All", "Logistics", "Food & Beverage", "Technology", "Retail", "Manufacturing","Others"];
  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Goa", "Gujarat", "Haryana", 
    "Karnataka", "Kerala", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", 
    "Telangana", "Uttar Pradesh", "West Bengal", "Delhi"
  ];

  const handleValidatedChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "pincode") {
      if (value !== "" && !/^\d+$/.test(value)) return;
      if (name === "phone" && value.length > 10) return;
      if (name === "pincode" && value.length > 6) return;
    }
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file, image: "" });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let err = {};
    if (!form.companyName.trim()) err.companyName = "Required";
    if (!form.ownerName.trim()) err.ownerName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email";
    if (form.phone.length !== 10) err.phone = "10 digits required";
    if (!form.category) err.category = "Select category";
    if (!form.streetAddress.trim()) err.streetAddress = "Required";
    if (!form.city.trim()) err.city = "Required";
    if (!form.state) err.state = "Required";
    if (form.pincode.length !== 6) err.pincode = "Invalid";
    if (form.password.length < 6) err.password = "Min 6 chars";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(form).forEach(key => {
        if (!['imageFile', 'image'].includes(key)) {
          formData.append(key, form[key]);
        }
      });

      // Append image based on mode
      if (imageMode === "upload" && form.imageFile) {
        formData.append("image", form.imageFile);
      } else {
        formData.append("image", form.image); 
      }

      const response = await API.post("/auth/register-vendor", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(response.data.msg);
      setForm(initialState);
      setPreview(null);
      if (onCancel) onCancel();
      
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto animate-in fade-in zoom-in duration-300">
      <form onSubmit={submit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Company Name" name="companyName" icon={Store} value={form.companyName} onChange={handleValidatedChange} error={errors.companyName} />
          <InputField label="Owner Name" name="ownerName" icon={User} value={form.ownerName} onChange={handleValidatedChange} error={errors.ownerName} />
          <InputField label="Email Address" name="email" type="email" icon={Mail} value={form.email} onChange={handleValidatedChange} error={errors.email} />
          <InputField label="Phone" name="phone" icon={Phone} value={form.phone} onChange={handleValidatedChange} error={errors.phone} />

          <div className="col-span-full space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Category</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                onChange={(e) => {
                  const val = e.target.value;
                  setIsCustomCategory(val === "Other");
                  setForm({...form, category: val === "Other" ? "" : val});
                }}
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
              </select>
              {isCustomCategory && (
                <input 
                  name="category" 
                  placeholder="Specify Category"
                  value={form.category} 
                  onChange={handleValidatedChange}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              )}
            </div>
            {errors.category && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.category}</span>}
          </div>

          <div className="col-span-full p-4 bg-slate-50 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Business Logo</span>
              <div className="flex gap-1">
                {["upload", "link"].map(mode => (
                  <button key={mode} type="button" onClick={() => setImageMode(mode)} className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${imageMode === mode ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-200'}`}>{mode}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {imageMode === "upload" ? (
                <label className="flex-1 w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-white transition-all">
                  <Upload size={20} className="text-gray-300 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="flex-1 w-full relative">
                  <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Paste image URL..." value={form.image} onChange={(e) => { setForm({...form, image: e.target.value, imageFile: null}); setPreview(e.target.value); }} className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none" />
                </div>
              )}
              {preview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => {setPreview(null); setForm({...form, image: "", imageFile: null})}} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X size={10} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full">
            <InputField label="Street Address" name="streetAddress" icon={MapPin} isTextArea value={form.streetAddress} onChange={handleValidatedChange} error={errors.streetAddress} />
          </div>

          <InputField label="City" name="city" icon={Building} value={form.city} onChange={handleValidatedChange} error={errors.city} />
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase ml-1 tracking-widest">State</label>
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-3 text-gray-400" />
              <select name="state" value={form.state} onChange={handleValidatedChange} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none appearance-none transition-all">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {errors.state && <span className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.state}</span>}
          </div>

          <InputField label="Pincode" name="pincode" icon={Home} value={form.pincode} onChange={handleValidatedChange} error={errors.pincode} />
          <InputField label="Password" name="password" type="password" icon={Lock} value={form.password} onChange={handleValidatedChange} error={errors.password} />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={18} />}
            {loading ? "Submitting..." : "Submit Application"}
          </div>
        </button>
      </form>
    </div>
  );
}