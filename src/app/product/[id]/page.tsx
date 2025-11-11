"use client"
import AddToCartButton from "@/components/AddToCart"
import { useAppSelector } from "@/store/hooks"
import axios, { AxiosError } from "axios"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { 
  Truck, 
  Shield, 
  RotateCcw, 
  Star, 
  Package,
  Heart,
  Share2
} from "lucide-react"

interface Product {
  _id: string
  name: string
  image: string[]
  category: string[]
  subCategory: string[]
  unit: string
  stock: number
  size: string | null
  price: number
  discount: number
  description: string
  publish: boolean
  __v: number
}

export default function ProductDetail() {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { user } = useAppSelector((state) => state.auth);

  const params = useParams()
  const productId = params.id as string

  const fetchdata = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      if (response.data.success === true) {
        setData(response.data.productData)
      } else if (response.data.error === true) {
        toast.error("Failed to fetch product details")
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || 'An error occurred.';
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchdata()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="grid grid-cols-6 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const discountedPrice = data.price - (data.price * data.discount) / 100
  const savings = data.price - discountedPrice

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }
    
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      if (response.data.success == true) {
        toast.success("Product deleted successfully")
        // Redirect to home or products page
        window.location.href = '/'
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || 'An error occurred.';
      toast.error(msg);
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.name,
          text: data.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{data.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg relative">
              <Image
                src={data.image[selectedImage] || "/placeholder.svg"}
                alt={data.name}
                width={800}
                height={800}
                className="w-full h-full object-contain p-4"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {data.discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {data.discount}% OFF
                  </span>
                )}
                {data.stock < 10 && data.stock > 0 && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Low Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {data.image.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {data.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                      selectedImage === index
                        ? "border-emerald-500 shadow-md scale-105"
                        : "border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${data.name} ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                  {data.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                      <Star 
                        key={star} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8 • 127 reviews)</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isWishlisted 
                      ? "bg-red-50 border-red-200 text-red-500" 
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-emerald-500 pl-4 bg-white/50 py-2 rounded-r-lg">
              {data.description}
            </p>

            {/* Price Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 flex-wrap mb-3">
                <span className="text-4xl font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
                
                {data.discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">₹{data.price.toFixed(2)}</span>
                    <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Save {data.discount}%
                    </span>
                  </>
                )}
              </div>

              {data.discount > 0 && (
                <p className="text-emerald-600 font-semibold text-lg">
                  You save ₹{savings.toFixed(2)}
                </p>
              )}

              <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes • Free shipping</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailCard 
                title="Unit Size" 
                value={data.unit}
                icon={<Package className="w-5 h-5" />}
              />
              <DetailCard 
                title="Stock Status" 
                value={data.stock > 0 ? `${data.stock} available` : "Out of Stock"}
                icon={data.stock > 0 ? 
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> : 
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                }
              />
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Product Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Quality assured</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>72-Hour Replacement</span>
                </div>
              </div>
            </div>

            {/* Actions */}
<div className="flex gap-4 pt-4 flex-col sm:flex-row sticky bottom-4 z-10">
  {user?.role === "ADMIN" ? (
    <div className="flex gap-3">
      <button
        onClick={() => handleDelete(data._id)}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Delete Product
      </button>
      <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300">
        Edit Product
      </button>
    </div>
  ) : data.stock === 0 ? (
    <button
      className="w-full bg-gray-300 text-gray-500 px-8 py-4 rounded-xl font-semibold cursor-not-allowed shadow-inner"
    >
      Out of Stock
    </button>
  ) : (
    <div className="flex gap-3 w-full flex-col sm:flex-row">
      <AddToCartButton 
        data={data} 
        className="w-full sm:flex-1"
      />
      <button className="w-full sm:flex-1 bg-white border-2 border-emerald-500 text-emerald-600 px-6 py-1 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-sm text-sm ">
        Buy Now
      </button>
    </div>
  )}
</div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Return Policy */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Return & Replacement</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-700">
                  <strong className="text-gray-900">72-Hour Replacement</strong> for damaged, defective, or incorrect items
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-700">
                  <strong className="text-gray-900">Condition:</strong> Item must be sealed, unopened, and in original packaging
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-gray-700">
                  <strong className="text-gray-900">Non-returnable:</strong> This item cannot be returned if opened or used
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Shipping Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold text-gray-900">5-7 Business Days</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold text-gray-900">Standard Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailCard({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-200 group cursor-pointer">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          <p className="text-gray-600 text-sm">{value}</p>
        </div>
      </div>
    </div>
  )
}