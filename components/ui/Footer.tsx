'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Share2, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-serif tracking-tight mb-4 flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary-green flex items-center justify-center text-surface font-sans font-black text-lg shadow-sm transition-transform group-hover:scale-105">
                D
              </div>
              <div>
                <span className="text-text-primary font-bold">Dash</span>
                <span className="text-primary-green font-medium">Care</span>
              </div>
            </Link>
            <p className="text-text-secondary font-medium mb-4">Your health, delivered.</p>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs mb-3">
              Dash Care is Uganda&apos;s premier online pharmacy, bringing you authentic medicines and healthcare products with fast, reliable delivery.
            </p>
            <p className="text-text-muted text-xs leading-relaxed max-w-xs font-medium">
              📍 Bukoto-Kisaasi Road, Kampala
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-text-secondary hover:text-primary-green transition-colors">Shop All Products</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-green transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-green transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-green transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-green transition-colors">Delivery Information</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold text-text-primary mb-4">Accepted Payments</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-[#FFCC00]/10 text-[#FFCC00] font-bold text-xs rounded border border-[#FFCC00]/20">MTN MoMo</span>
              <span className="px-3 py-1 bg-[#FF0000]/10 text-[#FF0000] font-bold text-xs rounded border border-[#FF0000]/20">Airtel Money</span>
              <span className="px-3 py-1 bg-[#1A1F71]/10 text-[#1A1F71] font-bold text-xs rounded border border-[#1A1F71]/20">VISA</span>
              <span className="px-3 py-1 bg-[#EB001B]/10 text-[#EB001B] font-bold text-xs rounded border border-[#EB001B]/20">Mastercard</span>
            </div>
            
            <h3 className="font-bold text-text-primary mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-primary-green hover:bg-primary-light transition-all">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-primary-green hover:bg-primary-light transition-all">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-primary-green hover:bg-primary-light transition-all">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
          
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© 2026 Dash Care Pharmacy. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-green"></span>
            Licensed by the National Drug Authority of Uganda.
          </p>
        </div>
      </div>
    </footer>
  );
};
