import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  placeCODOrder,
  createOnlinePayment,
  verifyPayment,
  getOrders,
  getOrderById,
} from "@/api/order";

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await getOrders();
      return res.data || [];
    },
  });
};

export const usePlaceCODOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeCODOrder,

    onSuccess: () => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Failed to place order");
    },
  });
};


export const useOnlinePayment = () => {
  return useMutation({
    mutationFn: createOnlinePayment,

    onError: () => {
      toast.error("Payment initiation failed");
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,

    onSuccess: () => {
      toast.success("Payment successful & order placed");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Payment verification failed");
    },
  });
};

export const useGetOrderById = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await getOrderById(id);
      return res.data;
    },
    enabled: !!id,
  });
};