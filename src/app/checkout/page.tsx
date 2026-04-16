"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

;
import { useGetAddresses } from "@/hooks/useAddress";
import {
  usePlaceCODOrder,
  useOnlinePayment,
  useVerifyPayment,
} from "@/hooks/useOrder";
import useAuthStore from "@/store/authStore";
import { useGetCart } from "@/hooks/useCarat";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: cart = [] } = useGetCart();
  const { data: addresses = [] } = useGetAddresses();

  const { mutate: placeCOD } = usePlaceCODOrder();
  const { mutateAsync: createPayment } = useOnlinePayment();
  const { mutate: verifyPayment } = useVerifyPayment();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [user]);

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
    if (!selectedAddress) {
      toast.error("Select address");
      return;
    }

    placeCOD({
      list_items: cart,
      addressId: selectedAddress,
      subTotalAmt: totals.after,
      totalAmt: totals.after,
    });

    router.push("/orders");
  };


  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Select address");
      return;
    }

    const res = await createPayment({
      list_items: cart,
      addressId: selectedAddress,
      subTotalAmt: totals.after,
      totalAmt: totals.after,
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
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

    router.push("/orders");
  };

  if (!user) return null;

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">

        {/* LEFT - ADDRESS */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Select Address</h2>

          <div className="space-y-3">
            {addresses.map((addr: any) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddress(addr._id)}
                className={`p-4 border rounded-xl cursor-pointer ${
                  selectedAddress === addr._id
                    ? "border-green-600 bg-green-50"
                    : ""
                }`}
              >
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state}</p>
                <p>{addr.postalCode}, {addr.country}</p>
                <p>{addr.mobile}</p>

                {addr.isDefault && (
                  <span className="text-green-600 text-sm font-semibold">
                    Default
                  </span>
                )}
              </div>
            ))}

            {addresses.length === 0 && (
              <p className="text-gray-500">No address found</p>
            )}
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{totals.qty}</span>
            </div>

            <div className="flex justify-between">
              <span>Total</span>
              <span>₹{totals.before.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{(totals.before - totals.after).toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Final</span>
              <span>₹{totals.after.toFixed(2)}</span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handlePayment}
              className="bg-[#16A34A] text-white py-3 rounded-xl"
            >
              Pay Online
            </button>

            <button
              onClick={handleCOD}
              className="border border-[#16A34A] text-[#16A34A] py-3 rounded-xl"
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}