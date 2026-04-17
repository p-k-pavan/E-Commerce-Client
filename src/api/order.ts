import axiosInstance from "@/lib/axiosInstance";

export const placeCODOrder = async (data: {
  list_items: any[];
  totalAmt: number;
  addressId: string;
  subTotalAmt: number;
}) => {
  const res = await axiosInstance.post("/api/order", data);
  return res.data;
};


export const createOnlinePayment = async (data: {
  list_items: any[];
  totalAmt: number;
  addressId: string;
  subTotalAmt: number;
}) => {
  const res = await axiosInstance.post("/api/order/online-payment", data);
  return res.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: any;
}) => {
  const res = await axiosInstance.post("/api/order/verify-payment", data);
  return res.data;
};

export const getOrders = async () => {
  const res = await axiosInstance.get("/api/order");
  return res.data;
};

export const getOrderById = async (id: string) => {
  const res = await axiosInstance.get(`/api/order/${id}`);
  return res.data;
};