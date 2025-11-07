'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios, { AxiosError } from "axios";
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner";
import { FiUser, FiMail, FiPhone, FiCamera, FiSave, FiEdit, FiX } from "react-icons/fi";
import { TbUserEdit } from "react-icons/tb";
import { setCredentials, setLoading, clearLoading } from "@/store/slices/authSlice";
import Image from "next/image";

interface FormData {
    name: string;
    email: string;
    mobile: string;
    avatar: string;
}

export default function ProfilePage() {
    const { user, token } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        mobile: "",
        avatar: ""
    });

    const Token = token;

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
                avatar: user.avatar || ""
            });
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setImage(filesArray);

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target?.result as string
                }));
            };
            reader.readAsDataURL(filesArray[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (image.length === 0) {
            toast.error("No image selected", {
                description: "Please select one image to upload.",
            });
            return;
        }

        if (image.length > 1) {
            toast.error("Multiple images selected", {
                description: "Please select only one image to upload.",
            });
            return;
        }

        setUploadingImages(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', image[0]);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/upload/product`,
                uploadFormData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                toast.success("Profile picture updated successfully", {
                    description: response.data.message,
                });

                if (response.data.data && response.data.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        avatar: response.data.data[0]
                    }));
                }
                setImage([]);
            } else {
                toast.error("Upload failed", {
                    description: response.data.message || "Failed to upload image.",
                });
            }

        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const msg = axiosError.response?.data?.message || 'An error occurred.';
            toast.error(msg);
        } finally {
            setUploadingImages(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully", {
                    description: response.data.message,
                });
                setIsEditing(false);
                const userData = {
                    _id: response.data.user._id || "",
                    name: response.data.user.name || formData.name,
                    email: response.data.user.email || formData.email,
                    avatar: response.data.user.avatar || "",
                    mobile: response.data.user.mobile || "",
                    verify_email: response.data.user.verify_email || false,
                    last_login_date: response.data.user.last_login_date || new Date().toISOString(),
                    status: response.data.user.status || "active",
                    address_details: response.data.user.address_details || [],
                    shopping_cart: response.data.user.shopping_cart || [],
                    orderHistory: response.data.user.orderHistory || [],
                    role: response.data.user.role || "customer"
                };
                dispatch(setCredentials({
                    user: userData,
                    token: Token || ""
                }));
            } else {
                toast.error("Update failed", {
                    description: response.data.message || "Failed to update profile.",
                });
            }

        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const msg = axiosError.response?.data?.message || 'An error occurred.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
                avatar: user.avatar || ""
            });
        }
        setIsEditing(false);
        setImage([]);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold relative overflow-hidden">
                                        {formData.avatar ? (
                                            <Image
                                                src={formData.avatar}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="w-12 h-12" />
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                                <FiCamera className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <button
                                            onClick={triggerFileInput}
                                            className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                                        >
                                            <FiCamera className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    {formData.name || "User"}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">{formData.email}</p>

                                {isEditing && image.length > 0 && (
                                    <div className="space-y-3">
                                        <button
                                            onClick={uploadImage}
                                            disabled={uploadingImages}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                        >
                                            {uploadingImages ? "Uploading..." : "Save Picture"}
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.role === "ADMIN"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-green-100 text-green-800"
                                        }`}>
                                        {user.role === "ADMIN" ? "Administrator" : "Customer"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Account Info</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Member since</span>
                                    <span className="text-gray-900 text-sm font-medium">

                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Status</span>
                                    <span className="text-green-600 text-sm font-medium">Active</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Verified</span>
                                    <span className="text-green-600 text-sm font-medium">Yes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        <TbUserEdit className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={cancelEdit}
                                            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                        >
                                            <FiX className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={updateProfile}
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                        >
                                            <FiSave className="w-4 h-4" />
                                            {loading ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={updateProfile} className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FiUser className="w-4 h-4 text-gray-400" />
                                                Full Name
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FiMail className="w-4 h-4 text-gray-400" />
                                                Email Address
                                            </div>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={true}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                                            placeholder="Enter your email address"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Email address cannot be changed</p>
                                    </div>

                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FiPhone className="w-4 h-4 text-gray-400" />
                                                Mobile Number
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            id="mobile"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}