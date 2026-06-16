import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-green/5 border-b border-primary-green/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-primary-green mb-4">Get in Touch</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            We are here to assist you with all your health and pharmacy needs. Reach out to our professional team for expert advice, support, or general inquiries.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-serif text-text-primary mb-6">Contact Information</h2>
              <p className="text-text-secondary mb-8">
                Dash Pharmacy is committed to providing accessible and reliable healthcare. Use the contact details below to get in touch with our pharmacists or support team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Address */}
              <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary-green">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">Our Location</h3>
                  <p className="text-text-secondary text-sm">
                    Plot 45, Kampala Road<br />
                    Opposite City Square<br />
                    Kampala, Uganda
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary-green">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">Call Us</h3>
                  <p className="text-text-secondary text-sm">
                    +256 800 123 456<br />
                    +256 752 987 654
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary-green">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">Email Us</h3>
                  <p className="text-text-secondary text-sm break-all">
                    support@dashpharmacy.com<br />
                    info@dashpharmacy.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary-green">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">Working Hours</h3>
                  <p className="text-text-secondary text-sm">
                    Mon - Sat: 8:00 AM - 10:00 PM<br />
                    Sunday: 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FEF3E8] border border-[#F4A820]/30 rounded-2xl p-6 flex items-start gap-4 mt-4">
              <ShieldCheck className="w-8 h-8 text-[#B36B00] shrink-0" />
              <div>
                <h4 className="font-bold text-[#B36B00] mb-1">Licensed Professionals</h4>
                <p className="text-sm text-[#B36B00]/80">
                  All our pharmacists are certified and licensed by the National Drug Authority (NDA). You can trust us with your medical queries and prescription needs.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-surface border border-border rounded-3xl p-8 md:p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <HeartPulse className="w-8 h-8 text-primary-green" />
              <h2 className="text-2xl font-serif text-text-primary">Send us a Message</h2>
            </div>
            
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-text-primary">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all" 
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-text-primary">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all" 
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-text-primary">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all" 
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-text-primary">Subject</label>
                <select 
                  id="subject" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all appearance-none"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="prescription">Prescription Refill</option>
                  <option value="order">Order Status</option>
                  <option value="pharmacist">Speak to a Pharmacist</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-text-primary">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green transition-all resize-none" 
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <Button size="lg" className="w-full mt-2 group relative overflow-hidden" type="button">
                <span className="flex items-center justify-center gap-2 relative z-10">
                  Send Message
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
