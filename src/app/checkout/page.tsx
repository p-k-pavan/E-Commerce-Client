"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  MapPin, 
  ShoppingBag, 
  Plus, 
  CreditCard, 
  Truck, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";

import { useGetAddresses } from "@/hooks/useAddress";
import {
  usePlaceCODOrder,
  useOnlinePayment,
  useVerifyPayment,
} from "@/hooks/useOrder";
import useAuthStore from "@/store/authStore";
import { useGetCart } from "@/hooks/useCarat";
import AddressModal from "@/components/profile/AddressModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: cart = [] } = useGetCart();
  const { data: addresses = [] } = useGetAddresses();

  const { mutate: placeCOD } = usePlaceCODOrder();
  const { mutateAsync: createPayment } = useOnlinePayment();
  const { mutate: verifyPayment } = useVerifyPayment();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [user, router]);

  const totals = cart.reduce(
    (acc: any, item: any) => {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;
      const qty = item.quantity;
      const discounted = price - (price * discount) / 100;

      acc.before += price * qty;
      acc.after += discounted * qty;
      acc.qty += qty;
      return acc;
    },
    { before: 0, after: 0, qty: 0 }
  );

  const handleCOD = () => {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    placeCOD({
      list_items: cart,
      addressId: selectedAddress,
      subTotalAmt: totals.after,
      totalAmt: totals.before,
    });
    router.push("/orders");
  };

  const handlePayment = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    try {
      const res = await createPayment({
        list_items: cart,
        addressId: selectedAddress,
        subTotalAmt: totals.after,
        totalAmt: totals.before,
      });

      const { razorpayOrder, orderData } = res;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        order_id: razorpayOrder.id,
        handler: function (response: any) {
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData,
          });
          router.push("/orders");
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment initiation failed");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#F9FAFB] lg:h-screen lg:overflow-hidden flex flex-col">
      <header className="  px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#111827]">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span className="text-[#16A34A] font-medium">Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#111827] font-bold">Shipping</span>
            <ChevronRight className="w-4 h-4" />
            <span>Payment</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-0 lg:overflow-hidden">
        
        <div className="lg:col-span-7 p-6 lg:overflow-y-auto custom-scrollbar border-r border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-[#16A34A]" />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">Delivery Address</h2>
            </div>
            <button
              onClick={() => { setEditData(null); setOpenModal(true); }}
              className="flex items-center gap-2 text-sm font-bold text-[#16A34A] hover:text-[#15803D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="grid gap-4">
            {addresses.map((addr: any) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddress(addr._id)}
                className={`group relative p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  selectedAddress === addr._id
                    ? "border-[#16A34A] bg-green-50/50"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#111827]">{addr.street}</p>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[#6B7280] text-sm">{addr.city}, {addr.state} - {addr.postalCode}</p>
                    <p className="text-[#6B7280] text-sm">{addr.mobile}</p>
                  </div>
                  {selectedAddress === addr._id && (
                    <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
                  )}
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No addresses saved yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 lg:overflow-y-auto custom-scrollbar bg-[#F9FAFB]">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Order Summary</h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
            <div className="p-4 space-y-4">
              {cart.map((item: any) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 shrink-0">
                    <img
                      src={item.productId.image[0]}
                      alt={item.productId.name}
                      className="w-full h-full object-cover rounded-xl border border-gray-100"
                    />
                    <span className="absolute -top-2 -right-2 bg-[#111827] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111827] truncate">{item.productId.name}</p>
                    <p className="text-xs text-[#6B7280]">Unit Price: ₹{item.productId.price}</p>
                  </div>
                  <p className="font-bold text-[#111827] text-sm">
                    ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between text-[#6B7280] text-sm">
              <span>Subtotal ({totals.qty} items)</span>
              <span>₹{totals.before.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[#16A34A] text-sm font-medium">
              <span className="flex items-center gap-1">Discount</span>
              <span>-₹{(totals.before - totals.after).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[#6B7280] text-sm">
              <span>Shipping</span>
              <span className="text-[#16A34A]">Free</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-lg font-bold text-[#111827]">Total</span>
              <span className="text-2xl font-bold text-[#111827]">₹{totals.after.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handlePayment}
              className="w-full bg-[#111827] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200"
            >
              <CreditCard className="w-5 h-5" />
              Pay with Online Payment
            </button>
            <button
              onClick={handleCOD}
              className="w-full bg-white border-2 border-gray-200 text-[#111827] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Truck className="w-5 h-5" />
              Cash on Delivery
            </button>
            <p className="text-center text-[11px] text-[#6B7280] px-6">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>

      <AddressModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}