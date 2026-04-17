'use client'

import { useLogout } from '@/hooks/useAuth';
import { useGetCart } from '@/hooks/useCarat';
import useAuthStore from '@/store/authStore';
import { Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CartDrawer } from '../shared/Cart';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const urlQuery = searchParams.get("q") || "";
  
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const { mutate: logoutMutation } = useLogout();
  const { data: cart } = useGetCart();
  
  const cartCount = cart?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    logoutMutation();
  };

  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    if (pathname === '/s') {
      setSearchTerm(urlQuery);
    } else {
      setSearchTerm("");
    }
  }, [pathname, urlQuery]);

  useEffect(() => {
    if (pathname !== '/s' && !searchTerm) return;

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== urlQuery) {
        if (searchTerm) {
          router.push(`/s?q=${encodeURIComponent(searchTerm)}`);
        } else if (pathname === '/s') {
          router.push('/');
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, urlQuery, pathname, router]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        {/* Adjusted padding for mobile (px-4) vs desktop (px-8) */}
        <div className="max-w-360 mx-auto px-4 md:px-8 py-3 md:py-4">
          {/* Reduced gap for mobile (gap-3) vs desktop (gap-8) */}
          <div className="flex items-center gap-3 md:gap-8">
            
            {/* Logo: Hidden text on very small screens to save space */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-[#16A34A] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">N</span>
              </div>
              <span className="font-bold text-lg md:text-xl text-[#111827] hidden sm:block">
                Namma Mart
              </span>
            </Link>

            {/* Search Bar: Responsive padding and font size */}
            <div className="flex-1 relative">
              <Search 
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" 
                size={18} 
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-[#111827] text-sm md:text-base"
              />
            </div>

            {/* Actions: Reduced gap for mobile */}
            <div className="flex items-center gap-3 md:gap-6 shrink-0">
              <div 
                className="relative cursor-pointer hover:scale-110 transition-transform p-1" 
                onClick={() => setOpenCart(true)}
              >
                <ShoppingCart className="text-[#111827]" size={22} md-size={24} />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#16A34A] text-white text-[10px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <div className="relative group">
                  {/* On mobile, this becomes a clickable link to profile since hover doesn't exist */}
                  <div 
                    className="cursor-pointer hover:scale-110 transition-transform p-1"
                    onClick={() => {
                        if (window.innerWidth < 768) router.push('/profile')
                    }}
                  >
                    <User className="text-[#111827]" size={22} md-size={24} />
                  </div>
                  
                  {/* Dropdown Menu: Hidden on mobile, shows on hover for desktop */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all hidden md:block">
                    <Link href="/profile" className="block px-4 py-3 text-[#111827] hover:bg-gray-50 rounded-t-xl font-medium">My Profile</Link>
                    <Link href="/orders" className="block px-4 py-3 text-[#111827] hover:bg-gray-50 font-medium">My Orders</Link>
                    <button 
                        className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-xl font-medium" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/login')} 
                  className="px-3 md:px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] font-medium text-sm md:text-base"
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