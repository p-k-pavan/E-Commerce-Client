import axiosInstance from "@/lib/axiosInstance";

// Get user cart
export const getCartItems = async () => {
  const res = await axiosInstance.get("/api/cart");
  return res.data;
};

// Add item to cart
export const addToCart = async (productId: string) => {
  const res = await axiosInstance.post("/api/cart", { productId });
  return res.data;
};

// Update cart item quantity
export const updateCartQty = async (_id: string, qty: number) => {
  const res = await axiosInstance.put("/api/cart", { _id, qty });
  return res.data;
};

// Delete cart item
export const deleteCartItem = async (_id: string) => {
  const res = await axiosInstance.delete("/api/cart", {
    data: { _id },
  });
  return res.data;
};


// Get guest cart
export const getGuestCart = async (guestId: string) => {
  const res = await axiosInstance.get("/api/cart/guest", {
    params: { guestId },
  });
  return res.data;
};

// Add to guest cart
export const addToGuestCart = async (productId: string, guestId: string) => {
  const res = await axiosInstance.post("/api/cart/guest", {
    productId,
    guestId,
  });
  return res.data;
};

// Update guest cart quantity
export const updateGuestCartQty = async (
  _id: string,
  guestId: string,
  qty: number
) => {
  const res = await axiosInstance.put("/api/cart/guest", {
    _id,
    guestId,
    qty,
  });
  return res.data;
};

// Delete guest cart item
export const deleteGuestCartItem = async (_id: string, guestId: string) => {
  const res = await axiosInstance.delete("/api/cart/guest", {
    data: { _id, guestId },
  });
  return res.data;
};

export const syncCart = async (items: any[]) => {
  const res = await axiosInstance.post("/api/cart/sync", { items });
  return res.data;
};