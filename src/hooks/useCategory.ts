
import { getCategory, getCategoryWithSubCategories } from "@/api/category";
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

export const useCategoryWithSubCategories = () => {
  return useQuery({
    queryFn: getCategoryWithSubCategories,
    queryKey: ["categoryWithSubCategories"],
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};