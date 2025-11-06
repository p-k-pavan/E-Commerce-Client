"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <div className="max-w-7xl mx-auto pt-5 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Namma Mart</h2>
          <p className="text-sm text-gray-100 leading-relaxed">
            Your trusted marketplace for quality groceries and daily essentials.
            Shop smart. Shop local. Shop Namma Mart.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-100 text-sm">
            <li>
              <Link href="/" className="hover:text-gray-200 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-gray-200 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-200 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-gray-200 transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-100 text-sm">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-gray-200 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-gray-200 transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                className="hover:text-gray-200 transition-colors"
              >
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
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
