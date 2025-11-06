"use client";

import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/GlobalContext";

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobile: string;
  isDefault: boolean;
}

export default function Page() {
  const [address, setAddress] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const { fetchCartItems } = useGlobalContext();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Address>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    mobile: "",
    isDefault: false,
  });

  const router = useRouter();

  // 🏠 Fetch Address
  const fetchAddress = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/address`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success) {
        setAddress(response.data.addresses);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch addresses");
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // 🏡 Add New Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.mobile) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/address`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Address added successfully");
        setShowForm(false);
        setFormData({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          mobile: "",
          isDefault: false,
        });
        fetchAddress();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to add address");
    }
  };

  const { cart } = useAppSelector((state) => state.cart);
  const [totalQty, setTotalQty] = useState(0);
  const [totals, setTotals] = useState({
    beforeDiscount: 0,
    afterDiscount: 0,
    totalDiscount: 0,
  });

  useEffect(() => {
    if (!cart || cart.length === 0) return;

    let before = 0,
      after = 0;
    cart.forEach((item) => {
      const { price, discount } = item.productId;
      const quantity = item.quantity;
      const itemBefore = price * quantity;
      const itemDiscountAmount = (price * (discount || 0)) / 100;
      const itemAfter = (price - itemDiscountAmount) * quantity;
      before += itemBefore;
      after += itemAfter;
    });

    setTotals({
      beforeDiscount: before,
      afterDiscount: after,
      totalDiscount: before - after,
    });

    const qty = cart.reduce((prev, curr) => prev + curr.quantity, 0);
    setTotalQty(qty);
  }, [cart]);

  const handleCashOnDelivery = async () => {
    if (selectedAddressIndex === null) {
      toast.error("Please select an address before placing the order");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
        {
          list_items: cart,
          addressId: address[selectedAddressIndex]?._id,
          subTotalAmt: totals.afterDiscount,
          totalAmt: totals.afterDiscount,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully");
        await fetchCartItems();
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Order failed");
    }
  };

  const handleOnlinePayment = async () => {
    toast.info("Online payment feature coming soon");
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Choose your address</h3>
          <div className="bg-white p-3 grid gap-4 rounded shadow-sm">
            {address.length > 0 ? (
              address.map((add, index) => (
                <div
                  key={add._id}
                  onClick={() => setSelectedAddressIndex(index)}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedAddressIndex === index ? "border-green-600 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <p>{add.street}</p>
                  <p>
                    {add.city}, {add.state}
                  </p>
                  <p>
                    {add.postalCode}, {add.country}
                  </p>
                  <p>{add.mobile}</p>
                  {add.isDefault && <p className="text-green-600 font-semibold">Default</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No addresses found. Please add one below.</p>
            )}

            <div
              onClick={() => setShowForm(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer hover:bg-blue-100 text-blue-600 font-semibold rounded"
            >
              + Add Address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold mb-3">Bill details</h3>
            <div className="flex justify-between text-sm mb-2">
              <p>Items total</p>
              <p>
                <span className="line-through text-neutral-400 mr-2">
                  ₹{totals.beforeDiscount.toFixed(2)}
                </span>
                ₹{totals.afterDiscount.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <p>Quantity total</p>
              <p>{totalQty} item{totalQty > 1 ? "s" : ""}</p>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <p>Delivery Charge</p>
              <p className="text-green-600">Free</p>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <p>Grand Total</p>
              <p>₹{totals.afterDiscount.toFixed(2)}</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-3">
            <button
              className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>

            <button
              className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded"
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

            <form onSubmit={handleAddAddress} className="grid gap-3">
              <input
                type="text"
                placeholder="Street"
                name="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="border p-2 rounded w-full"
              />

              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
                Set as default address
              </label>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
