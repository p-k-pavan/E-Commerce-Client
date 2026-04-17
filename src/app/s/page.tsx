"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteProducts } from "@/hooks/useProduct";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/category/CategorySkeletons";

export default function ProductSearchContent() {
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const searchQuery = searchParams.get("q") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts({
    search: searchQuery,
    limit: 15,
  });

  const products = data?.pages?.flatMap((page: any) => page.data) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
      </h1>

      {isLoading && <p>Loading products...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item: any) => (
          <ProductCard
            key={item._id}
            slug={item.slug}
            name={item.name}
            discount={item.discount}
            originalPrice={item.price}
            image={item.image}
            productId={item._id}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-20 flex justify-center items-center" />

      {(isLoading || isFetchingNextPage) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
}