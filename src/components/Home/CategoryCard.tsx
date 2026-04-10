"use client";

import { getSubCategory } from "@/api/category";
import { useSubCategorybyCategory } from "@/hooks/useCategory";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryCardProps {
    image: string;
    slug: string
}

export function CategoryCard({ image,slug }: CategoryCardProps) {
    const navigate = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleRedirect = async () => {
        try {
            setIsRedirecting(true);
            const subCategories = await getSubCategory(slug);
            console.log("Fetched subcategories:", subCategories);

            if (subCategories && subCategories.length > 0) {
                const firstSubCategorySlug = subCategories[0].slug;
                navigate.push(`/category/${slug}/${firstSubCategorySlug}`);
            } else {
                
                navigate.push(`/category`);
            }
        } catch (error) {
            console.error("Failed to fetch subcategories", error);
        } finally {
            setIsRedirecting(false);
        }
    };
    return (
        <div className=" rounded-2xl p-3 flex flex-col items-center gap-3 cursor-pointer " onClick={handleRedirect}>
            <div className="w-48 h-48  rounded-2xl flex items-center justify-center overflow-hidden relative" >

                <Image
                    src={image}
                    alt="Category"
                    fill
                    className="object-contain"
                    sizes="96px"
                    unoptimized
                />

            </div>

        </div>
    );
}
