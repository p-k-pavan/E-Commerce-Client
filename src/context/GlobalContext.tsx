'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  setCartItems,
  setCartLoading,
  setCartError,
} from '@/store/slices/cartSlice';
import { useAppSelector } from '@/store/hooks';

interface GlobalContextType {
  fetchCartItems: () => Promise<void>;
  updateCartItem: (_id: string, qty: number) => Promise<{ success: boolean }>;
  deleteCartItem: (_id: string) => Promise<{ success: boolean }>;
}

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0)
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const { cart, loading: cartLoading } = useAppSelector((state) => state.cart);

  const fetchCartItems = async (): Promise<void> => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      if (res.data?.cart) dispatch(setCartItems(res.data.cart));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch cart items';
      dispatch(setCartError(msg));
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  const updateCartItem = async (
    _id: string,
    qty: number
  ): Promise<{ success: boolean }> => {
    try {
      dispatch(setCartLoading(true));
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        { _id, qty },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      await fetchCartItems();
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update cart item';
      dispatch(setCartError(msg));
      return { success: false };
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  const deleteCartItem = async (
    _id: string
  ): Promise<{ success: boolean }> => {
    try {
      dispatch(setCartLoading(true));
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        data: { _id },
      });

      await fetchCartItems();
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete cart item';
      dispatch(setCartError(msg));
      return { success: false };
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  useEffect(()=>{
    const qty = cart.reduce((prev,curr)=>{
      return prev + curr.quantity
    },0)
    setTotalQty(qty);
    
  },[cart])

  const value: GlobalContextType = {
    fetchCartItems,
    updateCartItem,
    deleteCartItem,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};


export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};
