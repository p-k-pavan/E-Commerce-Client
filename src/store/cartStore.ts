import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getCartItems,
  addToCart,
  updateCartQty,
  deleteCartItem,

  getGuestCart,
  addToGuestCart,
  updateGuestCartQty,
  deleteGuestCartItem,

  syncCart,
} from "@/api/cart";
import useAuthStore from "./authStore";


type CartItem = {
  _id: string;
  productId: any;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  loading: boolean;

  // Fetch cart
  fetchCart: () => Promise<void>;

  // Add item
  addItem: (productId: string) => Promise<void>;

  // Update quantity
  updateQty: (_id: string, qty: number) => Promise<void>;

  // Delete item
  deleteItem: (_id: string) => Promise<void>;

  // Sync guest → user
  syncCartToUser: () => Promise<void>;

  // Clear cart
  clearCart: () => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,

      // =========================
      // FETCH
      // =========================
      fetchCart: async () => {
        set({ loading: true });

        const user = useAuthStore.getState().user;

        try {
          if (user) {
            const res = await getCartItems();
            set({ cart: res.cart });
          } else {
            const guestId = localStorage.getItem("guestId");
            if (!guestId) return;

            const res = await getGuestCart(guestId);
            set({ cart: res.cart });
          }
        } catch (error) {
          console.error("Fetch cart error", error);
        } finally {
          set({ loading: false });
        }
      },

      // =========================
      // ADD ITEM (⚡ OPTIMISTIC)
      // =========================
      addItem: async (productId) => {
        const user = useAuthStore.getState().user;

        // 🔥 instant UI update
        set((state) => {
          const existing = state.cart.find(
            (item) =>
              (item.productId?._id || item.productId) === productId
          );

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item._id === existing._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                _id: "temp-" + Date.now(),
                productId: { _id: productId },
                quantity: 1,
              },
            ],
          };
        });

        try {
          if (user) {
            await addToCart(productId);
          } else {
            let guestId = localStorage.getItem("guestId");

            if (!guestId) {
              guestId = crypto.randomUUID();
              localStorage.setItem("guestId", guestId);
            }

            await addToGuestCart(productId, guestId);
          }

          // 🔥 optional sync (not blocking UI)
          get().fetchCart();
        } catch (error) {
          console.error("Add item error", error);
        }
      },

      // =========================
      // UPDATE QTY (⚡ INSTANT)
      // =========================
      updateQty: async (_id, qty) => {
        const user = useAuthStore.getState().user;

        // 🔥 instant UI
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item._id === _id ? { ...item, quantity: qty } : item
            )
            .filter((item) => item.quantity > 0),
        }));

        try {
          if (user) {
            await updateCartQty(_id, qty);
          } else {
            const guestId = localStorage.getItem("guestId");
            if (!guestId) return;

            await updateGuestCartQty(_id, guestId, qty);
          }

          get().fetchCart();
        } catch (error) {
          console.error("Update qty error", error);
        }
      },

      // =========================
      // DELETE (⚡ INSTANT)
      // =========================
      deleteItem: async (_id) => {
        const user = useAuthStore.getState().user;

        // 🔥 instant UI
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== _id),
        }));

        try {
          if (user) {
            await deleteCartItem(_id);
          } else {
            const guestId = localStorage.getItem("guestId");
            if (!guestId) return;

            await deleteGuestCartItem(_id, guestId);
          }

          get().fetchCart();
        } catch (error) {
          console.error("Delete item error", error);
        }
      },

      // =========================
      // SYNC
      // =========================
      syncCartToUser: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          const guestId = localStorage.getItem("guestId");
          if (!guestId) return;

          const res = await getGuestCart(guestId);

          if (res.cart.length > 0) {
            const items = res.cart.map((item: CartItem) => ({
              productId: item.productId._id,
              quantity: item.quantity,
            }));

            await syncCart(items);
            localStorage.removeItem("guestId");
          }

          get().fetchCart();
        } catch (error) {
          console.error("Sync error", error);
        }
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "cart-store",
    }
  )
);

export default useCartStore;