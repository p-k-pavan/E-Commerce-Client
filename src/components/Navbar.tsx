"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useCallback, memo } from "react";
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { FiShoppingCart } from "react-icons/fi";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Link from "next/link";
import Search from "./search";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

// ----------------------------- Admin Links -----------------------------
const AdminLinks = memo(({ user }: { user: any }) => {
  if (user?.role !== "ADMIN") return null;

  return (
    <>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/category" className="block p-2 hover:bg-gray-100 rounded transition-colors">
          <div className="font-medium">Category</div>
        </Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/sub-category" className="block p-2 hover:bg-gray-100 rounded transition-colors">
          <div className="font-medium">SubCategory</div>
        </Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/upload-product" className="block p-2 hover:bg-gray-100 rounded transition-colors">
          <div className="font-medium">Upload Product</div>
        </Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/product" className="block p-2 hover:bg-gray-100 rounded transition-colors">
          <div className="font-medium">Product</div>
        </Link>
      </NavigationMenuLink>
    </>
  );
});
AdminLinks.displayName = "AdminLinks";

// ----------------------------- User Links -----------------------------
const UserLinks = memo(() => (
  <>
    <NavigationMenuLink asChild>
      <Link href="/dashboard/my-orders" className="block p-2 hover:bg-gray-100 rounded transition-colors">
        <div className="font-medium">My Orders</div>
      </Link>
    </NavigationMenuLink>
    <NavigationMenuLink asChild>
      <Link href="/dashboard/save-address" className="block p-2 hover:bg-gray-100 rounded transition-colors">
        <div className="font-medium">Save Address</div>
      </Link>
    </NavigationMenuLink>
  </>
));
UserLinks.displayName = "UserLinks";

// ----------------------------- Mobile Menu -----------------------------
const MobileMenu = memo(({ isOpen, onClose, user, onLogout }: any) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 animate-in slide-in-from-top duration-300 mobile-menu-content">
      <div className="container mx-auto px-4 py-4 space-y-4">

        {/* Search (visible on mobile) */}
        <div className="pb-3">
          <Search />
        </div>

        {/* Not Logged In */}
        {!user && (
          <div className="space-y-3">
            <Link href="/login" onClick={onClose} className="block w-full py-2 px-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Login
            </Link>
            <Link href="/cart" onClick={onClose} className="flex justify-center items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <FiShoppingCart className="mr-2 text-lg" /> Cart
            </Link>
          </div>
        )}

        {/* Logged In */}
        {user && (
          <>
            {user?.role === "ADMIN" && (
              <div className="space-y-2">
                <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Admin</div>
                <Link href="/dashboard/category" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Category</Link>
                <Link href="/dashboard/sub-category" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">SubCategory</Link>
                <Link href="/dashboard/upload-product" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Upload Product</Link>
                <Link href="/dashboard/product" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Product</Link>
              </div>
            )}

            <div className="space-y-2">
              <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Account</div>
              <Link href="/dashboard/my-orders" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">My Orders</Link>
              <Link href="/dashboard/save-address" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Save Address</Link>
              <Link href="/cart" onClick={onClose} className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FiShoppingCart className="mr-2 text-lg" /> Cart
              </Link>
              <button onClick={() => { onLogout(); onClose(); }} className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg font-medium">Logout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

// ----------------------------- Main Navigation -----------------------------
export default function Navigation() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className={`bg-gradient-to-r from-green-500 to-emerald-700 shadow-lg w-full sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "shadow-xl" : "shadow-lg"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-100 to-yellow-300 bg-clip-text text-transparent font-sans tracking-tight hover:from-yellow-300 hover:to-amber-100 transition-all duration-300">
              NammaMart
            </Link>

            {/* Search (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <Search />
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center space-x-4">
              {/* Cart (Desktop only) */}
              <Link href="/cart" className="hidden lg:flex items-center text-white hover:text-yellow-300 transition-colors duration-200">
                <FiShoppingCart className="text-2xl" />
              </Link>

              {/* Account / Login */}
              <div className="hidden lg:flex items-center">
                {user ? (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-gray-50 text-black hover:bg-white/20 border-none cursor-pointer">
                          Account
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="min-w-[280px] p-4">
                          <div className="space-y-3 w-full">
                            <div className="pb-2 border-b border-gray-100">
                              <div className="font-semibold text-gray-900">My Account</div>
                              <div className="text-sm text-gray-600 mt-1 truncate">{user?.name}</div>
                            </div>
                            <AdminLinks user={user} />
                            <UserLinks />
                            <button onClick={handleLogout} className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded font-medium">
                              Logout
                            </button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <Link href="/login" className="text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition">
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition" aria-label="Toggle menu">
                {isMobileMenuOpen ? <AiOutlineClose className="w-7 h-7" /> : <FaUserCircle className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} onLogout={handleLogout} />

      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
}
