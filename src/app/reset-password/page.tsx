"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/reset-password`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.error) {
        toast.error(response.data.message || "Invalid OTP");
        return;
      }

      if (response.data.success) {
        toast.success("Password reset successfully!");
        localStorage.removeItem("email"); 
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "An error occurred"
      );
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
              <p className="text-gray-100 mt-2 text-sm">Reset Your Password</p>
            </div>
          </div>

          <div className="px-4 sm:px-8 py-6 sm:py-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  required
                  minLength={6}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.newPassword ||
                  !formData.confirmPassword ||
                  formData.newPassword.length < 6
                }
                className={`w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2 ${
                  loading ||
                  !formData.newPassword ||
                  !formData.confirmPassword ||
                  formData.newPassword.length < 6
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
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
