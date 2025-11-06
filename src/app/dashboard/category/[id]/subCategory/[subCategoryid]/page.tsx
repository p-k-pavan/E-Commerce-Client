'use client'

import axios from "axios"
import { useParams ,useRouter} from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ProductCard, { Product } from "@/components/ProductCard"
import Link from "next/link"
import { useAppSelector } from "@/store/hooks"

export default function ProductPage() {
    const params = useParams()
    const categoryId = params.id as string
    const subCategoryId = params.subCategoryid as string
    console.log(categoryId)
    console.log(subCategoryId);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

      const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role != "ADMIN") {
      toast("Unauthorized access!");
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role != "ADMIN") {
    return <div className="text-center py-10">Redirecting...</div>;
  }

    // Fetch products for selected subcategory
    const fetchProducts = async () => {
        if (!categoryId || !subCategoryId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/product/get-product-by-category-and-subcategory`,
                {
                    categoryId: categoryId,
                    subCategoryId: subCategoryId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    timeout: 10000,
                }
            );

            if (response.data.success) {
                setProducts(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch products');
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch products. Please try again.';

            setError(errorMessage);
            toast(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 my-8 mx-4">
              {products.map((product: any) => (
                <Link key={product.id} href={`/product/${product._id}`}>
                  <ProductCard
                    
                    product={product}
                    className="w-full"
                  />
                </Link>
              ))}
            </div>
    )
}