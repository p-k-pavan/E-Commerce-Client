"use client"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
  more_details: {
    type?: string
    shelf_life?: string
    nutrition_information?: any
    country_of_origin?: string
    fssai_license?: string
    key_features?: string[]
    manufacturer_details?: string
    marketed_by?: string
    customer_care_details?: {
      email?: string
    }
    return_policy?: {
      policy?: string
      conditions?: string[]
    }
    seller?: string
    seller_fssai?: string
    disclaimer?: string
  }
  publish: boolean
  sellerName: string
  sellerId: string
  createdAt: string
  updatedAt: string
  __v: number
}

export default function ProductDetail() {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const params = useParams()
  const productId = params.id as string
  console.log(productId)

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
    } catch (error: any) {
      console.error("Search error:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to load product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchdata()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!data) return

    toast.success(`${data.name} added to cart!`)
    // Add your cart logic here
  }

  const handleBuyNow = () => {
    if (!data) return

    toast.success(`Proceeding to buy ${data.name}`)
    // Add your buy now logic here
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">Please check the product URL and try again.</p>
      </div>
    )
  }

  const discountedPrice = data.price - (data.price * data.discount) / 100
  const savings = data.price - discountedPrice

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">{data.name}</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images Section */}
        <div className="space-y-4 lg:sticky lg:top-24">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <img
              src={data.image[selectedImage] || "/placeholder.svg"}
              alt={data.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {data.image.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {data.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus:ring-2 ${
                    selectedImage === index
                      ? "border-emerald-500 ring-emerald-200"
                      : "border-border hover:border-emerald-200"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${data.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Product Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">{data.name}</h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed">{data.description}</p>

          {/* Price Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-3xl font-bold text-foreground">₹{discountedPrice.toFixed(2)}</span>

              {data.discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{data.price.toFixed(2)}</span>
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    {data.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {data.discount > 0 && <p className="text-emerald-700 font-medium">You save ₹{savings.toFixed(2)}</p>}

            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
          </div>

          {/* Unit */}
          <div className="text-foreground">
            <strong className="text-foreground">Unit:</strong>{" "}
            <span className="text-muted-foreground">{data.unit}</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-foreground font-medium">Quantity:</label>
            <div className="flex items-center border border-border rounded-lg bg-card">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-2 text-foreground font-medium min-w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={quantity >= data.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 flex-col sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={data.stock === 0}
              className="flex-1 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-muted disabled:to-muted text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
                />
              </svg>
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={data.stock === 0}
              className="flex-1 border cursor-pointer border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Buy Now
            </button>
          </div>

          {/* Key Features */}
          {data.more_details?.key_features && data.more_details.key_features.length > 0 && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
              <ul className="grid grid-cols-1 gap-2">
                {data.more_details.key_features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-foreground">
                    <svg
                      className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {(data.more_details?.type || data.more_details?.shelf_life || data.more_details?.country_of_origin) && (
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Product Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.more_details.type && <DetailCard title="Type" value={data.more_details.type} />}
            {data.more_details.shelf_life && <DetailCard title="Shelf Life" value={data.more_details.shelf_life} />}
            {data.more_details.country_of_origin && (
              <DetailCard title="Country of Origin" value={data.more_details.country_of_origin} />
            )}
            {data.more_details.fssai_license && (
              <DetailCard title="FSSAI License" value={data.more_details.fssai_license} />
            )}
            {data.more_details.manufacturer_details && (
              <DetailCard title="Manufacturer" value={data.more_details.manufacturer_details} />
            )}
            {data.more_details.marketed_by && <DetailCard title="Marketed By" value={data.more_details.marketed_by} />}
          </div>

          {/* Return Policy */}
          {data.more_details.return_policy && (
            <div className="mt-8 p-6 bg-muted rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Return Policy</h3>
              <p className="text-muted-foreground mb-3">{data.more_details.return_policy.policy}</p>
              {data.more_details.return_policy.conditions && (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {data.more_details.return_policy.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper component for detail cards
function DetailCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
      <h4 className="font-semibold text-foreground text-lg mb-2">{title}</h4>
      <p className="text-muted-foreground">{value}</p>
    </div>
  )
}
