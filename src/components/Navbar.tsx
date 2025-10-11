"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState, useCallback, memo } from "react";
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

// Memoized components for better performance
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

const MobileMenu = memo(({
    isOpen,
    onClose,
    user,
    onLogout
}: {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onLogout: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 animate-in slide-in-from-top duration-300 mobile-menu-content">
            <div className="container mx-auto px-4 py-4 space-y-4">
                {/* User Info */}
                <div className="border-b border-gray-100 pb-3">
                    <div className="font-semibold text-gray-900">My Account</div>
                    <div className="text-sm text-gray-600 mt-1">{user?.name || "Guest"}</div>
                </div>

                <div className="md:hidden pb-3">
                    <Search />
                </div>

                {/* Admin Links */}
                {user?.role === "ADMIN" && (
                    <div className="space-y-2">
                        <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Admin</div>
                        <Link
                            href="/dashboard/category"
                            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Category
                        </Link>
                        <Link
                            href="/dashboard/sub-category"
                            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            SubCategory
                        </Link>
                        <Link
                            href="/dashboard/upload-product"
                            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Upload Product
                        </Link>
                        <Link
                            href="/dashboard/product"
                            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Product
                        </Link>
                    </div>
                )}

                {/* User Links */}
                <div className="space-y-2">
                    <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Account</div>
                    <Link
                        href="/dashboard/my-orders"
                        className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        My Orders
                    </Link>
                    <Link
                        href="/dashboard/save-address"
                        className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        Save Address
                    </Link>
                </div>

                {/* Logout */}
                <button
                    onClick={() => {
                        onLogout();
                        onClose();
                    }}
                    className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
});

MobileMenu.displayName = "MobileMenu";

export default function Navigation() {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Throttled scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", throttledScroll, { passive: true });
        return () => window.removeEventListener("scroll", throttledScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [router]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMobileMenuOpen && !target.closest(".mobile-menu-trigger") && !target.closest(".mobile-menu-content")) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        setIsMobileMenuOpen(false);
    }, [dispatch]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    return (
        <>
            <header className={`bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg w-full sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "shadow-xl" : "shadow-lg"
                }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-around h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-white hover:text-gray-100 transition-colors duration-200"
                            >
                                NammaMart
                            </Link>
                        </div>

                        {/* Search Bar - Hidden on mobile, visible on tablet and up */}
                        <div className="hidden md:block flex-1 max-w-2xl mx-8">
                            <Search />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-gray-50 text-black hover:bg-white/20  data-[state=open]:bg-white/20 border-none focus:bg-white/20 cursor-pointer">
                                            Account
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="min-w-[280px] p-4 max-w-[90vw] sm:max-w-[400px]">
                                            <div className="space-y-3 w-full overflow-hidden">
                                                {/* User Info */}
                                                <div className="pb-2 border-b border-gray-100">
                                                    <div className="font-semibold text-gray-900">My Account</div>
                                                    <div className="text-sm text-gray-600 mt-1 truncate">{user?.name || "Guest"}</div>
                                                </div>

                                                {/* Admin Links */}
                                                <AdminLinks user={user} />

                                                {/* User Links */}
                                                <UserLinks />

                                                

                                                {/* Logout */}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded transition-colors font-medium"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-3">
                            <button
                                onClick={toggleMobileMenu}
                                className="mobile-menu-trigger p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
                                aria-label="Toggle menu"
                            >
                                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                                    <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                                        }`}></span>
                                    <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"
                                        }`}></span>
                                    <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                                        }`}></span>
                                </div>
                            </button>
                        </div>
                    </div>



                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
                user={user}
                onLogout={handleLogout}
            />


            <style jsx global>{`
        body {
          overflow-x: hidden;
        }
        
        /
        [data-radix-navigation-menu-content] {
          max-width: 100vw !important;
        }
        
        .navigation-menu-content {
          max-width: calc(100vw - 2rem) !important;
        }
      `}</style>
        </>
    );
}