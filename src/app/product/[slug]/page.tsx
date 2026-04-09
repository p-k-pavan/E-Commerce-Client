'use client';

import { useProductDetails } from '@/hooks/useProduct';
import {
  ChevronLeft,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Circle,
  Truck
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductDetail() {
  const router = useRouter();
  const slug = useParams().slug as string;
  const { data: product, isLoading } = useProductDetails(slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundImage?: string; backgroundPosition?: string; backgroundSize?: string }>({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 animate-pulse">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-5 bg-gray-200 w-1/2 rounded"></div>

            <div className="h-20 bg-gray-200 rounded-2xl"></div>
            <div className="h-24 bg-gray-200 rounded"></div>

            <div className="h-40 bg-gray-200 rounded-2xl"></div>
          </div>

        </div>
      </div>
    );
  }
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const originalPrice = Math.round(product.price / (1 - product.discount / 100));

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleMouseMove = (e: any) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${product.image[selectedImage]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));
  const reviews = Math.floor(Math.random() * 500 + 20);

  const finalPrice = Math.round(
    product.price - (product.price * product.discount) / 100
  );

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span className="ml-1 text-sm font-medium">Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100">
              <div
                className="w-full h-full cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={zoomStyle}
              >
                <Image
                  src={product.image[selectedImage]}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-200 ${zoomStyle.backgroundImage ? "opacity-0" : "opacity-100"
                    }`}
                  unoptimized
                />
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
              {product.image.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer 
                ${selectedImage === idx ? 'border-green-500' : 'border-gray-200'
                    }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                    className={i < Math.floor(rating) ? "" : "text-gray-300"}
                  />
                ))}
              </div>

              <span className="text-gray-500 text-sm">
                {rating} ({reviews} reviews)
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-gray-500 mt-1">per {product.unit || '1 kg'}</p>
            </div>


            <div className="mb-8">
              <h3 className="text-lg font-bold mb-2">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}. Our premium quality items are handpicked from the finest
                farms. Rich in essential nutrients and antioxidants, they make a healthy
                addition to your daily diet. Each item is carefully selected to ensure
                the highest quality and freshness.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Why shop from Namma Mart?</h3>

              <div className="space-y-4">

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Express Delivery</p>
                    <p className="text-sm text-gray-500">
                      Get items delivered to your doorstep from nearby stores, anytime you need.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Circle size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Best Prices & Offers</p>
                    <p className="text-sm text-gray-500">
                      Best price destination with offers directly from manufacturers.
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Wide Assortment</p>
                    <p className="text-sm text-gray-500">
                      Choose from thousands of products across groceries, personal care, and more.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-auto p-6 border rounded-2xl border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-3 font-medium">Quantity</p>

              <div className="flex flex-wrap items-center gap-6">

                {/* Quantity Controls */}
                <div className="flex items-center border rounded-lg overflow-hidden border-gray-300">

                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus size={18} />
                  </button>

                  <div className="w-12 text-center font-bold text-lg border-x py-2">
                    {quantity}
                  </div>

                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-xl font-medium text-gray-600">
                  Total:{" "}
                  <span className="text-black font-bold">
                    ₹{finalPrice * quantity}
                  </span>
                </div>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;

                }}
                className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform
      ${isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#16a34a] hover:bg-[#15803d] text-white active:scale-[0.98] cursor-pointer"
                  }`}
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}