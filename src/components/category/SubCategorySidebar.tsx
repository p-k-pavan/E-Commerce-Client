import Image from "next/image";
import Link from "next/link";
import { SidebarSkeleton } from "./CategorySkeletons";

export function SubCategorySidebar({ subCategories, currentSubCategorySlug, categorySlug, loading }: any) {
    return (
        <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="bg-white lg:rounded-2xl p-2 md:p-4 shadow-sm lg:sticky lg:top-24 -mx-4 px-4 lg:mx-0 lg:px-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                <h2 className="hidden lg:block font-bold text-lg text-[#111827] mb-4 px-2">Sub Categories</h2>
                
                {loading ? (
                    <SidebarSkeleton />
                ) : (
                    <div className="flex lg:flex-col gap-2 md:gap-3">
                        {subCategories?.map((item: any) => {
                            const isActive = currentSubCategorySlug === item.slug;
                            return (
                                <Link
                                    key={item._id}
                                    href={`/category/${categorySlug}/${item.slug}`}
                                    className={`flex items-center gap-2 md:gap-3 shrink-0 px-3 py-2 rounded-xl transition-all border-2 whitespace-nowrap ${
                                        isActive
                                            ? "border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]"
                                            : "border-transparent bg-[#F9FAFB] text-[#374151] hover:bg-[#F3F4F6]"
                                    }`}
                                >
                                    <div className="relative h-8 w-8 md:h-12 md:w-12 shrink-0 overflow-hidden rounded-lg bg-white border">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-contain"
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                    <span className="font-bold lg:font-medium text-xs md:text-sm">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </aside>
    );
}