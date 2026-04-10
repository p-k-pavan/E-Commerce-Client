import axiosInstance from "@/lib/axiosInstance";

export const getCategory = async () => {
  const res = await axiosInstance.get("/api/category");

  return res.data.data;
};

export const getCategoryWithSubCategories = async () => {
  const res = await axiosInstance.get("/api/category/allSubCategories");
  return res.data.data;
};

export const getSubCategory = async (categorySlug:string) => {
  const res = await axiosInstance.get(`/api/subCategory/category/${categorySlug}`);

  return res.data.data;
}