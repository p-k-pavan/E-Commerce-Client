import axiosInstance from "@/lib/axiosInstance";

export const getPopularProducts = async () => {
  const res = await axiosInstance.get("/api/product/home");

  return res.data.data;
};

export const getProductDetails = async (slug:string) => {
    const res = await axiosInstance.get(`/api/product/${slug}`);

  return res.data.productData;

}