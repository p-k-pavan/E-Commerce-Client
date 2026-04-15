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

  // 🔥 modal state
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  if (isLoading) {
    return <div className="p-6">Loading addresses...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">
            Saved Addresses
          </h2>

          <button
            className="px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D]"
            onClick={() => {
              setEditData(null); // 🔥 add mode
              setOpenModal(true);
            }}
          >
            Add New Address
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses found</p>
          ) : (
            addresses.map((addr: any) => (
              <div
                key={addr._id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#16A34A] transition-colors"
              >
                <div className="flex items-start justify-between">
                  
                  {/* Address Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-[#111827]">
                        Address
                      </span>

                      {addr.isDefault && (
                        <span className="bg-[#16A34A] text-white px-3 py-1 rounded-lg text-xs font-medium">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-[#6B7280]">
                      {addr.street}, {addr.city}, {addr.state},{" "}
                      {addr.postalCode}, {addr.country}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Mobile: {addr.mobile}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditData(addr); // 🔥 edit mode
                        setOpenModal(true);
                      }}
                      className="p-2 text-[#16A34A] hover:bg-green-50 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddressModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
      />
    </>
  );
}