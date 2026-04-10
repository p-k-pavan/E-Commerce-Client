"use client";

import { useHomePopular } from '@/hooks/useProduct';
import { ProductCard } from '../shared/ProductCard';
import ProductCardSkeleton from '../shared/ProductCardSkeleton';

const PopularProducts = () => {
    const { data: categories = [], isLoading } = useHomePopular();

    if (isLoading) {
        return (
            <div className="w-full py-10">
                <div className="max-w-8xl mx-auto px-4 space-y-16">

                    {[1, 2, 3].map((section) => (
                        <div key={section} className="space-y-6">

                            <div className="space-y-2">
                                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            <div className="flex gap-4 overflow-hidden">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div
                                        key={item}
                                        className="min-w-[calc(20%-13px)] max-w-[calc(20%-13px)]"
                                    >
                                        <ProductCardSkeleton />
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        );
    }


    const getCategorySubtitle = (slug: string) => {
        const subtitles: Record<string, string> = {
            "fruits--vegetables": "Fresh & healthy fruit selections",
            "atta-rice--dal": "Daily essentials for your kitchen",
            "dairy-bread--eggs": "Fresh dairy products delivered daily",
            "chicken-meat--fish": "High quality protein and fresh cuts",
            "snacks--munchies": "Satisfy your cravings with tasty treats",
            "cold-drinks--juices": "Refreshing drinks for every occasion"
        };
        return subtitles[slug] || "Best quality products for you";
    };

    return (
        <div className="w-full py-10">
            <div className="max-w-8xl mx-auto px-4 space-y-16">

                {categories.map((category: any) => (
                    <section key={category._id} className="space-y-6">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-2xl text-[#111827]">
                                    Popular in {category.name}
                                </h2>
                                <p className="text-[#6B7280] mt-1 text-sm md:text-base">
                                    {getCategorySubtitle(category.slug)}
                                </p>
                            </div>
                            <button
                                className="text-[#16A34A] font-semibold text-sm hover:underline cursor-pointer"
                                onClick={() => window.location.href = `/category/${category.slug}`}
                            >
                                View All
                            </button>
                        </div>


                        <div className="relative">
                            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar scroll-smooth
              [&::-webkit-scrollbar]:hidden 
                [-ms-overflow-style:none] 
                [scrollbar-width:none]">
                                {category.products.map((product: any) => (
                                    <div
                                        key={product.slug}
                                        className="min-w-[calc(20%-13px)] max-w-[calc(20%-13px)] shrink-0 mb-2"
                                    >
                                        <ProductCard
                                            slug={product.slug}
                                            name={product.name}
                                            discount={product.discount}

                                            originalPrice={product.price}
                                            image={product.image[0]}
                                            productId={product._id}
                                        />
                                    </div>
                                ))}


                                <div className="min-w-40 flex items-center justify-center pr-4">
                                    <button
                                        onClick={() => window.location.href = `/category/${category.slug}`}
                                        className="flex flex-col items-center gap-3 group"
                                    >

                                        <span className="text-sm font-semibold text-gray-600 group-hover:text-[#16A34A] cursor-pointer transition-colors">
                                            View More
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

            </div>
        </div>
    );
};

export default PopularProducts;