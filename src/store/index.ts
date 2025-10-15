import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import storage from './storage';
import authReducer, { logout } from './slices/authSlice';
import { isTokenExpired } from '../utils/checkTokenExpiry';
import cartReducer from './slices/cartSlice'

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'],
  version: 1,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['cart'],
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);


setInterval(() => {
  const state = store.getState() as RootState;
  const token = state.auth?.token;

  if (token && isTokenExpired(token)) {
    store.dispatch(logout());
    persistor.purge();
  }
}, 60000);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

