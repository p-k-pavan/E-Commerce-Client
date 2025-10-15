'use client'

import { useAppSelector } from "@/store/hooks"
import { useRouter } from "next/navigation"

export default function DisplayCartItem() {
    const user = useAppSelector(state => state.auth)
    const route = useRouter();
    return (
        <div></div>
    )
}