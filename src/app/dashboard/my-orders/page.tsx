"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Orders {
  _id?: string
  product_details: {
    name: string
    image: string[]
  }
  quantity: number
  payment_status: string
  subTotalAmt: number
  totalAmt: number
  createdAt: string
}

export default function Page() {
  const [myOrders, setMyOrders] = useState<Orders[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch user orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/order`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })
      if (response.data.success === true) {
        setMyOrders(response.data.data)
      } else {
        toast("Failed to fetch orders")
      }
    } catch (error: any) {
      toast("Error", {
        description:
          error?.response?.data?.message || error?.message || "An error occurred while fetching orders",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders()
  }, [])

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // ✅ Empty state
  if (myOrders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>
          <p className="text-gray-500 mt-2">You haven’t placed any orders yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="grid gap-6">
        {myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 border rounded overflow-hidden flex-shrink-0">
                <img
                  src={order.product_details?.image?.[0] || "/placeholder.svg"}
                  alt={order.product_details?.name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{order.product_details?.name}</h3>

                <p className="text-gray-600 mt-1">
                  Quantity: <span className="font-medium">{order.quantity}</span>
                </p>

                <p className="text-gray-600 mt-1">
                  Payment: <span className="font-medium">{order.payment_status}</span>
                </p>

                <p className="text-gray-600 mt-1">
                  Subtotal: ₹<span className="font-medium">{order.subTotalAmt.toFixed(2)}</span>
                </p>

                <p className="text-gray-600 mt-1">
                  Total: ₹<span className="font-medium text-green-600">{order.totalAmt.toFixed(2)}</span>
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Ordered on:{" "}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
