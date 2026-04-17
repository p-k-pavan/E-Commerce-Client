'use client'

import { useLogout } from '@/hooks/useAuth';
import { useGetCart } from '@/hooks/useCarat';
import useAuthStore from '@/store/authStore';
import { Search, ShoppingCart, User, LogOut, Package, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { CartDrawer } from '../shared/Cart';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const urlQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Mobile menu state
  const [openCart, setOpenCart] = useState(false);

  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  const { mutate: logoutMutation } = useLogout();
  const { data: cart } = useGetCart();
  
  const cartCount = cart?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutMutation();
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    if (pathname === '/s') setSearchTerm(urlQuery);
    else setSearchTerm("");
  }, [pathname, urlQuery]);

  useEffect(() => {
    if (pathname !== '/s' && !searchTerm) return;
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== urlQuery) {
        if (searchTerm) router.push(`/s?q=${encodeURIComponent(searchTerm)}`);
        else if (pathname === '/s') router.push('/');
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, urlQuery, pathname, router]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-360 mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-8">

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-[#16A34A] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">N</span>
              </div>
              <span className="font-bold text-lg md:text-xl text-[#111827] hidden sm:block">
                Namma Mart
              </span>
            </Link>

            <div className="flex-1 relative">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#111827] text-sm md:text-base"
              />
            </div>

            <div className="flex items-center gap-3 md:gap-6 shrink-0">
              
              <div className="relative cursor-pointer hover:scale-110 transition-transform p-1" onClick={() => setOpenCart(true)}>
                <ShoppingCart className="text-[#111827]" size={22} />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#16A34A] text-white text-[10px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <div className="relative group" ref={menuRef}>
                  <div 
                    className="cursor-pointer hover:scale-110 transition-transform p-1"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} // Toggle on click for mobile
                  >
                    <User className="text-[#111827]" size={22} />
                  </div>
                  
                  <div className={`
                    absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all z-50
                    ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                    md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0
                  `}>
                    <div className="p-2 border-b border-gray-50 md:hidden">
                       <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                    </div>

                    <Link 
                      href="/profile" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-gray-50 rounded-t-xl md:rounded-t-2xl transition-colors"
                    >
                      <UserCircle size={18} className="text-[#16A34A]" />
                      <span className="font-medium text-sm md:text-base">My Profile</span>
                    </Link>

                    <Link 
                      href="/orders" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[#111827] hover:bg-gray-50 transition-colors"
                    >
                      <Package size={18} className="text-[#16A34A]" />
                      <span className="font-medium text-sm md:text-base">My Orders</span>
                    </Link>

                    <div className="border-t border-gray-50 my-1"></div>

                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-xl md:rounded-b-2xl transition-colors" 
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span className="font-medium text-sm md:text-base">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/login')} 
                  className="px-4 md:px-5 py-2 md:py-2.5 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] font-bold text-sm md:text-base transition-colors"
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