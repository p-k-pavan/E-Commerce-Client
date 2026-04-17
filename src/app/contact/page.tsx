import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-(--color-background) min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-(--color-text) mb-4">Get in Touch</h1>
          <p className="text-(--color-subtext) max-w-lg mx-auto">
            Have questions about your order or our services? We're here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="text-(--color-primary) w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-(--color-subtext) text-sm mb-4">Expect a response within 24 hours.</p>
              <a href="mailto:support@nammamart.com" className="text-(--color-primary) font-bold hover:underline">
                support@nammamart.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="text-(--color-primary) w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-(--color-subtext) text-sm mb-4">Mon-Sat from 9am to 6pm.</p>
              <a href="tel:+919876543210" className="text-(--color-primary) font-bold hover:underline">
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
            <form className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--color-text)">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-(--color-primary) transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-(--color-text)">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-(--color-primary) transition-colors"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-(--color-text)">Message</label>
                <textarea 
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-(--color-primary) transition-colors"
                />
              </div>
              <button className="md:col-span-2 bg-(--color-primary) text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#15803D] transition-colors">
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}