import axiosInstance from "@/lib/axiosInstance";

export const getPopularProducts = async () => {
  const res = await axiosInstance.get("/api/product/home");

  return res.data.data;
};

export const getProductDetails = async (slug:string) => {
    const res = await axiosInstance.get(`/api/product/${slug}`);

  return res.data.productData;

}

export const getProductsByCategoryandSubCategory = async (categorySlug:string, subCategorySlug:string) => {
    const res = await axiosInstance.get(`/api/product/category/${categorySlug}/${subCategorySlug}`);
    return res.data.data;
}


type SearchParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  finalPrice: number;
  image: string;
  stock: number;
  unit: string;
  description: string;
};

export type SearchResponse = {
  message: string;
  success: boolean;
  error: boolean;
  data: Product[];
  totalCount: number;
  totalPage: number;
  page: number;
  limit: number;
};


export const searchProduct = async (
  params: SearchParams
): Promise<SearchResponse> => {
  const { search = "", page = 1, limit = 15 } = params;

  const response = await axiosInstance.get("/api/product/search", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
};