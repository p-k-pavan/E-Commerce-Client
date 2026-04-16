"use client";

import { useGetOrders } from "@/hooks/useOrder";
import useAuthStore from "@/store/authStore";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GiCash } from "react-icons/gi";
import { toast } from "sonner";

export default function Orders() {
  const {user}= useAuthStore();
  const { data: orders, isLoading } = useGetOrders();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusUI = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: "Delivered",
          color: "text-green-500",
        };
      case "SHIPPED":
        return {
          icon: <Package className="w-5 h-5 text-blue-500" />,
          text: "Shipped",
          color: "text-blue-500",
        };
      case "CANCELLED":
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          text: "Cancelled",
          color: "text-red-500",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          text: "Pending",
          color: "text-yellow-500",
        };
    }
  };

    useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            My Orders
          </h1>
          <p className="text-[#6B7280]">
            Track and manage your orders
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            orders.map((order: any) => {
              const statusUI = getStatusUI(order?.status);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col md:flex-row justify-between gap-4">

                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-bold">{order.orderId}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p>{formatDate(order.createdAt)}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-bold">₹{order.total}</p>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="flex items-center gap-2">
                        {order?.payment?.status === "PAID" ? (
                          <CheckCircle className="text-green-500 w-5 h-5" />
                        ) : (
                          <GiCash className="text-red-500 w-5 h-5" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            order?.payment?.status === "PAID"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {order?.payment?.status === "PAID"
                            ? "Paid"
                            : "COD"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-3 flex items-center gap-2">
                      {statusUI.icon}
                      <span className={statusUI.color}>
                        {statusUI.text}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex gap-4 mb-4">
                      <Image
                        src={order.product?.image || "/placeholder-image.jpg"}
                        alt={order.product?.name}
                        width={80}
                        height={80}
                        className="rounded-xl border object-cover"
                        unoptimized
                      />

                      <div className="flex-1">
                        <h4 className="font-medium">
                          {order.product?.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {order.quantity} × ₹{order.subTotal}
                        </p>
                      </div>

                      <p className="font-bold">₹{order.total}</p>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <p className="font-medium mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-500">
                        {[
                          order?.delivery?.address?.street,
                          order?.delivery?.address?.city,
                          order?.delivery?.address?.state,
                          order?.delivery?.address?.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Address not available"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Expected Delivery:{" "}
                        {order?.delivery_date
                          ? formatDate(order.delivery_date)
                          : "Not available"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button className="flex-1 border rounded-xl py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                        <Eye size={18} /> View
                      </button>

                      {order?.status === "DELIVERED" && (
                        <>
                          <button className="flex-1 border rounded-xl py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
                            <Download size={18} /> Invoice
                          </button>

                          <button className="flex-1 bg-green-600 text-white rounded-xl py-2 hover:bg-green-700" onClick={ () => router.push(`/product/${order?.product?.slug}`)}>
                            Reorder
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl">
              <Package className="mx-auto mb-4 text-gray-300 w-16 h-16" />
              <h3 className="font-bold text-lg">No orders yet</h3>
              <p className="text-gray-500 mb-4">
                Start shopping now <ShoppingBag />
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-green-600 text-white px-6 py-2 rounded-xl"
              >
                Shop Now
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}