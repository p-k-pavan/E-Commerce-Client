import { ArrowRight } from 'lucide-react';
import Image from 'next/image';


export function HeroBanner() {
  return (
    <div className="relative bg-linear-to-r from-[#16A34A] to-[#15803d] rounded-3xl overflow-hidden h-[400px]">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1659283506371-d5c45ab0f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyb2NlcnklMjBzaG9wcGluZyUyMGJhbm5lcnxlbnwxfHx8fDE3NzU2MjQ3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Grocery banner" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 h-full flex items-center px-16">
        <div className="max-w-xl space-y-6">
          <div className="inline-block bg-[#FACC15] text-[#111827] px-4 py-2 rounded-full font-semibold text-sm">
            LIMITED TIME OFFER
          </div>
          
          <h1 className="text-white font-bold text-5xl leading-tight">
            50% OFF on Groceries
          </h1>
          
          <p className="text-white/90 text-lg">
            Get fresh fruits, vegetables, dairy products and more delivered to your doorstep at unbeatable prices
          </p>
          
          <button className="bg-white text-[#16A34A] px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Shop Now
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
