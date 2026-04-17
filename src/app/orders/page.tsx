"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Loader2,
  ShoppingBag,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

import { useGetOrders } from "@/hooks/useOrder";
import useAuthStore from "@/store/authStore";
import { useAddToCart } from "@/hooks/useCarat";

// --- Types ---
interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  status: string;
  total: number;
  subTotal: number;
  delivery_date: string | null;
  createdAt: string;
  delivery: {
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const { data: orders, isLoading } = useGetOrders();
  const { mutate: addToCart } = useAddToCart();
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [user, router]);

  const handleReorder = async (items: OrderItem[]) => {
    try {
      items.forEach((item) => {
        addToCart(item.productId);
      });

      toast.success("Items added to cart!");
    } catch (error) {
      toast.error("Failed to add items to cart");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "DELIVERED":
        return {
          icon: CheckCircle,
          color: "text-[#16A34A]",
          bg: "bg-green-50",
          label: "Delivered",
        };
      case "SHIPPED":
        return {
          icon: Package,
          color: "text-blue-500",
          bg: "bg-blue-50",
          label: "Shipped",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-50",
          label: "Cancelled",
        };
      default:
        return {
          icon: Clock,
          color: "text-[#FACC15]",
          bg: "bg-yellow-50",
          label: "Pending",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      <main className="max-w-360 mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">My Orders</h1>
          <p className="text-[#6B7280]">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            orders.map((order: Order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const address = order.delivery?.address;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                        <div>
                          <p className="text-sm text-[#6B7280]">Order ID</p>
                          <p className="font-bold text-[#111827]">#{order.orderId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Order Date</p>
                          <p className="font-medium text-[#111827]">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Total Amount</p>
                          <p className="font-bold text-[#111827]">
                            ₹{order.subTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bg}`}
                        >
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                          <span className={`font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items?.slice(0, 2).map((item, index) => (
                        <div key={index}>
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-xl border border-gray-200"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#111827] mb-1 line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-[#6B7280]">
                                Quantity: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <div className="text-right hidden sm:block">
                              <p className="font-bold text-[#111827]">
                                ₹{item.total.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                          {index === 1 && order.items.length > 2 && (
                            <p className="text-sm text-[#6B7280] mt-4">
                              +{order.items.length - 2} more item(s)
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#6B7280] mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#111827] mb-1">
                            Delivery Address
                          </p>
                          <p className="text-sm text-[#6B7280]">
                            {address
                              ? `${address.street}, ${address.city}, ${address.state} - ${address.postalCode}`
                              : "Address not specified"}
                          </p>
                          {order.delivery_date && (
                            <p className="text-sm text-[#16A34A] font-medium mt-2">
                              Expected: {formatDate(order.delivery_date)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 text-[#6B7280]" />
                        <span className="font-medium text-[#111827]">View Details</span>
                      </button>

                      {order.status === "DELIVERED" && (
                        <>
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <Download className="w-5 h-5 text-[#6B7280]" />
                            <span className="font-medium text-[#111827]">Invoice</span>
                          </button>
                          <button
                            onClick={() => handleReorder(order.items)}
                            className="flex-1 px-4 py-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium text-center"
                          >
                            Reorder
                          </button>
                        </>
                      )}

                      {(order.status === "PENDING" || order.status === "SHIPPED") && (
                        <button className="px-8 py-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium flex-1 sm:flex-none text-center">
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">No orders yet</h3>
              <p className="text-[#6B7280] mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}