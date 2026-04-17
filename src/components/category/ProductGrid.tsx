import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "./CategorySkeletons";

interface ProductGridProps {
  products: any[];
  title: string;
  loading: boolean;
}

export function ProductGrid({ products, title, loading }: ProductGridProps) {
  const displayTitle = title?.replace(/-/g, " ") || "";

  return (
    <div className="flex-1">
      <div className="mb-4 md:mb-8">
        <h2 className="font-bold text-lg md:text-2xl text-[#111827] capitalize tracking-tight">
          {displayTitle}
        </h2>
        {!loading && (
          <p className="text-[#6B7280] text-xs md:text-sm mt-0.5">
            {products.length} Items found
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : products && products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard
              key={product._id}
              slug={product.slug}
              name={product.name}
              discount={product.discount}
              originalPrice={product.price}
              image={product.image || (product.images && product.images[0])}
              productId={product._id}
            />
          ))
        ) : (
          <div className="col-span-full py-16 md:py-24 bg-white rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-[#111827]">No items found</h3>
          </div>
        )}
      </div>
    </div>
  );
}