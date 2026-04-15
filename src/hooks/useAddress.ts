import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/api/address";

export const useGetAddresses = () => {
  return useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await getAllAddresses();
      return res.addresses || [];
    },
  });
};


export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAddress,

    onSuccess: () => {
      toast.success("Address added successfully");
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to add address";
      toast.error(message);
    },
  });
};


export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) => updateAddress(id, data),

    onSuccess: () => {
      toast.success("Address updated");
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },

    onError: () => {
      toast.error("Failed to update address");
    },
  });
};


export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),

    onSuccess: () => {
      toast.success("Address deleted");
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },

    onError: () => {
      toast.error("Failed to delete address");
    },
  });
};