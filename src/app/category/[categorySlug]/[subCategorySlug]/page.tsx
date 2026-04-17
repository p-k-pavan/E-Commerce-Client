"use client";

import { useParams } from "next/navigation";
import { useSubCategorybyCategory } from "@/hooks/useCategory";
import { useProductsByCategoryandSubCategory } from "@/hooks/useProduct";
import { SubCategorySidebar } from "@/components/category/SubCategorySidebar";
import { ProductGrid } from "@/components/category/ProductGrid";

export default function SubCategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const subCategorySlug = params.subCategorySlug as string;

  const { data: subCategories, isLoading: subLoading } = useSubCategorybyCategory(categorySlug);
  const { data: products, isLoading: productsLoading } = useProductsByCategoryandSubCategory(
    categorySlug, 
    subCategorySlug
  );

  const currentSubCategoryName = subCategories?.find(
    (s: any) => s.slug === subCategorySlug
  )?.name || subCategorySlug;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Adjusted padding for mobile: px-4 md:px-6 py-6 md:py-10 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {subLoading ? (
          <div className="mb-6 md:mb-10">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>  
        ) : (
          <div className="mb-6 md:mb-10">
            {/* Responsive font size: text-2xl to text-4xl */}
            <h1 className="font-extrabold text-2xl md:text-4xl text-[#111827] mb-1 md:mb-2 capitalize">
              {categorySlug.replace(/-/g, ' ')}
            </h1>
            <p className="text-[#6B7280] text-sm md:text-lg">
              Explore our wide selection of {categorySlug.replace(/-/g, ' ')}
            </p>
          </div>
        )}

        {/* Change flex direction on mobile */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <SubCategorySidebar 
            subCategories={subCategories || []} 
            categorySlug={categorySlug}
            currentSubCategorySlug={subCategorySlug}
            loading={subLoading}
          />

          <ProductGrid 
            products={products || []} 
            title={currentSubCategoryName}
            loading={productsLoading} 
          />
        </div>
      </main>
    </div>
  );
}