'use client'

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SubCategory {
    _id: string;
    name: string;
    image: string;
}

interface FormData {
    name: string,
    image: string,
    category: string
}

export default function SubCategoryPage() {
    const params = useParams()
    const categoryId = params.id as string

    const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        image: "",
        category: categoryId
    });
    const [uploadingImages, setUploadingImages] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/subCategory/get-subcategory-by-categoryId`,
                {
                    categoryId: categoryId
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setSubCategoryData(response.data.data);
            }
        } catch (error: any) {
            toast("Error fetching categories", {
                description: error?.response?.data?.message || error?.message || "Failed to load categories.",
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImage(filesArray);
        }
    };


    const uploadImage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (image.length === 0) {
            toast("No images selected", {
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
                toast.success("Image uploaded successfully", {
                    description: response.data.message,
                });

                if (response.data.data && response.data.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        image: response.data.data[0]
                    }));
                }
            } else {
                toast.error("Upload failed", {
                    description: response.data.message || "Failed to upload image.",
                });
            }

        } catch (error: any) {
            toast.error("Upload error", {
                description: error?.response?.data?.message || error?.message || "An error occurred during image upload.",
            });
        } finally {
            setUploadingImages(false);
        }
    };

    const handleDeleteSubCategory = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this subCategory?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_BASE_URL}/subCategory/${categoryId}`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast("Category deleted successfully", {
                    description: response.data.message,
                });
                // Refresh Subcategories list
                fetchSubCategories();
            } else {
                toast("Failed to delete category", {
                    description: response.data.message || "Unknown error occurred.",
                });
            }
        } catch (error: any) {
            toast("Error deleting category", {
                description: error?.response?.data?.message || error?.message || "Failed to delete category.",
            });
        }
    };

    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.image) {
            toast.error("Missing required fields", {
                description: "Please provide both category name and image.",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/subCategory`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data.success === true) {
                toast.success("Category created successfully", {
                    description: response.data.message
                });

                // Reset form and hide create form
                setFormData({
                    name: "",
                    image: "",
                    category: categoryId
                });
                setImage([]);
                setShowCreateForm(false);

                // Refresh categories list
                fetchSubCategories();

            } else {
                toast.error("Failed to create category", {
                    description: response.data.message || "Unknown error occurred.",
                });
            }
        } catch (error: any) {
            toast.error("Error creating category", {
                description: error?.response?.data?.message || error?.message || "Failed to create category.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubCategories();
    }, [])


    return (
        <div className="container mx-auto p-4 lg:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">SubCategories</h1>
                    <p className="text-gray-600 mt-1">Manage your product Subcategories</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto text-center"
                >
                    {showCreateForm ? "Cancel" : "Create New SubCategory"}
                </button>
            </div>

            {/* Create Category Form */}
            {showCreateForm && (
                <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New SubCategory</h2>

                    <form onSubmit={handleSubmitCategory} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SubCategory Image *
                                </label>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        multiple={false}
                                    />

                                    <button
                                        type="button"
                                        onClick={uploadImage}
                                        disabled={uploadingImages || image.length === 0}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium w-full"
                                    >
                                        {uploadingImages ? "Uploading..." : "Upload Image"}
                                    </button>

                                    {formData.image && (
                                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Image uploaded successfully
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Category Name */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SubCategory Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter category name"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !formData.image}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium w-full"
                                >
                                    {loading ? "Creating..." : "Create Category"}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            )}


            <div className="mt-8">
                {subCategoryData.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No subCategories found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first category</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Create SubCategory
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                        {subCategoryData.map((category) => (
                            <div
                                key={category._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Image Section */}
                                <Link href={`/dashboard/category/${category._id}`}>
                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-400 text-sm">No Image</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Content Section */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <Link href={`/dashboard/category/${category._id}`} className="flex-1 min-w-0">
                                            <h4 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors">
                                                {category.name}
                                            </h4>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteSubCategory(category._id)}
                                            className="ml-3 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                                            title="Delete category"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}