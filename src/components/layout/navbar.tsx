import { Search, ShoppingCart, User, MapPin, ChevronDown } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-360 mx-auto px-8 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl text-[#111827]">Namma Mart</span>
          </div>
          
          {/* Location Selector */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
            <MapPin className="text-[#16A34A]" size={20} />
            <span className="font-medium text-[#111827] text-sm">Bangalore</span>
            <ChevronDown className="text-[#6B7280]" size={18} />
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
            <input
              type="text"
              placeholder="Search for groceries..."
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-[#111827]"
            />
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <ShoppingCart className="text-[#111827]" size={24} />
              <div className="absolute -top-2 -right-2 bg-[#16A34A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </div>
            </div>
            
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <User className="text-[#111827]" size={24} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
