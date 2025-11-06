import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  mobile: string;
  verify_email: boolean;
  last_login_date: string;
  status: string;
  address_details: any[];
  shopping_cart: any[];
  orderHistory: any[];
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = {
        _id: action.payload.user._id || '',
        name: action.payload.user.name || '',
        email: action.payload.user.email || '',
        avatar: action.payload.user.avatar || '',
        mobile: action.payload.user.mobile || '',
        verify_email: action.payload.user.verify_email || false,
        last_login_date: action.payload.user.last_login_date || new Date().toISOString(),
        status: action.payload.user.status || 'active',
        address_details: action.payload.user.address_details || [],
        shopping_cart: action.payload.user.shopping_cart || [],
        orderHistory: action.payload.user.orderHistory || [],
        role: action.payload.user.role || 'customer'
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
    },
    
    clearLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setCredentials, setLoading, logout, clearLoading } = authSlice.actions;
export default authSlice.reducer;