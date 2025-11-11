"use client";

import React, { memo } from "react";

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

const ProductSkeleton = memo(({ 
  count = 1, 
  className = "" 
}: ProductSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`flex-shrink-0 w-36 md:w-42 lg:w-64 animate-pulse ${className}`}
        >
          <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});

ProductSkeleton.displayName = 'ProductSkeleton';

export default ProductSkeleton;