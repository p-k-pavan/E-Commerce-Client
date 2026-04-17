import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-12 md:py-16">
      <div className="max-w-360 mx-auto px-6 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Namma Mart</span>
            </div>
            <p className="text-[#9CA3AF] text-sm md:text-base leading-relaxed">
              Your one-stop destination for fresh groceries delivered fast to your doorstep. 
              Quality you can trust, prices you'll love.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-5 text-white">Help</h3>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Contact Us</Link></li>
                <li><Link href="/faqs" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">FAQs</Link></li>
                <li><Link href="/shipping" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Shipping & Returns</Link></li>
                <li><Link href="/orders" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-5 text-white">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Cookie Policy</Link></li>
                <li><Link href="/refund" className="text-[#9CA3AF] hover:text-[#16A34A] transition-colors text-sm">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <p className="text-[#9CA3AF] text-sm text-center md:text-left order-2 md:order-1">
            © {new Date().getFullYear()} Namma Mart. All rights reserved.
          </p>

          <div className="flex gap-4 order-1 md:order-2">
            <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-all hover:-translate-y-1">
              <FaFacebookF size={18} />
            </a>
            <a href="#" aria-label="X (Twitter)" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-all hover:-translate-y-1">
              <FaXTwitter size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-all hover:-translate-y-1">
              <FaInstagram size={18} />
            </a>
            <a href="#" aria-label="Youtube" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-all hover:-translate-y-1">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}