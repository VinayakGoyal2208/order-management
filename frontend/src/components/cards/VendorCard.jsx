import { ArrowRight, MapPin, Tag } from "lucide-react";

export default function VendorCard({ vendor, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-[2rem] md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* 🖼️ Fixed Aspect Ratio Image Container */}
      <div className="relative aspect-[16/10] bg-gray-50 shrink-0 overflow-hidden border-b border-gray-50">
        <img
          src={vendor.image} 
          alt={vendor.companyName}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "";
            e.target.className = "w-full h-full object-cover opacity-20 grayscale";
          }}
        />
        
        {/* Floating Category Tag */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full text-emerald-600 uppercase tracking-widest shadow-sm border border-white/50 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
            <Tag size={10} />
            {vendor.category || "General"}
          </span>
        </div>
      </div>

      {/* 📝 Content Area */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-black text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {vendor.companyName}
        </h3>

        <div className="flex flex-col gap-1.5 mt-2 flex-1">
          <div className="flex items-start gap-1.5 min-h-[2.5rem]">
            <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-gray-500 text-xs md:text-sm line-clamp-2">
              {vendor.address}
            </p>
          </div>
          
          <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tight mt-auto">
            Contact: <span className="text-gray-500">{vendor.ownerName}</span>
          </p>
        </div>

        {/* 💳 Footer section */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] uppercase text-gray-400 font-black tracking-widest">
              Verified Partner
            </span>
            <span className="text-[8px] text-emerald-500 font-bold uppercase flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Official Vendor
            </span>
          </div>

          {/* This button now turns Emerald on hover of the whole card */}
          <div className="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white p-2.5 rounded-xl transition-all duration-300 group-hover:rotate-[-45deg] active:scale-90">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}