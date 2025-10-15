'use client'

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoClose } from 'react-icons/io5';
import AddToCartButton from "./AddToCart";
import { FaCaretRight } from "react-icons/fa";

export default function DisplayCartItem({ close }: { close: () => void }) {
    const { cart } = useAppSelector((state) => state.cart);
    const [totalQty, setTotalQty] = useState(0);
    const [totals, setTotals] = useState({
        beforeDiscount: 0,
        afterDiscount: 0,
        totalDiscount: 0,
    });

    useEffect(() => {
        if (!cart || cart.length === 0) return;
        let before = 0, after = 0;

        cart.forEach((item) => {
            const { price, discount } = item.productId;
            const quantity = item.quantity;
            const itemBefore = price * quantity;
            const itemDiscountAmount = (price * discount) / 100;
            const itemAfter = (price - itemDiscountAmount) * quantity;
            before += itemBefore;
            after += itemAfter;
        });

        setTotals({
            beforeDiscount: before,
            afterDiscount: after,
            totalDiscount: before - after,
        });

        const qty = cart.reduce((preve, curr) => preve + curr.quantity, 0);
        setTotalQty(qty);
    }, [cart]);

    const calculateDiscountedPrice = (item: any): number => {
        if (!item.productId.discount) return item.productId.price;
        return item.productId.price - (item.productId.price * item.productId.discount / 100);
    };

    return (
        <div className="fixed inset-0 bg-opacity-70 z-50 flex justify-end">
            <div className="bg-white w-full max-w-sm min-h-screen max-h-screen">
                <div className="flex items-center p-4 shadow-md justify-between">
                    <h2 className="font-semibold">Cart</h2>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>

                <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4 overflow-auto">
                    {cart?.length ? (
                        <>
                            <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                                <p>Your total savings</p>
                                <p>₹{totals.totalDiscount.toFixed(2)}</p>
                            </div>

                            <div className="bg-white rounded-lg p-4 grid gap-5">
                                {cart.map((item) => (
                                    <div
                                        key={item?._id + 'cartItemDisplay'}
                                        className="flex w-full items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 bg-gray-100 border rounded overflow-hidden">
                                                <img
                                                    src={item?.productId?.image[0]}
                                                    alt={item?.productId?.name}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>

                                            <div className="text-xs">
                                                <p className="line-clamp-2">{item?.productId?.name}</p>
                                                <p className="text-neutral-400">{item?.productId?.unit}</p>
                                                <p className="font-semibold">₹{calculateDiscountedPrice(item)}</p>
                                            </div>
                                        </div>

                                        
                                        <div className="w-16 flex justify-end items-center">
                                            <AddToCartButton data={item?.productId} />
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className="bg-white p-4 rounded">
                                <h3 className="font-semibold">Bill details</h3>
                                <div className="flex justify-between">
                                    <p>Items total</p>
                                    <p>
                                        <span className="line-through text-neutral-400">₹{totals.beforeDiscount}</span>{" "}
                                        ₹{totals.afterDiscount}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Quantity</p>
                                    <p>{totalQty} items</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Delivery Charge</p>
                                    <p>Free</p>
                                </div>
                                <div className="font-semibold flex justify-between">
                                    <p>Grand total</p>
                                    <p>₹{totals.afterDiscount}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white flex flex-col justify-center items-center p-4">
                            <img src="/31160.jpg" alt="Empty cart" className="w-60 h-60 object-contain" />
                            <Link onClick={close} href="/" className="bg-green-600 px-4 py-2 text-white rounded mt-3">Shop Now</Link>
                        </div>
                    )}
                </div>

                {cart?.length > 0 && (
                    <div className="p-2">
                        <div className="bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 rounded flex items-center justify-between">
                            <div>₹{totals.afterDiscount}</div>
                            <button className="flex items-center gap-1">
                                Proceed <FaCaretRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
