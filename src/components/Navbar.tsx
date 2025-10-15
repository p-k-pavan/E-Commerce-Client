"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useCallback, memo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
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
import { useRouter } from "next/navigation";
import DisplayCartItem from "./DisplayCartItem";
import CartMobileLink from "./CartMobileLink";

const AdminLinks = memo(({ user }: { user: any }) => {
  if (user?.role !== "ADMIN") return null;
  return (
    <>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/category" className="block p-2 hover:bg-gray-100 rounded transition-colors">Category</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/sub-category" className="block p-2 hover:bg-gray-100 rounded transition-colors">SubCategory</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/upload-product" className="block p-2 hover:bg-gray-100 rounded transition-colors">Upload Product</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild>
        <Link href="/dashboard/product" className="block p-2 hover:bg-gray-100 rounded transition-colors">Product</Link>
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
    <NavigationMenuLink asChild>
      <Link href="/dashboard/save-address" className="block p-2 hover:bg-gray-100 rounded transition-colors">Save Address</Link>
    </NavigationMenuLink>
  </>
));
UserLinks.displayName = "UserLinks";

const MobileMenu = memo(({ isOpen, onClose, user, onLogout, onCartClick }: any) => {
  if (!isOpen) return null;
  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 animate-in slide-in-from-top duration-300">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="pb-3">
          <Search />
        </div>

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
                <Link href="/dashboard/sub-category" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">SubCategory</Link>
                <Link href="/dashboard/upload-product" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Upload Product</Link>
                <Link href="/dashboard/product" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Product</Link>
              </div>
            )}
            <div className="space-y-2">
              <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Account</div>
              <Link href="/dashboard/my-orders" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">My Orders</Link>
              <Link href="/dashboard/save-address" onClick={onClose} className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">Save Address</Link>
              <button onClick={() => { onLogout(); onClose(); }} className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg font-medium">Logout</button>
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
  const router = useRouter();
  const { cart } = useAppSelector((state) => state.cart);
  const [totalQty, setTotalQty] = useState(0);
  const [total, setTotal] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  if (isMobileMenuOpen) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [isMobileMenuOpen]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!cart || cart.length === 0) return;
    let before = 0, after = 0;
    cart.forEach((item) => {
      const { price, discount } = item.productId;
      const quantity = item.quantity;
      const itemBefore = price * quantity;
      const itemDiscountAmount = (price * discount) / 100;
      const itemAfter = (price - itemDiscountAmount) * quantity;
      before += itemBefore;
      after += itemAfter;
    })
    setTotal(after)
    const qty = cart.reduce((preve, curr) => preve + curr.quantity, 0);
    setTotalQty(qty);
  }, [cart])

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

              <button onClick={toggleCart} className="hidden lg:flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white">
                <div className='animate-bounce'>
                  <BsCart4 size={26} />
                </div>
                <div className='font-semibold text-sm'>
                  {
                    cart[0] ? (
                      <div>
                        <p>{totalQty} Items</p>
                        <p>{total.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )
                  }
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition" aria-label="Toggle menu">
                {isMobileMenuOpen ? <AiOutlineClose className="w-7 h-7" /> : <FaUserCircle className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        onCartClick={toggleCart}
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
