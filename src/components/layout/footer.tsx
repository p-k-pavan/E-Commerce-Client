import { X } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube} from "react-icons/fa";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-12">
      <div className="max-w-360 mx-auto px-8">
        <div className="grid grid-cols-4 gap-12 mb-8">

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="font-bold text-xl">Namma Mart</span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Your one-stop destination for fresh groceries delivered fast to your doorstep.
            </p>
          </div>
          

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Press</a></li>
            </ul>
          </div>
          

          <div>
            <h3 className="font-semibold text-lg mb-4">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Shipping & Returns</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Track Order</a></li>
            </ul>
          </div>
          

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        

        <div className="border-t border-gray-700 my-8"></div>
        

        <div className="flex justify-between items-center">
          <p className="text-[#9CA3AF] text-sm">
            © 2026 Namma Mart. All rights reserved.
          </p>
          

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-colors">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-colors">
              <FaXTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-colors">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#16A34A] transition-colors">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}