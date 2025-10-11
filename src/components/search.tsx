"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
    const route = useRouter();
    const auth = useAppSelector((state) => state.auth);

        const handleOnChange = (e:React.FormEvent<HTMLFormElement>)=>{
        const value = e.target
        const url = `/search?q=${value}`
        route.push(url)
    }

    return (
        <div className="className='w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200">
            <div className="flex items-center">
                                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for atta dal and more.'
                            autoFocus
                            
                            className='bg-transparent w-full h-full outline-none'
                            // onChange={handleOnChange}
                        />
                    </div>
                
            </div>
        </div>
    );
}