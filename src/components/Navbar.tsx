"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useCallback, memo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
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
import DisplayCartItem from "./DisplayCartItem";
import CartMobileLink from "./CartMobileLink";
import axios from "axios";
import { toast } from "sonner";
import { AppDispatch } from "@/store";

export const handleLogoutApi = async (dispatch: AppDispatch) => {
  try {
    await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/logout`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    dispatch(logout());
    toast.success("Logged out successfully!");
  }
};

const AdminLinks = memo(({ user }: { user: any }) => {
  if (user?.role !== "ADMIN") return null;
  return (
    <>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/category" className="block p-2 hover:bg-gray-100 rounded transition-colors">Category</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/upload-product" className="block p-2 hover:bg-gray-100 rounded transition-colors">Upload Product</Link>
      </NavigationMenuLink>
    </>
  );
});
AdminLinks.displayName = "AdminLinks";

const UserLinks = memo(() => (
  <>
    <NavigationMenuLink asChild>
      <Link href="/dashboard/my-orders" className="block p-2 hover:bg-gray-100 rounded transition-colors">My Orders</Link>
    </NavigationMenuLink>
  </>
));
UserLinks.displayName = "UserLinks";

const MobileMenu = memo(({ isOpen, onClose, user, onLogout, onCartClick }: any) => {
  if (!isOpen) return null;
  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 animate-in slide-in-from-top duration-300">
      <div className="container mx-auto px-4 py-4 space-y-4">
        {!user && (
          <div className="space-y-3">
            <Link href="/login" onClick={onClose} className="block w-full py-2 px-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Login
            </Link>
          </div>
        )}

        {user && (
          <>
            {user?.role === "ADMIN" && (
              <div className="space-y-2">
                <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Admin</div>
                <Link href="/dashboard/category" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Category</Link>
                <Link href="/dashboard/upload-product" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Upload Product</Link>
              </div>
            )}

            <div className="space-y-2">
              <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Account</div>
              <Link href="/dashboard/my-orders" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">My Orders</Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";


export default function Navigation() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  const [totalQty, setTotalQty] = useState(0);
  const [total, setTotal] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Handle Scroll Shadow Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (isMobileMenuOpen) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isMobileMenuOpen]);

  const handleLogout = useCallback(() => {
    handleLogoutApi(dispatch);
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  useEffect(() => {
    if (!cart || cart.length === 0) return;
    let totalAmount = 0;
    cart.forEach((item) => {
      const { price, discount } = item.productId;
      const quantity = item.quantity;
      const discountedPrice = price - (price * (discount || 0)) / 100;
      totalAmount += discountedPrice * quantity;
    });
    setTotal(totalAmount);
    setTotalQty(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [cart]);

  return (
    <>
      <header
        className={`bg-gradient-to-r from-green-500 to-emerald-700 w-full sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-xl" : "shadow-lg"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col p-2 container mx-auto">
            <div className="flex items-center justify-between h-16">
              
              <Link
                href="/"
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-100 to-yellow-300 bg-clip-text text-transparent hover:from-yellow-300 hover:to-amber-100 transition-all duration-300"
              >
                NammaMart
              </Link>

              <div className="hidden md:block flex-1 max-w-md mx-auto">
                <Search />
              </div>

              <div className="flex items-center space-x-4">
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
                                <Link href={"/profile"}>
                                  <div className="text-sm text-gray-600 mt-1 truncate">{user?.name}</div>
                                </Link>
                              </div>
                              <AdminLinks user={user} />
                              <UserLinks />
                              <button
                                onClick={handleLogout}
                                className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded font-medium"
                              >
                                Logout
                              </button>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  ) : (
                    <Link
                      href="/login"
                      className="text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition"
                    >
                      Login
                    </Link>
                  )}
                </div>

                <button
                  onClick={toggleCart}
                  className="hidden lg:flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
                >
                  <div className="animate-bounce">
                    <BsCart4 size={26} />
                  </div>
                  <div className="font-semibold text-sm">
                    {cart[0] ? (
                      <div>
                        <p>{totalQty} Items</p>
                        <p>₹{total.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )}
                  </div>
                </button>

                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <AiOutlineClose className="w-7 h-7" /> : <FaUserCircle className="w-7 h-7" />}
                </button>
              </div>
            </div>

            <div className="block md:hidden w-full flex justify-center px-4">
              <div className="w-full max-w-md">
                <Search />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      <CartMobileLink onCartClick={toggleCart} />
      {isCartOpen && <DisplayCartItem close={() => setIsCartOpen(false)} />}

      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
}
