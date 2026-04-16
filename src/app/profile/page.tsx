'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import useAuthStore from '@/store/authStore';
import { useUpdateUser } from '@/hooks/useUser';
import AddressSection from '@/components/profile/Address';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuthStore();
  const router = useRouter();

  const { mutate: logoutMutation } = useLogout();

  const handleLogout = () => {
    logoutMutation();
  };

  const [editData, setEditData] = useState(
    {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      address: user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}, ${user.address.country}` : '',
    }
  );

  useEffect(() => {
    if (user) {
      setEditData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        address: user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}, ${user.address.country}` : '',
      });
    }else{
      toast.error("Please login first");
      router.push("/login");
    }
  }, [user]);

  const { mutate: updateUserMutation } = useUpdateUser();

  const handleSave = () => {
    updateUserMutation(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      address: user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}, ${user.address.country}` : '',
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const savedAddresses = [
    {
      id: 1,
      type: 'Home',
      address: '123 MG Road, Bangalore, Karnataka - 560001',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Office',
      address: '456 Whitefield, Bangalore, Karnataka - 560066',
      isDefault: false,
    },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">


      <main className="max-w-360 mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-linear-to-br from-[#16A34A] to-[#15803D] p-6 text-white">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-[#16A34A]" />
                </div>
                <h3 className="text-center font-bold text-lg">{user?.name}</h3>
                <p className="text-center text-sm opacity-90 mt-1">{user?.email}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-1 ${activeTab === tab.id
                        ? 'bg-[#16A34A] text-white'
                        : 'text-[#6B7280] hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-4" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#111827]">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border-2 border-gray-200 text-[#6B7280] rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <User className="w-5 h-5 text-[#6B7280]" />
                        <span className="text-[#111827]">{user?.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <Mail className="w-5 h-5 text-[#6B7280]" />
                        <span className="text-[#111827]">{user?.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <Phone className="w-5 h-5 text-[#6B7280]" />
                        <span className="text-[#111827]">{user?.mobile}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
                      Default Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#16A34A] transition-colors resize-none"
                      />
                    ) : (
                      <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-[#6B7280] mt-0.5" />
                        <span className="text-[#111827]">{user?.address?.street}</span>
                        <span className="text-[#111827]">{user?.address?.city}</span>
                        <span className="text-[#111827]">{user?.address?.state}</span>
                        <span className="text-[#111827]">{user?.address?.postalCode}</span>
                        <span className="text-[#111827]">{user?.address?.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <AddressSection />
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-[#111827] mb-6">My Wishlist</h2>
                <div className="text-center py-16">
                  <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#6B7280] text-lg">Your wishlist is empty</p>
                  <p className="text-[#6B7280] mt-2">Start adding your favorite items!</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

    </div>
  );
}