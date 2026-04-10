"use client";

import { useAddToCart, useGetCart, useUpdateCartQty } from "@/hooks/useCarat";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";



interface ProductCardProps {
  slug?: string;
  image: string;
  name: string;
  originalPrice: number;
  discount: number;
  productId: string;
}

export function ProductCard({
  slug,
  image,
  name,
  originalPrice,
  discount,
  productId,
}: ProductCardProps) {
  const router = useRouter();

  const { mutate: addToCart } = useAddToCart();
  const { mutate: updateQty } = useUpdateCartQty();
  const { data: cart } = useGetCart();

  const price = Math.round(originalPrice - (originalPrice * discount) / 100);

  const cartItem = cart?.find(
  (item: any) =>
    (item.productId?._id || item.productId) === productId
);

  const handleCardClick = () => {
    router.push(`/product/${slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(productId);
  };

 const handleIncrease = (e: React.MouseEvent) => {
  e.stopPropagation();

  if (!cartItem?._id) return; 

  updateQty({
    _id: cartItem._id,
    qty: cartItem.quantity + 1,
  });
};

const handleDecrease = (e: React.MouseEvent) => {
  e.stopPropagation();

  if (!cartItem?._id) return; 

  const newQty = cartItem.quantity - 1;

  updateQty({
    _id: cartItem._id,
    qty: newQty,
  });
};

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border border-gray-100"
    >
      <div className="relative mb-3">
        <div className="relative w-full h-44">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-xl"
            unoptimized
          />
        </div>

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#FACC15] text-[#111827] px-2.5 py-1 rounded-lg font-semibold text-sm">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-[#111827] text-sm line-clamp-2 min-h-10">
          {name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#111827] text-lg">
            ₹{price}
          </span>
          <span className="text-[#6B7280] text-sm line-through">
            ₹{originalPrice}
          </span>
        </div>

        {!cartItem ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#16A34A] text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#15803d]"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between bg-[#F3F4F6] rounded-xl px-3 py-2"
          >
            <button
              onClick={handleDecrease}
              className="p-1 bg-white rounded-md shadow"
            >
              <Minus size={16} />
            </button>

            <span className="font-medium text-[#111827]">
              {cartItem.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="p-1 bg-white rounded-md shadow"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}