"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const router = useRouter();

    interface ChangeEventType extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> { }

    const handleChange = (e: ChangeEventType) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        })
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/register`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (response.data.user.error == true) {
                toast("Error", {
                    description: response?.data?.message || "An error occurred",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                })
            }
            if (response.data.user.success == true) {
                toast("User Register Successfully", {
                    description: response?.data?.message,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                })
                localStorage.setItem('NammaMart',response.data.user.token)
                router.push("/")
            }
        } catch (error: any) {
            toast("Error", {
                description: error?.response?.data?.message || error?.message || "An error occurred",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
        };
    }

    console.log(process.env.NEXT_PUBLIC_BASE_URL)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl lg:text-4xl font-bold text-center py-5 sm:py-6 shadow-md">
                        Namma Mart
                        <div className="text-center">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Create Account</h2>
                            <p className="text-gray-100 mt-2 text-sm">Join Namma Mart today</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className=" px-4 sm:px-8 py-6 sm:py-8">


                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    id="name"
                                    placeholder="Pavan Kumar R"
                                    value={data.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    id="email"
                                    placeholder="pavan@gmail.com"
                                    value={data.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            {/* Terms and Conditions */}
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2"
                            >
                                Create Account
                            </button>
                        </form>

                        {/* Login Link */}
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