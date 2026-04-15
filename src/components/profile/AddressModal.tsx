"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useAddAddress, useUpdateAddress } from "@/hooks/useAddress";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any; // pass address object for edit
}

export default function AddressModal({
  isOpen,
  onClose,
  editData,
}: AddressModalProps) {
  const { mutate: addAddress } = useAddAddress();
  const { mutate: updateAddress } = useUpdateAddress();

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    mobile: "",
    isDefault: false,
  });

  // ✅ Prefill for edit
  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        mobile: "",
        isDefault: false,
      });
    }
  }, [editData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    // basic validation
    if (
      !form.street ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.country ||
      !form.mobile
    ) {
      alert("All fields are required");
      return;
    }

    if (editData) {
      updateAddress({
        id: editData._id,
        data: form,
      });
    } else {
      addAddress(form);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {editData ? "Edit Address" : "Add Address"}
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-3">

            <input
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="postalCode"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
            </div>

            <input
              name="mobile"
              placeholder="Mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            {/* Default checkbox */}
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>

          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 border py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#16A34A] text-white py-3 rounded-xl"
            >
              {editData ? "Update" : "Add Address"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}