"use client";

import { useCategory } from "@/hooks/useCategory";
import { CategoryCard } from "./CategoryCard";
import { CategorySkeleton } from "./CategorySkeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryCardProps {
  image: string;
  slug: string;
}

export function Categories() {
  const { data: categories = [], isLoading } = useCategory();
  const navigate = useRouter();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 640); // mobile
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const visibleCategories =
    isSmallScreen && !showAll
      ? categories.slice(0, 9)
      : categories;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2 md:px-0">
        <h2 className="font-bold text-xl md:text-2xl text-[#111827]">
          Shop by Category
        </h2>

        {/* 👉 Button Logic */}
        {isSmallScreen ? (
          <button
            className="text-[#16A34A] font-semibold text-sm hover:underline"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        ) : (
          <button
            className="text-[#16A34A] font-semibold text-sm hover:underline"
            onClick={() => navigate.push("/category")}
          >
            View All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          : visibleCategories.map((category: CategoryCardProps) => (
              <CategoryCard
                key={category.slug}
                image={category.image}
                slug={category.slug}
              />
            ))}
      </div>
    </section>
  );
}