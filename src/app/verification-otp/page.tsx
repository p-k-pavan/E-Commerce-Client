"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [formData, setFormData] = useState({ otp: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  // ✅ Load stored email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  // ✅ Handle OTP input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    setFormData({ ...formData, otp: value });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // OTP must be 6 digits
    if (formData.otp.length !== 6) {
      toast("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/verify-otp`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.error) {
        toast(response.data.message || "Invalid OTP");
        return;
      }

      if (response.data.success) {
        toast("OTP verified successfully!");
        router.push("/reset-password");
      }
    } catch (err: unknown) {
       const axiosError = err as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || 'An error occurred.';
      toast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl lg:text-4xl font-bold text-center py-5 sm:py-6 shadow-md">
            Namma Mart
            <div className="text-center">
              <p className="text-gray-100 mt-2 text-sm">Verifying OTP</p>
              {email && (
                <p className="text-gray-200 text-xs mt-1">
                  OTP sent to: <span className="font-semibold">{email}</span>
                </p>
              )}
            </div>
          </div>

          <div className="px-4 sm:px-8 py-6 sm:py-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter your OTP"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 text-center tracking-widest placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading || formData.otp.length !== 6}
                className={`w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2 ${
                  loading || formData.otp.length !== 6 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
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
