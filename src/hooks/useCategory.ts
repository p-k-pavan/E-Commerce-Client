
import { getCategory } from "@/api/category";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

export const useCategory = () => {
  return useQuery({
    queryFn: getCategory,
    queryKey: ["category"],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};