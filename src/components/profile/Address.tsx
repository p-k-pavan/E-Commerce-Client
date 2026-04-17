"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

import {
  useGetAddresses,
  useDeleteAddress,
} from "@/hooks/useAddress";
import AddressModal from "./AddressModal";


export default function AddressSection() {
  const { data: addresses = [], isLoading } = useGetAddresses();
  const { mutate: deleteAddress } = useDeleteAddress();
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your addresses...</div>;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#111827]">Saved Addresses</h2>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803D] transition-all"
            onClick={() => { setEditData(null); setOpenModal(true); }}
          >
            Add New Address
          </button>
        </div>

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
              No addresses found
            </div>
          ) : (
            addresses.map((addr: any) => (
              <div key={addr._id} className="border-2 border-gray-100 rounded-2xl p-4 md:p-6 hover:border-[#16A34A] transition-colors relative">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#111827]">Shipping Address</span>
                      {addr.isDefault && (
                        <span className="bg-[#16A34A] text-white px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-sm font-medium text-[#16A34A] mt-2">Mobile: {addr.mobile}</p>
                  </div>

                  <div className="flex md:flex-col lg:flex-row gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      onClick={() => { setEditData(addr); setOpenModal(true); }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[#16A34A] bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-bold md:hidden lg:block">Edit</span>
                    </button>
                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-bold md:hidden lg:block">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddressModal isOpen={openModal} onClose={() => setOpenModal(false)} editData={editData} />
    </>
  );
}