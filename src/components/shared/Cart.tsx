"use client";

import { useDeleteCartItem, useGetCart, useUpdateCartQty } from "@/hooks/useCarat";
import useAuthStore from "@/store/authStore";
import { X, Minus, Plus, Trash2 } from "lucide-react";
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
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[50%] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">My Cart</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6 space-y-4 overflow-y-auto h-[70%]">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            cart.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border p-3 rounded-xl"
              >
                <Image
                  src={item.productId?.image?.[0]}
                  className="w-20 h-20 object-cover rounded-lg"
                  width={80}
                  height={80}
                    alt={item.productId?.name}
                    unoptimized
                />

                <div className="flex-1">
                  <h4 className="font-medium">{item.productId?.name}</h4>
                  <p className="text-sm text-gray-500">
                    ₹{item.productId?.price}
                  </p>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQty({
                          _id: item._id,
                          qty: item.quantity - 1,
                        })
                      }
                      className="p-1 border rounded"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQty({
                          _id: item._id,
                          qty: item.quantity + 1,
                        })
                      }
                      className="p-1 border rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-6 border-t bg-white">
          <div className="flex justify-between mb-4 font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {user ? (
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-[#16A34A] text-white py-3 rounded-xl"
            >
              Proceed to Checkout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#16A34A] text-white py-3 rounded-xl"
            >
              Login to Checkout
            </button>
          )}
        </div>
      </div>
    </>
  );
}