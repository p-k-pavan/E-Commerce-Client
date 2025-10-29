"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => {
    // Simple email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    setIsValidEmail(validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail) {
      toast("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/forgot-password`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.error) {
        toast(response.data.message || "An error occurred");
        return;
      }

      if (response.data.success) {
        toast("OTP sent successfully!");
        localStorage.setItem("email", formData.email);
        router.push("/verification-otp");
      }
    } catch (error: any) {
      toast(error?.response?.data?.message || error?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !isValidEmail || !formData.email.trim() || loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl lg:text-4xl font-bold text-center py-5 sm:py-6 shadow-md">
            Namma Mart
            <div className="text-center">
              <p className="text-gray-100 mt-2 text-sm">Forgot Password</p>
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
                {!isValidEmail && formData.email && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className={`w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2 ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  href={"/login"}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                >
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
