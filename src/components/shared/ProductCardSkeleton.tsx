"use client";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
      

      <div className="w-full h-44 bg-gray-200 rounded-xl mb-3"></div>

   
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

    
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded"></div>
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
      </div>

     
      <div className="h-10 bg-gray-200 rounded-xl"></div>
    </div>
  );
};

export default ProductCardSkeleton;