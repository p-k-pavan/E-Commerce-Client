
import { getPopularProducts, getProductDetails } from "@/api/product";
import {
  keepPreviousData,
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