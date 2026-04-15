import axiosInstance from "@/lib/axiosInstance";

export const getAllAddresses = async () => {
  const res = await axiosInstance.get("/api/address");
  return res.data;
};

export const addAddress = async (data: {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobile: string;
  isDefault?: boolean;
}) => {
  const res = await axiosInstance.post("/api/address", data);
  return res.data;
};

export const updateAddress = async (
  id: string,
  data: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    mobile?: string;
    isDefault?: boolean;
  }
) => {
  const res = await axiosInstance.put(`/api/address/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id: string) => {
  const res = await axiosInstance.delete(`/api/address/${id}`);
  return res.data;
};