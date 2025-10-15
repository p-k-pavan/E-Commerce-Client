'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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


export default function AddToCartButton({ data , className}: AddToCartButtonProps) {
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
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
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
    <div className={`w-full max-w-[70px] ${className}`}>
      {isInCart ? (
        <div className="flex w-full h-full items-center justify-between border rounded-md bg-green-600 text-white overflow-hidden">
          <button
            onClick={handleDecrease}
            disabled={btnLoading || cartLoading}
            className="flex-1 py-1 cursor-pointer hover:bg-green-700 flex items-center justify-center"
          >
            <FaMinus />
          </button>

          <span className="flex-1 text-center font-semibold bg-white text-green-700 py-1">
            {qty}
          </span>

          <button
            onClick={handleIncrease}
            disabled={btnLoading || cartLoading}
            className="flex-1 py-1 cursor-pointer hover:bg-green-700 flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={btnLoading || cartLoading}
          className={`w-full py-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition ${className}`}
        >
          {btnLoading ? 'Adding…' : 'Add'}
        </button>
      )}
    </div>
  );
}
