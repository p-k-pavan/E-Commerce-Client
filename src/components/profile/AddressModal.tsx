"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useAddAddress, useUpdateAddress } from "@/hooks/useAddress";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export default function AddressModal({ isOpen, onClose, editData }: AddressModalProps) {
  const { mutate: addAddress } = useAddAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const [form, setForm] = useState({
    street: "", city: "", state: "", postalCode: "", country: "", mobile: "", isDefault: false,
  });

  useEffect(() => {
    if (editData) setForm(editData);
    else setForm({ street: "", city: "", state: "", postalCode: "", country: "", mobile: "", isDefault: false });
  }, [editData, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
        <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 md:p-8 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">{editData ? "Edit Address" : "New Address"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="space-y-4">
            <input name="street" placeholder="Street Address" value={form.street} onChange={(e) => setForm({...form, street: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#16A34A] transition-colors" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="city" placeholder="City" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#16A34A]" />
              <input name="state" placeholder="State" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#16A34A]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({...form, postalCode: e.target.value})} className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#16A34A]" />
              <input name="country" placeholder="Country" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#16A34A]" />
            </div>

            <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#16A34A]" />

            <label className="flex items-center gap-3 mt-2 cursor-pointer group">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({...form, isDefault: e.target.checked})} className="w-5 h-5 accent-[#16A34A]" />
              <span className="text-sm font-medium text-[#4B5563] group-hover:text-[#111827]">Set as default address</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button onClick={onClose} className="flex-1 order-2 sm:order-1 border-2 border-gray-100 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
            <button 
              onClick={() => {
                if (editData) updateAddress({ id: editData._id, data: form });
                else addAddress(form);
                onClose();
              }}
              className="flex-1 order-1 sm:order-2 bg-[#16A34A] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-100"
            >
              {editData ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}