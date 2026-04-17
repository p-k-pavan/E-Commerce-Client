"use client";

import { useDeleteCartItem, useGetCart, useUpdateCartQty } from "@/hooks/useCarat";
import useAuthStore from "@/store/authStore";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: cart = [] } = useGetCart();
  const { mutate: updateQty } = useUpdateCartQty();
  const { mutate: deleteItem } = useDeleteCartItem();

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.quantity * (item.productId?.price || 0),
    0
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 md:w-125 bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 md:p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-[#16A34A]" size={24} />
            <h2 className="text-xl font-bold text-[#111827]">My Cart</h2>
            <span className="bg-green-100 text-[#16A34A] text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {cart.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="text-[#6B7280]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                 <ShoppingCart size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Your cart is empty</h3>
              <p className="text-[#6B7280] text-sm mt-1">Looks like you haven't added anything to your cart yet.</p>
              <button 
                onClick={onClose}
                className="mt-6 text-[#16A34A] font-bold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border border-gray-100 p-3 rounded-2xl hover:border-green-100 transition-colors"
              >
                <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-50">
                    <Image
                    src={item.productId?.image?.[0]}
                    className="object-contain p-1"
                    fill
                    alt={item.productId?.name}
                    unoptimized
                    />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#111827] truncate text-sm md:text-base">
                    {item.productId?.name}
                  </h4>
                  <p className="text-sm font-bold text-[#16A34A] mt-0.5">
                    ₹{item.productId?.price}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                        <button
                        onClick={() => updateQty({ _id: item._id, qty: Math.max(0, item.quantity - 1) })}
                        className="p-2 hover:bg-gray-200 transition-colors text-[#6B7280]"
                        >
                        <Minus size={14} />
                        </button>

                        <span className="w-8 text-center font-bold text-sm text-[#111827]">
                            {item.quantity}
                        </span>

                        <button
                        onClick={() => updateQty({ _id: item._id, qty: item.quantity + 1 })}
                        className="p-2 hover:bg-gray-200 transition-colors text-[#6B7280]"
                        >
                        <Plus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="shrink-0 p-6 border-t bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[#6B7280] text-sm font-medium">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#111827] font-bold text-xl">
                <span>Total Amount</span>
                <span className="text-[#16A34A]">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => {
              router.push(user ? "/checkout" : "/login");
              onClose();
            }}
            className="w-full bg-[#16A34A] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#15803D] transition-all shadow-lg shadow-green-100 active:scale-[0.98]"
          >
            {user ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
          
          <p className="text-center text-[10px] text-[#9CA3AF] mt-4 uppercase tracking-widest font-bold">
            Secure Checkout by Namma Mart
          </p>
        </div>
      </div>
    </>
  );
}