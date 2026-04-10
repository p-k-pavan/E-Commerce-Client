"use client";

import { useParams } from "next/navigation";
import { useSubCategorybyCategory } from "@/hooks/useCategory";
import { useProductsByCategoryandSubCategory } from "@/hooks/useProduct";
import { SubCategorySidebar } from "@/components/category/SubCategorySidebar";
import { ProductGrid } from "@/components/category/ProductGrid";
import { HeaderSkeleton } from "@/components/category/CategorySkeletons";

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
      <main className="max-w-350 mx-auto px-6 py-10">
        
        {subLoading ? (
          <HeaderSkeleton />
        ) : (
          <div className="mb-10">
            <h1 className="font-extrabold text-4xl text-[#111827] mb-2 capitalize">
              {categorySlug.replace(/-/g, ' ')}
            </h1>
            <p className="text-[#6B7280] text-lg">
              Explore our wide selection of {categorySlug.replace(/-/g, ' ')}
            </p>
          </div>
        )}

        <div className="flex gap-10">
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