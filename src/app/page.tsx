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
        <div className="m-2 md:mx-12 lg:mx-16 mt-12">

            <BannerSlider />

            <div className="container mx-auto px-4 my-4 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2">
                {loading
                    ?
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                            <Skeleton className="w-32 h-32 rounded-lg" />
                            <Skeleton className="w-32 h-32 rounded-lg" />
                        </div>
                    ))
                    :
                    category.map((cat: any) => (
                        <Link key={cat._id} href={`/category/${cat._id}`}>
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48">
                                    <Image
                                        src={cat.image || '/placeholder.png'}
                                        alt={cat.name}
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                            </div>

                        </Link>
                    ))}
            </div>
            {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="container mx-auto p-4 flex items-center justify-between gap-4">
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                    </div>
                ))
            ) : (
                category.map((cat: Category) => (
                    <CategoryWiseProductDisplay
                        key={cat._id}
                        id={cat._id}
                        name={cat.name}
                    />
                ))
            )}

        </div>
    );
}