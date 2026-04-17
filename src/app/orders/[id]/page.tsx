"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  Loader2,
  ReceiptText
} from "lucide-react";
import { useGetOrderById } from "@/hooks/useOrder";
import useAuthStore from "@/store/authStore";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const {user} = useAuthStore();
  const { data: order, isLoading } = useGetOrderById(id as string);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "DELIVERED":
        return { icon: CheckCircle, color: "text-[#16A34A]", bg: "bg-green-50", label: "Delivered" };
      case "SHIPPED":
        return { icon: Package, color: "text-blue-500", bg: "bg-blue-50", label: "Shipped" };
      case "CANCELLED":
        return { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Cancelled" };
      default:
        return { icon: Clock, color: "text-[#FACC15]", bg: "bg-yellow-50", label: "Pending" };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
      </div>
    );
  }

  if (!order) return <div className="p-10 text-center">Order not found</div>;

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12">
      <main className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Orders</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Order #{order.orderId}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl self-start ${statusConfig.bg}`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            <span className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-[#111827] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#16A34A]" />
                  Order Items ({order.items.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="p-6 flex gap-6 items-center">
                    <div className="relative w-24 h-24 shrink-0" onClick={ () => router.push(`/product/${item.slug}`)}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-xl border border-gray-100"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#111827] truncate text-lg">{item.name}</h4>
                      <p className="text-[#6B7280] text-sm mt-1">Quantity: {item.quantity}</p>
                      <p className="text-[#16A34A] font-medium mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#111827] text-lg">
                        ₹{item.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#16A34A]" />
                  <h3 className="font-bold text-[#111827]">Shipping Address</h3>
                </div>
                <div className="text-[#6B7280] text-sm leading-relaxed">
                  <p className="font-medium text-[#111827] mb-1">{user?.name || "Customer"}</p>
                  <p>{order?.delivery?.address?.street}</p>
                  <p>{order?.delivery?.address?.city}, {order?.delivery?.address?.state}</p>
                  <p className="mt-1 font-medium">{order?.delivery?.address?.postalCode}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-[#16A34A]" />
                  <h3 className="font-bold text-[#111827]">Payment Info</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Method</span>
                    <span className="text-sm font-medium text-[#111827]">Online Payment</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Status</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      order.payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payment.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111827] text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <ReceiptText className="w-5 h-5 text-[#16A34A]" />
                <h3 className="font-bold text-lg">Order Summary</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{order.subTotal?.toLocaleString("en-IN") || order.total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-[#16A34A] font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400 border-b border-gray-800 pb-4">
                  <span>Tax</span>
                  <span className="text-white font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#16A34A]">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full mt-8 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl font-bold border border-white/10"
              >
                <ReceiptText className="w-5 h-5" />
                Download Invoice
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-[#111827] mb-2 text-sm uppercase tracking-wider">Need Help?</h4>
              <p className="text-sm text-[#6B7280] mb-4">If you have any issues with your order, please contact our support team.</p>
              <button className="w-full text-center py-3 border-2 border-gray-100 rounded-xl font-bold text-[#111827] hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}