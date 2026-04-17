"use client";

import { useHomePopular } from "@/hooks/useProduct";
import { ProductCard } from "../shared/ProductCard";
import ProductCardSkeleton from "../shared/ProductCardSkeleton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSubCategory } from "@/api/category";

const PopularProducts = () => {
  const { data: categories = [], isLoading } = useHomePopular();
  const navigate = useRouter();

  // ✅ FIX: Move hooks BEFORE any return
  const [isRedirecting, setIsRedirecting] = useState(false);

  const responsiveCardWidth =
    "min-w-full sm:min-w-[220px] lg:min-w-[calc(20%-13px)] lg:max-w-[calc(20%-13px)] shrink-0 mb-2";

  const getCategorySubtitle = (slug: string) => {
    const subtitles: Record<string, string> = {
      "fruits--vegetables": "Fresh & healthy fruit selections",
      "atta-rice--dal": "Daily essentials for your kitchen",
      "dairy-bread--eggs": "Fresh dairy products delivered daily",
      "chicken-meat--fish": "High quality protein and fresh cuts",
      "snacks--munchies": "Satisfy your cravings with tasty treats",
      "cold-drinks--juices": "Refreshing drinks for every occasion",
    };
    return subtitles[slug] || "Best quality products for you";
  };

  const handleRedirect = async (slug: any) => {
    try {
      setIsRedirecting(true);

      const subCategories = await getSubCategory(slug);

      if (subCategories && subCategories.length > 0) {
        navigate.push(`/category/${slug}/${subCategories[0].slug}`);
      } else {
        navigate.push(`/category`);
      }
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
    } finally {
      setIsRedirecting(false);
    }
  };

  // ✅ AFTER hooks → safe to return conditionally
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
                  <div key={item} className={responsiveCardWidth}>
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

  return (
    <div className="w-full py-6 md:py-10">
      <div className="max-w-8xl mx-auto px-4 space-y-10 md:space-y-16">
        {categories.map((category: any) => (
          <section key={category._id} className="space-y-4 md:space-y-6">
            
            {/* Header */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-bold text-xl md:text-2xl text-[#111827]">
                  Popular in {category.name}
                </h2>
                <p className="text-[#6B7280] mt-0.5 text-xs md:text-base">
                  {getCategorySubtitle(category.slug)}
                </p>
              </div>

              <button
                className="text-[#16A34A] font-bold text-sm hover:underline px-2"
                onClick={() => handleRedirect(category.slug)}
                disabled={isRedirecting}
              >
                View All
              </button>
            </div>

            {/* Products */}
            <div className="relative">
              <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 no-scrollbar scroll-smooth">
                
                {category.products.map((product: any) => (
                  <div key={product.slug} className={responsiveCardWidth}>
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

                {/* View More */}
                <div className="min-w-30 flex items-center justify-center pr-4">
                  <button
                    onClick={() => handleRedirect(category.slug)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition">
                      <span className="text-[#16A34A] text-xl">→</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 group-hover:text-[#16A34A] transition">
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