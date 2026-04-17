"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FAQPage() {
    const navigate = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the typical delivery time?",
      a: "For most areas, we offer same-day delivery if the order is placed before 12 PM. Orders placed later are delivered the next morning."
    },
    {
      q: "How do I track my order?",
      a: "You can track your order in real-time by going to 'My Orders' in your profile and clicking on the 'Track Order' button."
    },
    {
      q: "What is your return policy for fresh produce?",
      a: "Fresh produce can be returned at the time of delivery if you are not satisfied with the quality. After delivery, returns for perishables are handled on a case-by-case basis."
    },
    {
      q: "Do you offer contactless delivery?",
      a: "Yes, you can opt for contactless delivery in the checkout notes. Our partner will leave the order at your doorstep and notify you."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major Credit/Debit cards, UPI, Net Banking, and Cash on Delivery (COD)."
    }
  ];

  return (
    <div className="bg-(--color-background) min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="text-(--color-primary) w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-(--color-text) mb-4">FAQs</h1>
          <p className="text-(--color-subtext)">Everything you need to know about Namma Mart.</p>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for a question..."
            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:outline-none focus:border-(--color-primary)"
          />
        </div>


        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-3xl border transition-all ${
                openIndex === i ? "border-(--color-primary) shadow-md" : "border-gray-100"
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className="font-bold text-lg text-(--color-text)">{faq.q}</span>
                {openIndex === i ? (
                  <Minus className="w-5 h-5 text-(--color-primary) shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              
              {openIndex === i && (
                <div className="px-8 pb-8 text-(--color-subtext) leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="pt-2 border-t border-gray-50">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-[#111827] text-white p-10 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <button className="bg-(--color-primary) px-8 py-3 rounded-xl font-bold hover:bg-[#15803D] transition-colors" onClick={ () => navigate.push("/contact")}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}