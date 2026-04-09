"use client";

import Button from "@/components/Home/button";
import { Categories } from "@/components/Home/categories";
import { HeroBanner } from "@/components/Home/hero";
import PopularProducts from "@/components/Home/PopularProducts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const navigate = useRouter();
  return (
    <div className="min-h-screen bg-[#F9FAFB]">


      <main className="max-w-360 mx-auto px-8 py-8 space-y-12">
        <HeroBanner />
        <Categories />
        <PopularProducts />

        <Button />
      </main>


    </div>
  );
}
