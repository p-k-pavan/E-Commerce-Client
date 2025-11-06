"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

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
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const responseData = response.data;

        if (responseData.error) {
          toast.error(responseData.message || "Search failed");
          return;
        }

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
    <section className="bg-white min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4">
        <p className="font-semibold text-gray-800 text-sm sm:text-base">
          Search Results: {data.length}{" "}
          {searchText && (
            <span className="text-gray-500">
              for “{searchText}”
            </span>
          )}
        </p>

        {loading && !data.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={data.length}
            hasMore={hasMore}
            next={handleFetchMore}
            loader={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-4 gap-3 sm:gap-4">
              {data.map((p:any) => (
                <Link key={p._id} href={`/product/${p._id}`}>
                  <ProductCard product={p} className="w-full h-full" />
                </Link>
              ))}
            </div>
          </InfiniteScroll>
        )}

        {!data.length && !loading && (
          <div className="flex flex-col justify-center items-center w-full mx-auto mt-12 text-center">
            <img
              src="https://media0.giphy.com/media/IwSG1QKOwDjQk/giphy.gif"
              alt="No data found"
              className="w-48 h-48 sm:w-60 sm:h-60 object-contain opacity-80"
            />
            <p className="font-semibold mt-3 text-gray-600 text-sm sm:text-base">
              No products found
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
