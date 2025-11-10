"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" bottom-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <div className="max-w-7xl mx-auto pt-5 px-6 flex flex-col md:flex-row justify-between gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3 text-center">Namma Mart</h2>
          <p className="text-sm text-gray-100 leading-relaxed">
            Your trusted marketplace for quality groceries and daily essentials.
            
          </p>
          <p className="text-center">Shop smart. Shop local. Shop Namma Mart.</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center">Follow Us</h3>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <FaFacebookF className="text-white" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <FaTwitter className="text-white" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <FaInstagram className="text-white" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <FaLinkedinIn className="text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/20 mt-8 py-4 mb-2 text-center text-gray-100 text-sm">
        © {new Date().getFullYear()} Namma Mart — All Rights Reserved.
      </div>
    </footer>
  );
}
