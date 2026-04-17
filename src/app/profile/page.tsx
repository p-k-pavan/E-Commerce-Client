'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, Heart, LogOut, ChevronRight } from 'lucide-react';
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

  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || '',
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
    } else {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.mobile || '',
      });
    }
  }, [user, router]);

  const { mutate: updateUserMutation } = useUpdateUser();

  const handleSave = () => {
    updateUserMutation(editData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="max-w-360 mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-br from-[#16A34A] to-[#15803D] p-6 text-white text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 md:w-10 md:h-10 text-[#16A34A]" />
                </div>
                <h3 className="font-bold text-lg truncate">{user?.name}</h3>
                <p className="text-sm opacity-90 truncate">{user?.email}</p>
              </div>

              <div className="p-2 flex flex-row lg:flex-col overflow-x-auto no-scrollbar lg:overflow-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap mb-0 lg:mb-1 mr-2 lg:mr-0 ${
                        activeTab === tab.id
                          ? 'bg-[#16A34A] text-white'
                          : 'text-[#6B7280] hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
                <button 
                  className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-4" 
                  onClick={() => logoutMutation()}
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#111827]">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors w-full sm:w-auto"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 sm:flex-none px-4 py-2 border-2 border-gray-200 text-[#6B7280] rounded-xl font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-xl font-medium"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Full Name', name: 'name', value: user?.name, icon: User },
                    { label: 'Email Address', name: 'email', value: user?.email, icon: Mail },
                    { label: 'Phone Number', name: 'phone', value: user?.mobile, icon: Phone },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-[#6B7280] mb-2">{field.label}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData[field.name as keyof typeof editData]}
                          onChange={(e) => setEditData({...editData, [field.name]: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#16A34A] outline-none transition-colors"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                          <field.icon className="w-5 h-5 text-[#6B7280]" />
                          <span className="text-[#111827] font-medium">{field.value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <button 
                  className="lg:hidden w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-red-500 bg-red-50 font-bold mt-10" 
                  onClick={() => logoutMutation()}
                >
                  Logout Account
                </button>
              </div>
            )}

            {activeTab === 'addresses' && <AddressSection />}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center py-20">
                <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#111827]">Wishlist is empty</h3>
                <p className="text-[#6B7280]">Save items you like to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}