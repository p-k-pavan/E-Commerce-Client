// components/CategoryDetailPage.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ProductCard, { Product } from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import Link from "next/link";

interface SubCategory {
  _id: string;
  name: string;
  category: string;
  image?: string;
  description?: string;
}

interface CategoryDetailPageProps {
  categoryId: string;
}

function CategoryDetailPage({ categoryId }: CategoryDetailPageProps) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subcategories for the category
  const fetchSubCategories = useCallback(async () => {
    if (!categoryId) return;

    try {
      setSubCategoriesLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/subCategory/get-subcategory-by-categoryId`,
        {  categoryId: categoryId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        const subCats = response.data.data || [];
        setSubCategories(subCats);

        // Auto-select first subcategory if available
        if (subCats.length > 0 && !selectedSubCategory) {
          setSelectedSubCategory(subCats[0]._id);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch subcategories');
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch subcategories. Please try again.';

      toast.error(errorMessage);
    } finally {
      setSubCategoriesLoading(false);
    }
  }, [categoryId, selectedSubCategory]);

  // Fetch products for selected subcategory
  const fetchProducts = useCallback(async () => {
    if (!categoryId || !selectedSubCategory) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product/get-product-by-category-and-subcategory`,
        {
          categoryId: categoryId,
          subCategoryId: selectedSubCategory
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch products. Please try again.';

      setError(errorMessage);
      toast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [categoryId, selectedSubCategory]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  useEffect(() => {
    if (selectedSubCategory) {
      fetchProducts();
    }
  }, [fetchProducts, selectedSubCategory]);

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
    
  };

  return (
    <div className="container mx-auto px-3 py-6">
      <div className="flex flex-row gap-4">
        <div className="w-1/4 md:w-1/4 lg:w-1/5">
          <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-3 max-h-[85vh] flex flex-col">
            {subCategoriesLoading ? (
              <div className="space-y-3 overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2"
                  >
                    <div className="w-12 h-12 md:w-8 md:h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full md:flex-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : subCategories.length === 0 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm">📁</span>
                </div>
                <p className="text-gray-500 text-xs">No categories</p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-2">
                {subCategories.map((subCategory) => (
                  <button
                    key={subCategory._id}
                    onClick={() => handleSubCategorySelect(subCategory._id)}
                    className={`w-full p-2 rounded transition-all duration-200 cursor-pointer flex flex-col items-center md:flex-row md:space-y-0 md:space-x-2 md:items-center group ${selectedSubCategory === subCategory._id
                      ? 'bg-green-50 text-green-700 border border-green-300 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                      }`}
                  >
                    {/* Subcategory Image */}
                    <div className="flex-shrink-0 w-12 h-20 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={subCategory.image || '/images/placeholder-subcategory.png'}
                        alt={subCategory.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/placeholder-subcategory.png';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <h4 className="font-medium text-xs md:text-sm line-clamp-2 break-words">
                        {subCategory.name}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* Main Content - Products */}
        <div className="flex-1">
          {selectedSubCategory && (
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {
                  subCategories.find(sub => sub._id === selectedSubCategory)?.name ||
                  'Products'
                }
              </h2>
              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <ProductSkeleton count={8} />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">⚠️</span>
              </div>
              <p className="text-red-500 text-sm mb-3">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs md:text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📦</span>
              </div>
              <p className="text-gray-500 text-sm mb-2">No products found</p>
              <p className="text-gray-400 text-xs">
                Try selecting a different category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {products.map((product: any) => (
                <Link key={product.id} href={`/product/${product._id}`}>
                  <ProductCard
                    
                    product={product}
                    onAddToCart={handleAddToCart}
                    className="w-full"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetailPage;