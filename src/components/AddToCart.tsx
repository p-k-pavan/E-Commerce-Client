'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { useAppSelector } from '@/store/hooks';
import { useGlobalContext } from '@/context/GlobalContext';

interface ProductData {
  _id: string;
}

interface CartItem {
  _id: string;
  productId: { _id: string };
  quantity: number;
}

interface AddToCartButtonProps {
  data: ProductData;
  className?: string; 
}

export default function AddToCartButton({ data, className = "" }: AddToCartButtonProps) {
  const { fetchCartItems, updateCartItem, deleteCartItem } = useGlobalContext();
  const { cart, loading: cartLoading } = useAppSelector((state) => state.cart);

  const [isInCart, setIsInCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemId, setCartItemId] = useState<string | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  // Sync local state with Redux cart
  useEffect(() => {
    const item = cart?.find((i: CartItem) => i.productId?._id === data._id);
    if (item) {
      setIsInCart(true);
      setQty(item.quantity);
      setCartItemId(item._id);
    } else {
      setIsInCart(false);
      setQty(0);
      setCartItemId(null);
    }
  }, [cart, data._id]);

  const handleAddToCart = async () => {
    try {
      setBtnLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        { productId: data._id },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Item added to cart');
        await fetchCartItems();
      } else {
        toast.error(res.data.message || 'Failed to add item');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || 'Something went wrong.';
      toast.error(msg);
    } finally {
      setBtnLoading(false);
    }
  };

  // 🔼 Increase qty
  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItemId) return;

    setBtnLoading(true);
    const res = await updateCartItem(cartItemId, qty + 1);
    if (res.success) toast.success('Quantity increased');
    else toast.error('Failed to increase quantity');
    setBtnLoading(false);
  };

  // 🔽 Decrease qty / delete
  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItemId) return;

    setBtnLoading(true);
    if (qty === 1) {
      const res = await deleteCartItem(cartItemId);
      if (res.success) toast.success('Item removed');
      else toast.error('Failed to remove item');
    } else {
      const res = await updateCartItem(cartItemId, qty - 1);
      if (res.success) toast.success('Quantity decreased');
      else toast.error('Failed to decrease quantity');
    }
    setBtnLoading(false);
  };

  return (
    <div className={`${className}`}>
      {isInCart ? (
        <div className="flex items-center justify-between border-2 border-emerald-500 rounded-lg bg-emerald-500 text-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 min-w-[120px]">
          <button
            onClick={handleDecrease}
            disabled={btnLoading || cartLoading}
            className="py-2 px-3 cursor-pointer flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMinus className="w-3 h-3" />
          </button>

          <span className="px-2 text-center font-semibold bg-white text-emerald-700 py-2 text-sm min-w-[30px]">
            {qty}
          </span>

          <button
            onClick={handleIncrease}
            disabled={btnLoading || cartLoading}
            className="py-2 px-3 cursor-pointer flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={btnLoading || cartLoading}
          className={`py-2 px-4 cursor-pointer bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm ${className}`}
        >
          {btnLoading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Add
            </span>
          ) : (
            'Add'
          )}
        </button>
      )}
    </div>
  );
}