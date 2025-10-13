"use client";

import { useEffect, useState } from "react";
import BannerSlider from "@/components/BannerSlider";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryWiseProductDisplay from "@/components/CategoryWiseProductDisplay"


export default function Home() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/category/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );

                console.log(response.data.data);

                if (response.data.success === true) {
                    setCategory(response.data.data);
                    setLoading(false);
                } else if (response.data.error === true) {
                    toast.error(response.data.message || 'Fetch failed!');
                }
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Fetch failed. Please try again.'
                );
            }
        };

        fetchCategory();
    }, []);


    return (
        <div className="m-2 md:mx-12 lg:mx-16 mt-12">

            <BannerSlider />

            <div className="container mx-auto px-4 my-4 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2">
                {loading
                    ? 
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                            <Skeleton className="w-32 h-32 rounded-lg" />
                        </div>
                    ))
                    : 
                    category.map((cat: any) => (
                        <Link key={cat._id} href={cat._id}>
                            <div className="flex flex-col items-center cursor-pointer">
                                <img
                                    src={cat.image || '/placeholder.png'}
                                    alt={cat.name}
                                    className="w-full h-full object-scale-down rounded-lg"
                                />
                            </div>
                        </Link>
                    ))}
            </div>
      {category.map((cat: any) => (
        <CategoryWiseProductDisplay
          key={cat._id}
          id={cat._id}
          name={cat.name}
        />
      ))}
        </div>
    );
}