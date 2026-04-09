"use client";

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 animate-pulse">

      <div className="w-28 h-28 bg-gray-200 rounded-2xl" />

      <div className="w-16 h-3 bg-gray-200 rounded" />
    </div>
  );
}