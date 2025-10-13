"use client";

import { useParams } from "next/navigation";
import CategoryDetailPage from "@/components/CategoryDetailPage";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  return (
    <CategoryDetailPage 
      categoryId={categoryId}
    />
  );
}