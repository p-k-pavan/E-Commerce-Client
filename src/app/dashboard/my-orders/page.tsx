"use client";

import { useAppSelector } from "@/store/hooks";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, JSX } from "react";
import { toast } from "sonner";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Download,
  FileText
} from "lucide-react";
import { downloadInvoice } from "@/components/DownloadInvoice";

interface Orders {
  _id?: string;
  orderId?: string;
  product_details: {
    name: string;
    image: string[];
  };
  quantity: number;
  payment_status: string;
  subTotalAmt: number;
  totalAmt: number;
  createdAt: string;
  delivery_address?: string;
}

export default function Page() {
  const [myOrders, setMyOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };



  const getDeliveryStatus = (createdAt: string): { status: string; color: string; icon: JSX.Element } => {
    const orderDate = new Date(createdAt);
    const today = new Date();
    const diffTime = today.getTime() - orderDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 7) {
      return {
        status: "Delivered",
        color: "text-green-600 bg-green-50 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />
      };
    } else if (diffDays >= 5) {
      return {
        status: "Out for Delivery",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: <Truck className="w-4 h-4" />
      };
    } else {
      return {
        status: `Arriving in ${7 - diffDays} day${7 - diffDays === 1 ? "" : "s"}`,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        icon: <Clock className="w-4 h-4" />
      };
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (myOrders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center px-4">
        <div className="max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders. Start shopping to see your orders here!
          </p>

          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {myOrders.map((order, index) => {
            const deliveryStatus = getDeliveryStatus(order.createdAt);
            const orderKey = order._id || index.toString();
            const isExpanded = expandedOrder === orderKey;

            return (
              <div
                key={orderKey}
                className="border border-gray-200 rounded-xl bg-white transition-all duration-200 hover:shadow-lg hover:border-green-200 overflow-hidden"
              >
                {/* Main Order Card */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full lg:w-40 h-40 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image
                        src={order.product_details?.image?.[0] || "/placeholder.svg"}
                        alt={order.product_details?.name || "Product"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        width={160}
                        height={160}
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
                            {order.product_details?.name}
                          </h3>

                          {/* Status Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${deliveryStatus.color}`}>
                              {deliveryStatus.icon}
                              {deliveryStatus.status}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                              <CreditCard className="w-4 h-4" />
                              {order.payment_status}
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{order.totalAmt.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            ₹{order.subTotalAmt.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Order Meta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span>Qty: {order.quantity}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="capitalize">{order.payment_status}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span>Standard Delivery</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => toggleOrderDetails(orderKey)}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {isExpanded ? "Less Details" : "More Details"}
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">
                          <Truck className="w-4 h-4" />
                          Track Order
                        </button>
                        <button
                          onClick={() => downloadInvoice(order)}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Information */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Order Information
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Order ID:</span>
                            <span className="text-gray-900">{order.orderId || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Tracking ID:</span>
                            <span className="text-gray-900">{order._id || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Order Date:</span>
                            <span className="text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Expected Delivery:</span>
                            <span className="text-gray-900">
                              {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Price Breakdown
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Product Price:</span>
                            <span className="text-gray-900">₹{(order.subTotalAmt / order.quantity).toFixed(2)} × {order.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">₹{order.subTotalAmt.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Shipping:</span>
                            <span className="text-green-600">Free</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-2">
                            <span className="font-semibold text-gray-900">Total Amount:</span>
                            <span className="font-bold text-green-600">₹{order.totalAmt.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Progress */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Delivery Progress</h4>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                          <span className="text-gray-600">Order Placed</span>
                        </div>
                        <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                        <div className="text-center">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${deliveryStatus.status === "Delivered" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-gray-600">Shipped</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                        <div className="text-center">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${deliveryStatus.status === "Delivered" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-gray-600">Out for Delivery</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                        <div className="text-center">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${deliveryStatus.status === "Delivered" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-gray-600">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{myOrders.length}</p>
              <p className="text-gray-600 text-sm">Total Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {myOrders.filter(order => getDeliveryStatus(order.createdAt).status === "Delivered").length}
              </p>
              <p className="text-gray-600 text-sm">Delivered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {myOrders.filter(order => getDeliveryStatus(order.createdAt).status !== "Delivered").length}
              </p>
              <p className="text-gray-600 text-sm">In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}