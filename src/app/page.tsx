"use client";

import { Categories } from "@/components/Home/categories";
import { HeroBanner } from "@/components/Home/hero";
import PopularProducts from "@/components/Home/PopularProducts";
import Image from "next/image";

export default function Home() {
  return (
     <div className="min-h-screen bg-[#F9FAFB]">
    
      
      <main className="max-w-360 mx-auto px-8 py-8 space-y-12">
        <HeroBanner  />
        <Categories />
        <PopularProducts />
        </main>
     
    </div>
  );
}
