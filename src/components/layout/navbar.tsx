'use client'

import { useLogout } from '@/hooks/useAuth';
import { useGetCart } from '@/hooks/useCarat';
import useAuthStore from '@/store/authStore';
import { Search, ShoppingCart, User, MapPin, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CartDrawer } from '../shared/Cart';

export function Navbar() {
  const navigate = useRouter();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const { mutate: logoutMutation } = useLogout();
  const { data: cart } = useGetCart();
console.log(cart);
  const cartCount =
    cart?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    logoutMutation();
  };

  const [openCart, setOpenCart] = useState(false);

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-360 mx-auto px-8 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl text-[#111827]">Namma Mart</span>
          </Link>

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
          <div className="flex items-center gap-6" onClick={() => setOpenCart(true)}>
            
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <ShoppingCart className="text-[#111827]" size={24} />
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#16A34A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative group">
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <User className="text-[#111827]" size={24} />
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-[#111827] hover:bg-gray-50 rounded-t-xl transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-3 text-[#111827] hover:bg-gray-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-xl transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate.push('/login')}
                className="px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
    <CartDrawer isOpen={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}