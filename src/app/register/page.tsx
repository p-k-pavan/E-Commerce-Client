'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, User, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';

export default function Register() {
    const navigate = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const { mutate, isPending } = useRegister();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex">

            <div className="hidden lg:flex lg:w-1/2 bg-[#16A34A] relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1771503937636-c0e37bd23517?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmclMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzc1NzA2NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Fresh groceries"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
                    <ShoppingBag className="w-20 h-20 mb-6" />
                    <h1 className="text-5xl font-bold mb-4">Join Namma Mart</h1>
                    <p className="text-xl text-center max-w-md">
                        Start your journey to fresh, quality groceries delivered fast
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <ShoppingBag className="w-12 h-12 text-[#16A34A] mr-3" />
                        <span className="text-3xl font-bold text-[#111827]">Namma Mart</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#111827] mb-2">Create Account</h2>
                            <p className="text-[#6B7280]">Sign up to start shopping</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-[#6B7280]" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-[#6B7280]" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#111827] mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-[#6B7280]" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your phone number"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-[#6B7280]" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Create a password"
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111827] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-[#6B7280]" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm your password"
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 mt-1 text-[#16A34A] border-gray-300 rounded focus:ring-[#16A34A]"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-[#6B7280]">
                                    I agree to the{' '}
                                    <button type="button" className="text-[#16A34A] hover:underline">
                                        Terms & Conditions
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="text-[#16A34A] hover:underline">
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-medium text-lg hover:bg-[#15803D] transition-colors shadow-md"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-[#6B7280]">or sign up with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-[#111827]">Google</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm font-medium text-[#111827]">Facebook</span>
                            </button>
                        </div>

                        <p className="mt-6 text-center text-[#6B7280]">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#16A34A] font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
