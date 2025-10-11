"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import Link from "next/link";

// ✅ Product Card Component
const ProductCard = ({ product }: { product: any }) => (
  <Link
    href={`/product/${product._id}`}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
  >
    <div className="aspect-w-1 aspect-h-1 w-full">
      <img
        src={product.image || "/placeholder-product.jpg"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2 mb-2">
        {product.name}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-600">
          ₹{product.price}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-sm text-gray-500 line-through">
            ₹{product.originalPrice}
          </span>
        )}
      </div>
      {product.discount && (
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
          {product.discount}% OFF
        </span>
      )}
    </div>
  </Link>
);


interface Product {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
}

interface SearchResponse {
  success: boolean;
  data: Product[];
  totalPage: number;
  message?: string;
  error?: boolean;
}

const SearchPage = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const searchText = searchParams?.get("q") || "";

  const fetchData = useCallback(
    async (currentPage: number = 1, isNewSearch: boolean = false) => {
      try {
        setLoading(true);

        const response = await axios.post<SearchResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/product/search-product`,
          {
            search: searchText.trim(), 
            page: currentPage,
            limit: 12,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.error) {
          toast.error(response.data.message || "Search failed");
          return;
        }

        const responseData = response.data;

        if (responseData.success) {
          if (isNewSearch || currentPage === 1) {
            setData(responseData.data || []);
          } else {
            setData((prev) => [...prev, ...(responseData.data || [])]);
          }

          setTotalPage(responseData.totalPage || 1);
          setHasMore(currentPage < (responseData.totalPage || 1));
        }
      } catch (error: any) {
        console.error("Search error:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Search failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [searchText]
  );

  useEffect(() => {
    fetchData(1, true);
  }, []);

  useEffect(() => {
    setPage(1);
    setData([]);
    fetchData(1, true);
  }, [searchText, fetchData]);

  useEffect(() => {
    if (page > 1) {
      fetchData(page, false);
    }
  }, [page, fetchData]);

  const handleFetchMore = () => {
    if (totalPage > page && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">
          Search Results: {data.length}{" "}
          {searchText && <span className="text-gray-500">for “{searchText}”</span>}
        </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={hasMore}
          next={handleFetchMore}
          loader={<div className="text-center py-4">Loading more...</div>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
            {data.map((p, index) => (
              <ProductCard key={`${p._id}-${index}`} product={p} />
            ))}
          </div>
        </InfiniteScroll>

        {/* No data found */}
        {!data.length && !loading && (
          <div className="flex flex-col justify-center items-center w-full mx-auto mt-10">
            <img
              src="https://media0.giphy.com/media/IwSG1QKOwDjQk/giphy.gif"
              alt="No data found"
              className="w-60 h-60 object-contain opacity-80"
            />
            <p className="font-semibold mt-2 text-gray-600">
              No products found
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
