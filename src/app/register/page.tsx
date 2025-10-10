"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, setLoading, clearLoading } from "@/store/slices/authSlice";

export default function Page() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, 
                formData, 
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (response.data.user.error) {
                toast("Error", {
                    description: response?.data?.message || "An error occurred",
                });
                dispatch(clearLoading());
                return;
            }

            if (response.data.user.success) {
                const userData = {
                    _id: response.data.user._id || "",
                    name: response.data.user.name || formData.name,
                    email: response.data.user.email || formData.email,
                    avatar: response.data.user.avatar || "",
                    mobile: response.data.user.mobile || "",
                    verify_email: response.data.user.verify_email || false,
                    last_login_date: response.data.user.last_login_date || new Date().toISOString(),
                    status: response.data.user.status || "active",
                    address_details: response.data.user.address_details || [],
                    shopping_cart: response.data.user.shopping_cart || [],
                    orderHistory: response.data.user.orderHistory || [],
                    role: response.data.user.role || "customer"
                };

                dispatch(setCredentials({
                    user: userData,
                    token: response.data.user.token
                }));

                toast("User Registered Successfully", {
                    description: response?.data?.message,
                });

                router.push("/");
            }
        } catch (error: any) {
            toast("Error", {
                description: error?.response?.data?.message || error?.message || "An error occurred",
            });
            dispatch(clearLoading());
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl lg:text-4xl font-bold text-center py-5 sm:py-6 shadow-md">
                        Namma Mart
                        <div className="text-center">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Create Account</h2>
                            <p className="text-gray-100 mt-2 text-sm">Join Namma Mart today</p>
                        </div>
                    </div>

                    <div className="px-4 sm:px-8 py-6 sm:py-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    id="name"
                                    placeholder="Pavan Kumar R"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    id="email"
                                    placeholder="pavan@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Terms & Conditions</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link href={"/login"} className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}