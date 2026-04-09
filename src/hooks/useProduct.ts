
import { getPopularProducts } from "@/api/product";
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