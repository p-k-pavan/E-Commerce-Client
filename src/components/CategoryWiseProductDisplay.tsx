"use client";

import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import ProductCard, { Product } from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface CategoryWiseProductDisplayProps {
    id: string;
    name: string;
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    className?: string;
}

function CategoryWiseProductDisplay({
    id,
    name,
    onProductClick,
    onAddToCart,
    className = ""
}: CategoryWiseProductDisplayProps) {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);


    const fetchCategoryWiseProduct = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/product/get-product-by-category`,
                { id: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    timeout: 10000,
                }
            );

            if (response.data.success) {
                setData(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Fetch failed');
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch products. Please try again.';

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id]);


    useEffect(() => {
        fetchCategoryWiseProduct();
    }, [fetchCategoryWiseProduct]);


    const handleScrollRight = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }, []);

    const handleScrollLeft = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }, []);

    const handleProductAddToCart = useCallback((product: Product) => {
        onAddToCart?.(product);
        toast.success(`${product.name} added to cart`);
    }, [onAddToCart]);


    if (!loading && data.length === 0 && !error) {
        return (
            <section className={`mb-8 ${className}`} aria-labelledby={`category-${id}-heading`}>
                <div className="container mx-auto p-4">
                    <div className="text-center py-8 text-gray-500">
                        No products found in {name} category
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`mb-8 ${className}`} aria-labelledby={`category-${id}-heading`}>
            <div className="container mx-auto p-4 flex items-center justify-between gap-4">
                <h3 id={`category-${id}-heading`} className="font-semibold text-lg md:text-xl">
                    {name}
                </h3>
                <Link
                    href={`/category/${id}`}
                    className="text-green-600 hover:text-green-500 transition-colors duration-200 font-medium"
                >
                    See All
                </Link>
            </div>

            <div className="relative flex items-center">

                <div
                    ref={containerRef}
                    className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-auto 
             [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                    aria-live="polite"
                >
                    {loading ? (
                        <ProductSkeleton count={5} />
                    ) : error ? (
                        <div className="w-full text-center py-8 text-red-500">
                            {error}
                        </div>
                    ) : (
                        data.map((product: any) => (
                            
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAddToCart={handleProductAddToCart}
                                />
                            
                        ))
                    )}
                </div>


                {!loading && data.length > 0 && (
                    <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between pointer-events-none">
                        <button
                            onClick={handleScrollLeft}
                            className="pointer-events-auto cursor-pointer z-10 relative bg-white hover:bg-gray-50 shadow-lg text-lg p-3 rounded-full transition-all duration-200 hover:shadow-xl"
                            aria-label="Scroll left"
                        >
                            <FaAngleLeft />
                        </button>
                        <button
                            onClick={handleScrollRight}
                            className="pointer-events-auto cursor-pointer z-10 relative bg-white hover:bg-gray-50 shadow-lg p-3 text-lg rounded-full transition-all duration-200 hover:shadow-xl"
                            aria-label="Scroll right"
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default memo(CategoryWiseProductDisplay);