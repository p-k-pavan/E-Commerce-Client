import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
import useAuthStore from "@/store/authStore";

export const useGetCart = () => {
  const user = useAuthStore((state:any) => state.user);

  return useQuery({
    queryKey: ["cart", user],
    queryFn: async () => {
      if (user) {
        const res = await getCartItems();
        return res.cart;
      } else {
        const guestId = localStorage.getItem("guestId");
        if (!guestId) return [];

        const res = await getGuestCart(guestId);
        return res.cart;
      }
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state:any) => state.user);

  return useMutation({
    mutationFn: async (productId: string) => {
      if (user) {
        return await addToCart(productId);
      } else {
        let guestId = localStorage.getItem("guestId");

        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("guestId", guestId);
        }

        return await addToGuestCart(productId, guestId);
      }
    },

    onSuccess: () => {
      toast.success("Item added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to add item";
      toast.error(message);
    },
  });
};

export const useUpdateCartQty = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state:any) => state.user);

  return useMutation({
    mutationFn: async ({
      _id,
      qty,
    }: {
      _id: string;
      qty: number;
    }) => {
      if (user) {
        return await updateCartQty(_id, qty);
      } else {
        const guestId = localStorage.getItem("guestId");
        if (!guestId) return;

        return await updateGuestCartQty(_id, guestId, qty);
      }
    },

    onSuccess: () => {
      toast.success("Cart updated");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Failed to update cart");
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state:any) => state.user);

  return useMutation({
    mutationFn: async (_id: string) => {
      if (user) {
        return await deleteCartItem(_id);
      } else {
        const guestId = localStorage.getItem("guestId");
        if (!guestId) return;

        return await deleteGuestCartItem(_id, guestId);
      }
    },

    onSuccess: () => {
      toast.success("Item removed");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Failed to delete item");
    },
  });
};


export const useSyncCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const guestId = localStorage.getItem("guestId");
      if (!guestId) return;

      const res = await getGuestCart(guestId);

      if (!res.cart.length) return;

      const items = res.cart.map((item: any) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      await syncCart(items);

      localStorage.removeItem("guestId");
    },

    onSuccess: () => {
      toast.success("Cart synced");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Cart sync failed");
    },
  });
};