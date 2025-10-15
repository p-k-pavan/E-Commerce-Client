import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
}

interface CartItem {
  _id: string;
  productId: CartProduct;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    updateCartItemQuantity: (state, action: PayloadAction<{_id: string, quantity: number}>) => {
      const item = state.cart.find(item => item._id === action.payload._id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setCartItems, 
  updateCartItemQuantity,
  removeCartItem,
  setCartLoading, 
  setCartError, 
  clearCartError 
} = cartSlice.actions;

export default cartSlice.reducer;