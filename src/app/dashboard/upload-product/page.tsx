"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MoreDetails {
  shelf_life?: string;
  manufacturer_details?: string;
  country_of_origin?: string;
  key_features?: string[];
}

interface FormData {
  name: string;
  image: string[]; // changed to array
  category: string[];
  subCategory: string[];
  unit: string;
  stock: string;
  price: string;
  discount: string;
  description: string;
  more_details: MoreDetails;
  publish: string;
}

export default function ProductUploadPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
    publish: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<any[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/category`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success) setCategoryData(response.data.data);
    } catch (error: any) {
      toast.error("Error fetching categories", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load categories.",
      });
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async (categoryId: string) => {
    if (!categoryId) return setSubCategoryData([]);
    setLoadingSubCategories(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/subCategory/get-subcategory-by-categoryId`,
        { categoryId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) setSubCategoryData(response.data.data);
    } catch (error: any) {
      toast.error("Error fetching subcategories", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load subcategories.",
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
    const selected = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: selected ? [selected] : [],
      subCategory: [],
    }));
    fetchSubCategories(selected);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subCategory: selected ? [selected] : [],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Upload image(s)
  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0)
      return toast.error("Please select at least one image.");

    setUploadingImages(true);
    try {
      const uploadFormData = new FormData();
      images.forEach((img) => uploadFormData.append("file", img));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/upload/product`,
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Images uploaded successfully");
        setFormData((prev) => ({
          ...prev,
          image: response.data.data || [],
        }));
      }
    } catch (error: any) {
      toast.error("Upload error", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Image upload failed.",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle more_details field dynamically (optional)
  const handleMoreDetailsChange = (key: keyof MoreDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.image.length)
      return toast.error("Please upload at least one image.");

    setLoading(true);
    try {
      const submitData = {
        name: formData.name,
        image: formData.image,
        category: formData.category,
        subCategory: formData.subCategory,
        unit: formData.unit,
        stock: parseInt(formData.stock) || 0,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        description: formData.description,
        more_details: formData.more_details,
        publish: formData.publish === "true",
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product`,
        submitData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Product created successfully");
        router.push(`/product/${response.data.data._id}`);
        setFormData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
          publish: "",
        });
        setImages([]);
      }
    } catch (error: any) {
      toast.error("Submission error", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Upload Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Images */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Product Images
          </h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={uploadImage}
            disabled={uploadingImages}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-3"
          >
            {uploadingImages ? "Uploading..." : "Upload Images"}
          </button>
          {formData.image.length > 0 && (
            <p className="text-green-600 mt-2">✓ {formData.image.length} image(s) uploaded</p>
          )}
        </div>

        {/* Product Fields */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              id="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            />
            <select
              id="category"
              value={formData.category[0] || ""}
              onChange={handleCategoryChange}
              className="p-2 border rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categoryData.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              id="subCategory"
              value={formData.subCategory[0] || ""}
              onChange={handleSubCategoryChange}
              className="p-2 border rounded-md"
              disabled={!formData.category.length}
            >
              <option value="">Select Subcategory</option>
              {subCategoryData.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              id="unit"
              placeholder="Unit (e.g., 230ml)"
              value={formData.unit}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            />

            <input
              type="number"
              id="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            />

            <input
              type="number"
              id="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            />

            <input
              type="number"
              id="discount"
              placeholder="Discount"
              value={formData.discount}
              onChange={handleChange}
              className="p-2 border rounded-md"
            />

            <select
              id="publish"
              value={formData.publish}
              onChange={handleChange}
              className="p-2 border rounded-md"
              required
            >
              <option value="">Select Publish Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>

          <textarea
            id="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full mt-4 p-2 border rounded-md"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-md"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
