import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LegalWrapper({ 
  title, 
  lastUpdated, 
  children 
}: { 
  title: string; 
  lastUpdated: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-(--color-background) py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-(--color-subtext) hover:text-(--color-primary) mb-8 group transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Namma Mart
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-50 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-(--color-primary)" />
            </div>
            <span className="text-(--color-primary) font-bold tracking-widest uppercase text-xs">Official Policy</span>
          </div>
          
          <h1 className="text-4xl font-bold text-(--color-text) mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-(--color-subtext) mb-12 flex items-center gap-2 text-sm">
            <span className="w-8 h-px bg-gray-300"></span>
            Last Updated: {lastUpdated}
          </p>
          
          <div className="space-y-10 text-(--color-subtext) leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-(--color-text) mb-4">{title}</h2>
      <div className="space-y-4 text-gray-600">{children}</div>
    </section>
  );
}