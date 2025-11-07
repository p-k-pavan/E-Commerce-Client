"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function BannerSlider() {
  const desktopImages = ["ban-1.jpg", "ban-2.jpg"];
  const mobileImages = ["mob-1.png", "mob-2.png", "mob-3.png"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
   const images = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= (isMobile ? mobileImages.length : desktopImages.length)
          ? 0
          : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile]);

 

  return (
    <div className="container mx-auto ">
      <div className="w-full mx-auto h-64 max-h-48 bg-blue-100 overflow-hidden rounded">
        <Image
          src={images[currentIndex]}
          className="w-full h-full object-cover"
          alt="banner"
        />
      </div>
    </div>
  );
}
