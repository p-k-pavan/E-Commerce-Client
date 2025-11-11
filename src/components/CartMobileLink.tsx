import React, { useEffect, useState } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { FaCaretRight } from "react-icons/fa";
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';

interface CartMobileLinkProps {
  onCartClick?: () => void;
}

const CartMobileLink: React.FC<CartMobileLinkProps> = ({ onCartClick }) => {
    const { cart } = useAppSelector((state) => state.cart);
    const [totalQty, setTotalQty] = useState(0);
    const [total, setTotal] = useState(0);
    const pathname = usePathname();

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
        })
        setTotal(after)
        const qty = cart.reduce((preve, curr) => preve + curr.quantity, 0);
        setTotalQty(qty);
    }, [cart])

    const handleClick = () => {
        if (onCartClick) {
            onCartClick(); 
        }
    }
    
    if (pathname !== '/') return null;

    return (
        <>
            {
                cart[0] && (
                    <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4 lg:hidden'>
                        <div className='bg-green-600 px-4 py-3 rounded-lg text-neutral-100 text-sm flex items-center justify-between gap-3 shadow-lg border border-green-700'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-green-500 rounded-full w-fit'>
                                    <FaCartShopping className="text-white" />
                                </div>
                                <div className='text-xs'>
                                    <p>{totalQty} items</p>
                                    <p className="font-semibold">₹{total.toFixed(2)}</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleClick}
                                className='flex items-center gap-1 bg-white text-green-700 px-3 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors'
                            >
                                <span className='text-sm'>View Cart</span>
                                <FaCaretRight />
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CartMobileLink