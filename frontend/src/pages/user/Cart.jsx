import Layout from "../../components/common/Layout";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth"; 
import { useState, useEffect } from "react";
import API from "../../services/api";
import { Trash2, ShoppingBag, CreditCard, ArrowRight, MapPin, User, Mail, Phone, Package, Hash, Truck, Lock, AlertCircle, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid Email";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "10 Digits Required";
    if (formData.address.length < 10) newErrors.address = "Address too short";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "6 Digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const placeOrder = async () => {
    if (!user) return;
    if (cart.length === 0) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        pincode: formData.pincode, 
        vendor: cart[0]?.vendor,
        items: cart.map(c => ({
          product: c._id,
          name: c.name,
          quantity: 1,
          price: c.price
        })),
        totalAmount: total,
        status: "pending"
      };

      await API.post("/orders", orderPayload);
      clearCart();
      // Redirect to a success page or orders page
      navigate("/orders", { state: { message: "Order placed successfully!" } });
    } catch (error) {
      console.error(error);
      alert("Order failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" /> Checkout
            </h1>
            <Link to="/" className="text-xs font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition-colors">
                <ChevronLeft size={14} /> Continue Shopping
            </Link>
        </div>

        {!user ? (
          <div className="text-center py-16 md:py-24 bg-slate-50 rounded-[2rem] md:rounded-[3rem] border border-slate-100 px-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Lock size={32} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Member Access Only</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Log in to your B2B account to manage your cart and finalize your purchase.</p>
            <Link to="/login" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
              SIGN IN TO CHECKOUT
            </Link>
          </div>
        ) : cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            <div className="lg:col-span-7 space-y-8">
              {/* Shipping Form Card */}
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Truck size={20} className="text-emerald-600" /> Delivery Details
                    </h2>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">Verified Account</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {/* Reuseable Input Wrapper */}
                  {[
                    { label: "Full Name", name: "name", icon: User, type: "text" },
                    { label: "Phone Number", name: "phone", icon: Phone, type: "text", max: "10" },
                    { label: "Email Address", name: "email", icon: Mail, type: "email", span: true },
                    { label: "Pincode", name: "pincode", icon: Hash, type: "text", max: "6" },
                  ].map((field) => (
                    <div key={field.name} className={`${field.span ? 'md:col-span-2' : ''} space-y-1.5`}>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex justify-between px-1">
                            {field.label} {errors[field.name] && <span className="text-red-500 lowercase italic tracking-normal">({errors[field.name]})</span>}
                        </label>
                        <div className="relative group">
                            <field.icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors[field.name] ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} size={16} />
                            <input 
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                maxLength={field.max}
                                className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors[field.name] ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-100 group-focus-within:ring-4 group-focus-within:ring-emerald-500/5 group-focus-within:bg-white'} rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm md:text-base`}
                            />
                        </div>
                    </div>
                  ))}

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex justify-between px-1">
                      Full Street Address {errors.address && <span className="text-red-500 lowercase italic tracking-normal">({errors.address})</span>}
                    </label>
                    <textarea 
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full p-4 bg-slate-50 border ${errors.address ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-100 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white'} rounded-2xl outline-none font-bold text-slate-700 transition-all text-sm`}
                      placeholder="House No, Building, Area, Landmark..."
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Package size={20} className="text-emerald-600" /> Your Order
                    </h2>
                    <span className="text-xs font-bold text-slate-400">{cart.length} Items</span>
                </div>
                {cart.map(c => (
                  <div key={c._id} className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm hover:border-emerald-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-100 shrink-0">
                         <Package size={24} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 truncate text-sm md:text-base">{c.name}</h3>
                        <p className="text-emerald-600 font-black text-sm md:text-base">₹{c.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(c._id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200 h-fit sticky top-28 overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                
                <h2 className="text-xl font-black text-white mb-8 relative z-10">Order Summary</h2>
                
                <div className="space-y-5 border-b border-slate-800 pb-8 mb-8 relative z-10">
                  <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span>Tax (GST)</span>
                    <span className="text-emerald-400">Included</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span>Logistics</span>
                    <span className="text-emerald-400">Calculated later</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-10 relative z-10">
                  <span className="font-bold text-slate-400 text-sm">TOTAL AMOUNT</span>
                  <span className="text-3xl md:text-4xl font-black text-white">₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 group relative z-10`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                       <CreditCard size={22} /> 
                       <span>CONFIRM & PLACE ORDER</span>
                       <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="mt-6 text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest relative z-10">
                    By placing an order, you agree to our <br /> wholesale terms & conditions
                </p>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-400 mb-6">Your inventory is empty</h2>
            <Link to="/" className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-black text-sm hover:bg-emerald-100 transition-all">
              Go to Marketplace <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}