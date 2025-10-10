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
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/login`, 
                formData, 
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (response.data.user.error) {
                toast(response?.data?.message || "An error occurred");
                dispatch(clearLoading());
                return;
            }

            if (response.data.user.success) {
                const userData = {
                    _id: response.data.user._id || "",
                    name: response.data.user.name ,
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

                toast("Login Successfully");

                router.push("/");
            }
        } catch (error: any) {
            toast(error?.response?.data?.message || error?.message || "An error occurred");
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
                            <p className="text-gray-100 mt-2 text-sm">Login to Namma Mart</p>
                        </div>
                    </div>

                    <div className="px-4 sm:px-8 py-6 sm:py-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>

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

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Sign In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-600 text-sm">
                                Create a account?{" "}
                                <Link href={"/register"} className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200">
                                    Sign UP
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}