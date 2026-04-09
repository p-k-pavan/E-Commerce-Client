"use client";

import Image from "next/image";

interface CategoryCardProps {
    image: string;
}

export function CategoryCard({ image }: CategoryCardProps) {
    return (
        <div className=" rounded-2xl p-3 flex flex-col items-center gap-3 cursor-pointer ">
            <div className="w-48 h-48  rounded-2xl flex items-center justify-center overflow-hidden relative">

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
