"use client";

import { useAppSelector } from "@/store/hooks";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Orders {
  _id?: string;
  product_details: {
    name: string;
    image: string[];
  };
  quantity: number;
  payment_status: string;
  subTotalAmt: number;
  totalAmt: number;
  createdAt: string;
}

export default function Page() {
  const [myOrders, setMyOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // ✅ Always define hooks before conditional returns
  useEffect(() => {
    if (!user) {
      toast("Unauthorized access!");
      router.push("/login");
    }
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/order`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success === true) {
        setMyOrders(response.data.data);
      } else {
        toast("Failed to fetch orders");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || "An error occurred.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Always call hooks before any conditional rendering
  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Now conditionally render
  if (!user) {
    return <div className="text-center py-10">Redirecting...</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (myOrders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>
          <p className="text-gray-500 mt-2">You haven’t placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="grid gap-6">
        {myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 border rounded overflow-hidden flex-shrink-0">
                <Image
                  src={order.product_details?.image?.[0] || "/placeholder.svg"}
                  alt={order.product_details?.name || "Product"}
                  className="w-full h-full object-cover"
                  width={128}
                  height={128}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {order.product_details?.name}
                </h3>

                <p className="text-gray-600 mt-1">
                  Quantity: <span className="font-medium">{order.quantity}</span>
                </p>

                <p className="text-gray-600 mt-1">
                  Payment: <span className="font-medium">{order.payment_status}</span>
                </p>

                <p className="text-gray-600 mt-1">
                  Subtotal: ₹<span className="font-medium">{order.subTotalAmt.toFixed(2)}</span>
                </p>

                <p className="text-gray-600 mt-1">
                  Total: ₹
                  <span className="font-medium text-green-600">
                    {order.totalAmt.toFixed(2)}
                  </span>
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Ordered on:{" "}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
