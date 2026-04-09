import axiosInstance from "@/lib/axiosInstance";

export const getCategory = async () => {
  const res = await axiosInstance.get("/api/category");

  return res.data.data;
};