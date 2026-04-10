"use client";

import { useCategory } from '@/hooks/useCategory';
import { ArrowRight } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { CategorySkeleton } from './CategorySkeleton';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
    image: string;
    slug: string
}

export function Categories() {
    const { data: categories = [], isLoading } = useCategory();
    const navigate = useRouter();
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-2xl text-[#111827]">Shop by Category</h2>
                <button className="text-[#16A34A] font-medium hover:underline" onClick={() => navigate.push("/category")}>View All</button>
            </div>

            <div className="grid grid-cols-10 gap-4">
                {isLoading
                    ? Array.from({ length: 20 }).map((_, i) => (
                        <CategorySkeleton key={i} />
                    ))
                    : categories.map((category: CategoryCardProps) => (
                        <CategoryCard
                            key={category.slug}
                            image={category.image}
                            slug={category.slug}
                        />
                    ))}
            </div>
        </section>
    );
}
