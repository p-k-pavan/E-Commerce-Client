'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  setCartItems,
  setCartLoading,
  setCartError,
} from '@/store/slices/cartSlice';

// --- Types ---
interface GlobalContextType {
  fetchCartItems: () => Promise<void>;
  updateCartItem: (_id: string, qty: number) => Promise<{ success: boolean }>;
  deleteCartItem: (_id: string) => Promise<{ success: boolean }>;
}

interface GlobalProviderProps {
  children: ReactNode;
}

// --- Create context ---
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// --- Provider ---
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  // 🛒 Fetch all cart items
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
      console.error('❌ Fetch cart error:', msg);
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  // ♻️ Update quantity
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

      // refresh cart state
      await fetchCartItems();
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update cart item';
      dispatch(setCartError(msg));
      console.error('❌ Update cart error:', msg);
      return { success: false };
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  // 🗑️ Delete item
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
      console.error('❌ Delete cart error:', msg);
      return { success: false };
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  const value: GlobalContextType = {
    fetchCartItems,
    updateCartItem,
    deleteCartItem,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

// --- Custom hook ---
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};
