'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "sonner";

interface FormData {
  name: string;
  image: string;
  category: string;
  subCategory: string;
  unit: string;
  stock: string;
  price: string;
  discount: string;
  description: string;
  more_details: string;
  publish: string;
}

export default function ProductUploadPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: "",
    category: "",
    subCategory: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: "",
    publish: ""
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const router = useRouter();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Fetch categories on component mount
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/category`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setCategoryData(response.data.data);
      }
    } catch (error: any) {
      toast.error("Error fetching categories", {
        description: error?.response?.data?.message || error?.message || "Failed to load categories.",
      });
    }
  };

  // Fetch subcategories only when a category is selected
  const fetchSubCategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubCategoryData([]);
      return;
    }

    setLoadingSubCategories(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/subCategory/get-subcategory-by-categoryId`,
        { categoryId }, // Send as object instead of raw string
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSubCategoryData(response.data.data);
      }
    } catch (error: any) {
      toast.error("Error fetching subcategories", {
        description: error?.response?.data?.message || error?.message || "Failed to load subcategories.",
      });
      setSubCategoryData([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      category: selectedCategory, 
      subCategory: "" // Reset subcategory when category changes
    }));
    fetchSubCategories(selectedCategory);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubCategory = e.target.value;
    setFormData(prev => ({ ...prev, subCategory: selectedSubCategory }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  // Upload images to server
  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error("No images selected", {
        description: "Please select at least one image to upload.",
      });
      return;
    }

    setUploadingImages(true);
    try {
      const uploadFormData = new FormData();
      images.forEach((image) => {
        uploadFormData.append('file', image);
      });

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
        toast.success("Images uploaded successfully", {
          description: response.data.message,
        });
        
        // Set the first uploaded image URL to formData
        if (response.data.data && response.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            image: response.data.data[0]
          }));
        }
      } else {
        toast.error("Upload failed", {
          description: response.data.message || "Failed to upload images.",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.image) {
      toast.error("Missing image", {
        description: "Please upload at least one product image before submitting.",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        stock: parseInt(formData.stock) || 0,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        publish: formData.publish === "true"
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success("Product created successfully", {
          description: response.data.message,
        });
        
        // Reset form after successful submission
        setFormData({
          name: "",
          image: "",
          category: "",
          subCategory: "",
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: "",
          publish: ""
        });
        setImages([]);
        setSubCategoryData([]);
        
        // Navigate to product detail page
        router.push(`/product/${response.data.data._id}`);
      } else {
        toast.error("Submission failed", {
          description: response.data.message || "Failed to create product.",
        });
      }

    } catch (error: any) {
      toast.error("Submission error", {
        description: error?.response?.data?.message || error?.message || "An error occurred while creating the product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Upload Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Images</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-sm text-gray-500 mt-1">
              {images.length} image(s) selected
            </p>
          </div>

          <button
            type="button"
            onClick={uploadImage}
            disabled={uploadingImages || images.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {uploadingImages ? "Uploading..." : "Upload Images"}
          </button>

          {formData.image && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 font-medium">✓ Image uploaded successfully</p>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleCategoryChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Category</option>
                {categoryData.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category
              </label>
              <select
                id="subCategory"
                value={formData.subCategory}
                onChange={handleSubCategoryChange}
                disabled={!formData.category || loadingSubCategories}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
              >
                <option value="">
                  {loadingSubCategories ? "Loading subcategories..." : "Select Sub Category"}
                </option>
                {subCategoryData.map((sub: any) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <input
                type="text"
                id="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                placeholder="e.g., kg, piece, packet"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Publish Status */}
            <div>
              <label htmlFor="publish" className="block text-sm font-medium text-gray-700 mb-1">
                Publish Status *
              </label>
              <select
                id="publish"
                value={formData.publish}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Status</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter product description"
            />
          </div>

          {/* More Details */}
          <div className="mt-4">
            <label htmlFor="more_details" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              id="more_details"
              value={formData.more_details}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter any additional product details"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.image}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}