import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative bg-linear-to-r from-[#16A34A] to-[#15803d] rounded-2xl md:rounded-3xl overflow-hidden min-h-[320px] md:h-[400px] flex items-center">

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1659283506371-d5c45ab0f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyb2NlcnklMjBzaG9wcGluZyUyMGJhbm5lcnxlbnwxfHx8fDE3NzU2MjQ3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Grocery banner" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 w-full px-6 md:px-16 py-8 md:py-0">
        <div className="max-w-xl space-y-4 md:space-y-6">
          
          <div className="inline-block bg-[#FACC15] text-[#111827] px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[10px] md:text-sm tracking-wide">
            LIMITED TIME OFFER
          </div>
          
          <h1 className="text-white font-bold text-3xl md:text-5xl leading-tight">
            50% OFF on <br className="hidden md:block" /> Groceries
          </h1>
          
          <p className="text-white/90 text-sm md:text-lg max-w-70 md:max-w-none">
            Get fresh fruits, vegetables, dairy products and more delivered to your doorstep.
          </p>
          
          <button className="bg-white text-[#16A34A] px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center gap-2 md:gap-3 hover:bg-gray-100 transition-all duration-200 shadow-xl active:scale-95">
            Shop Now
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}