import { ArrowRight, MapPin, Tag } from "lucide-react";

export default function VendorCard({ vendor, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-[2rem] md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Responsive Image Container */}
      <div className="relative h-40 md:h-44 bg-gray-100 shrink-0">
        <img
          src={vendor.image} 
          alt={vendor.companyName}
          className="w-full h-full object-contain"
          onError={(e) => e.target.src = "/fallback-logo.png"} // Use a local logo from your public folder
        />
        {/* Floating Category Tag */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <span className="flex items-center gap-1 bg-white/90 backdrop-blur-md text-[9px] md:text-[10px] font-black px-2.5 py-1.5 rounded-full text-emerald-600 uppercase tracking-widest shadow-sm border border-white/50">
            <Tag size={10} />
            {vendor.category || "General"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-black text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {vendor.companyName}
        </h3>

        <div className="flex flex-col gap-1.5 mt-2 flex-1">
          <p className="text-gray-500 text-xs md:text-sm flex items-start gap-1.5 line-clamp-2 min-h-[2.5rem] md:min-h-0">
            <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
            {vendor.address}
          </p>
          <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tight">
            Contact: <span className="text-gray-500">{vendor.ownerName}</span>
          </p>
        </div>

        {/* Footer section */}
        <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] uppercase text-gray-400 font-black tracking-widest">
              Verified Partner
            </span>
            <span className="text-[8px] text-emerald-500 font-bold uppercase">Official Vendor</span>
          </div>

          <button className="bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white p-2 md:p-2.5 rounded-xl transition-all active:scale-90">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}