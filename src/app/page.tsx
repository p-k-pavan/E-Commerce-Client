"use client";

import { useEffect, useState } from "react";
import BannerSlider from "@/components/BannerSlider";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryWiseProductDisplay from "@/components/CategoryWiseProductDisplay"
import { useAppSelector } from "@/store/hooks";
import ProductSkeleton from "@/components/ProductSkeleton";
import ProductCard, { Product } from "@/components/ProductCard";
import Image from "next/image";

interface Category {
    _id: string;
    name: string;
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    className?: string;
}

export default function Home() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cart, loading: cartLoading } = useAppSelector((state) => state.cart);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/category/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );

                if (response.data.success === true) {
                    setCategory(response.data.data);
                    setLoading(false);
                } else if (response.data.error === true) {
                    toast.error(response.data.message || 'Fetch failed!');
                }
            } catch (err: unknown) {
                const axiosError = err as AxiosError<{ message?: string }>;
                const msg = axiosError.response?.data?.message || 'An error occurred.';
                toast.error(msg);
            }
        };

        fetchCategory();
    }, []);

    return (
        <div className="mx-2 md:mx-4 lg:mx-8 xl:mx-12 mt-12">

            <BannerSlider />

            {/* Categories Grid - Improved responsive design */}
            <div className="mx-auto px-2 sm:px-4 my-4">
                <h2 className="text-xl font-bold mb-4 px-2">Categories</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4">
                    {loading
                        ?
                        Array.from({ length: 16 }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg" />
                                <Skeleton className="w-12 h-3 sm:w-16 sm:h-4 rounded" />
                            </div>
                        ))
                        :
                        category.map((cat: any) => (
                            <Link key={cat._id} href={`/category/${cat._id}`} className="block">
                                <div className="flex flex-col items-center cursor-pointer p-1 sm:p-2 hover:scale-105 transition-transform duration-200">
                                    <div className="relative w-24 h-36 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-48 lg:h-48">
                                        <Image
                                            src={cat.image || '/placeholder.png'}
                                            alt={cat.name}
                                            fill
                                            className="object-contain rounded-lg"
                                            sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>


<div className="mx-auto px-2 sm:px-4 my-6">
    {loading ? (
        <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="w-full">
                    <Skeleton className="h-6 w-48 mb-4 ml-2" />
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        <div className="flex  gap-3 sm:gap-4 min-w-min">
                            {Array.from({ length: 5 }).map((_, productIndex) => (
                                <div 
                                    key={productIndex} 
                                    className="flex-shrink-10 w-[140px] sm:w-[150px] md:w-[180px] lg:w-[300px]"
                                >
                                    <ProductSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div className="space-y-8">
            {category.map((cat: Category) => (
                <CategoryWiseProductDisplay
                    key={cat._id}
                    id={cat._id}
                    name={cat.name}
                />
            ))}
        </div>
    )}
</div>

        </div>
    );
}