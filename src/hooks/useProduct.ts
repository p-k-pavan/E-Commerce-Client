
import { getPopularProducts, getProductDetails, getProductsByCategoryandSubCategory, searchProduct, SearchResponse } from "@/api/product";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

export const useHomePopular = () => {
  return useQuery({
    queryFn: getPopularProducts,
    queryKey: ["product"],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useProductDetails = (slug:string) => {
     return useQuery({
    queryFn: getProductDetails.bind(null, slug),
    queryKey: ["product", slug],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export const useProductsByCategoryandSubCategory = (categorySlug:string, subCategorySlug:string) => {
     return useQuery({
    queryFn: getProductsByCategoryandSubCategory.bind(null, categorySlug, subCategorySlug),
    queryKey: ["products", categorySlug, subCategorySlug],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

type Params = {
  search?: string;
  limit?: number;
};

export const useInfiniteProducts = ({ search = "", limit = 15 }: Params) => {
  return useInfiniteQuery<SearchResponse>({
    // Adding search to queryKey ensures it refetches when search changes
    queryKey: ["products", search], 
    
    // Fix: Call the API function, not the search string
    queryFn: ({ pageParam = 1 }) => 
      searchProduct({ search, page: pageParam as number, limit }),

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page;
      const totalPage = lastPage.totalPage;
      // If there are more pages, return the next page number, otherwise undefined
      return currentPage < totalPage ? currentPage + 1 : undefined;
    },

    initialPageParam: 1,
  });
};