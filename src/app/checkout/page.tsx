'use client'

import { useAppSelector } from "@/store/hooks"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useGlobalContext } from "@/context/GlobalContext"

interface Address {
    _id?: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    mobile: string
    isDefault: boolean
}

export default function Page() {
    const [address, setAddress] = useState<Address[]>([])
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
    const { fetchCartItems, updateCartItem, deleteCartItem } = useGlobalContext();


    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        mobile: "",
        isDefault: true
    })

    const router = useRouter()

    const fetchAddress = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/address`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            if (response.data.success) {
                setAddress(response.data.addresses)
            }
        } catch (error: any) {
            toast(error?.response?.data?.message || error?.message || "An error occurred")
        }
    }

    const addAddress = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/address`, formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            if (response.data.success) {
                toast("Address added successfully")
                fetchAddress() // refresh address list
            }
        } catch (error: any) {
            toast(error?.response?.data?.message || error?.message || "An error occurred")
        }
    }

    // ✅ Correct useEffect usage
    useEffect(() => {
        fetchAddress()
    }, [])

    const { cart } = useAppSelector((state) => state.cart)

    const [totalQty, setTotalQty] = useState(0)
    const [totals, setTotals] = useState({
        beforeDiscount: 0,
        afterDiscount: 0,
        totalDiscount: 0
    })

    console.log(cart)

    useEffect(() => {
        if (!cart || cart.length === 0) return

        let before = 0, after = 0
        cart.forEach((item) => {
            const { price, discount } = item.productId
            const quantity = item.quantity
            const itemBefore = price * quantity
            const itemDiscountAmount = (price * (discount || 0)) / 100
            const itemAfter = (price - itemDiscountAmount) * quantity
            before += itemBefore
            after += itemAfter
        })

        setTotals({
            beforeDiscount: before,
            afterDiscount: after,
            totalDiscount: before - after
        })

        const qty = cart.reduce((prev, curr) => prev + curr.quantity, 0)
        setTotalQty(qty)
    }, [cart])

    const handleCashOnDelivery = async () => {
        if (selectedAddressIndex === null) {
            toast("Please select an address before placing the order")
            return
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/order`, {
                list_items: cart,
                addressId: address[selectedAddressIndex]?._id,
                subTotalAmt: totals.afterDiscount,
                totalAmt: totals.afterDiscount
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })

            if (response.data.success) {
                toast("Order placed successfully")
                await fetchCartItems();
                router.push("/")
            }
        } catch (error: any) {
            toast(error?.response?.data?.message || error?.message || "An error occurred")
        }
    }

    const handleOnlinePayment = async () => {
        toast("Online payment feature coming soon")
    }

    return (
        <div className="bg-blue-50">
            <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
                <div className="w-full">
                    <h3 className='text-lg font-semibold'>Choose your address</h3>
                    <div className='bg-white p-2 grid gap-4'>
                        {address.map((add, index) => (
                            <div
                                key={add._id}
                                onClick={() => setSelectedAddressIndex(index)}
                                className={`p-3 border rounded cursor-pointer ${selectedAddressIndex === index ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}
                            >
                                <p>{add.street}</p>
                                <p>{add.city}, {add.state}</p>
                                <p>{add.postalCode}, {add.country}</p>
                                <p>📞 {add.mobile}</p>
                                {add.isDefault && <p className="text-green-600 font-semibold">Default</p>}
                            </div>
                        ))}
                        <div
                            onClick={addAddress}
                            className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer hover:bg-blue-100'
                        >
                            + Add Address
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-md bg-white py-4 px-2 rounded-lg shadow'>
                    <h3 className='text-lg font-semibold'>Summary</h3>
                    <div className='bg-white p-4'>
                        <h3 className='font-semibold'>Bill details</h3>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Items total</p>
                            <p className='flex items-center gap-2'>
                                <span className='line-through text-neutral-400'>{totals.beforeDiscount}</span>
                                <span>{totals.afterDiscount.toFixed(2)}</span>
                            </p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Quantity total</p>
                            <p>{totalQty} item{totalQty > 1 ? 's' : ''}</p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Delivery Charge</p>
                            <p>Free</p>
                        </div>
                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p>Grand total</p>
                            <p>{totals.afterDiscount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-4'>
                        <button
                            className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold'
                            onClick={handleOnlinePayment}
                        >
                            Online Payment
                        </button>

                        <button
                            className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded'
                            onClick={handleCashOnDelivery}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
