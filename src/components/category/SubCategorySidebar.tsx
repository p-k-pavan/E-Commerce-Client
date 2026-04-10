import Image from "next/image";
import Link from "next/link";
import { SidebarSkeleton } from "./CategorySkeletons";

interface SubCategorySidebarProps {
    subCategories: any[];
    currentSubCategorySlug: string;
    categorySlug: string;
    loading: boolean;
}

export function SubCategorySidebar({
    subCategories,
    currentSubCategorySlug,
    categorySlug,
    loading
}: SubCategorySidebarProps) {
    return (
        <aside className="w-72 shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-24">
                <h2 className="font-bold text-lg text-[#111827] mb-4 px-2">Sub Categories</h2>
                {
                    loading ? (
                        <SidebarSkeleton />
                    ) : (
                        <div className="space-y-2">
                            {subCategories?.map((item: any) => {
                                const isActive = currentSubCategorySlug === item.slug;
                                return (
                                    <Link
                                        key={item._id}
                                        href={`/category/${categorySlug}/${item.slug}`}
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl transition-all border-2 ${isActive
                                                ? "border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]"
                                                : "border-transparent bg-[#F9FAFB] text-[#374151] hover:bg-[#F3F4F6]"
                                            }`}
                                    >
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white border">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-contain"
                                                fill
                                                unoptimized
                                            />
                                        </div>
                                        <span className="font-medium text-sm leading-tight">
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )
                }
            </div>
        </aside>
    );
}