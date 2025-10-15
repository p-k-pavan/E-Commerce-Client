"use client";

import React, { memo } from "react";
import AddToCartButton from "./AddToCart";
import Link from "next/link";

export interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category?: string;
  description?: string;
  stock?: number;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

const ProductCard = memo(({
  product,
  onAddToCart,
  className = ""
}: ProductCardProps) => {

  const calculateDiscountedPrice = (): number => {
    if (!product.discount) return product.price;
    return product.price - (product.price * product.discount / 100);
  };


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div
      className={`flex-shrink-0 w-48 md:w-56 lg:w-64 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-green-200 ${className}`}
      data-product-id={product._id}
    >

      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden group">
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {

              (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
            }}
          />

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
              {product.discount}% OFF
            </span>
          )}

          {/* Stock Status */}
          {product.stock !== undefined && product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3 space-y-2">
        <Link href={`/product/${product._id}`}>

          <h4
            className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-green-600 transition-colors duration-200 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h4>
        </Link>
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-600 text-base">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {product.discount && product.discount > 0 && (
              <span className="hidden lg:inline text-xs text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock === 0 ?
            <button className="text-xs px-3 py-2 rounded transition-all duration-200 
          font-medium bg-gray-300 text-gray-500 cursor-not-allowed">Out of Stock</button>
            : <AddToCartButton data={product} />}


        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;