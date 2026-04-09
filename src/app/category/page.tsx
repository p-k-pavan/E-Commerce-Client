"use client";

import { useCategoryWithSubCategories } from "@/hooks/useCategory";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { data: categorys, isLoading } = useCategoryWithSubCategories();
    const navigate = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Shop by Category</h1>
                    <p className="text-gray-500">Fresh groceries delivered to your doorstep</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categorys?.map((category: any) => (
                        <div
                            key={category._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >

                            <div className="p-5 border-b border-gray-50 bg-linear-to-r from-white to-gray-50 cursor-pointer" onClick={() => navigate.push(`/category/${category.slug}`)}>
                                <h2 className="text-lg font-bold text-gray-800 flex items-center justify-between">
                                    {category.name}
                                    <ChevronRight size={18} className="text-gray-400" />
                                </h2>
                            </div>

                            <div className="p-5 grow">
                                <ul className="space-y-2">
                                    {category.subCategories.slice(0, 6).map((sub: any) => (
                                        <li key={sub.slug}>
                                            <Link
                                                href={`/category/${category.slug}/${sub.slug}`}
                                                className="text-sm text-gray-600 hover:text-green-600 hover:translate-x-1 transition-all inline-block"
                                            >
                                                {sub.name}
                                            </Link>
                                        </li>
                                    ))}

                                    {category.subCategories.length > 6 && (
                                        <li className="pt-2">
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="text-xs font-bold text-green-600 uppercase tracking-wider hover:underline"
                                            >
                                                + {category.subCategories.length - 6} More Items
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="h-1.5 w-full bg-green-500/10 group-hover:bg-green-500 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}