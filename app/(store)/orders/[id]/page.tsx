'use client';

import React from 'react';
import { Package, Truck, Home, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const orderId = params.id; // e.g. MR-2025-00431

  // Status can be 'confirmed', 'packing', 'dispatched', 'delivered'
  const currentStatus = 'dispatched' as string; 

  const getStatusColor = () => {
    switch(currentStatus) {
      case 'confirmed': return 'bg-[#E8F0FE] text-[#1A56DB]';
      case 'packing': return 'bg-[#FEF3E8] text-[#B36B00]';
      case 'dispatched': return 'bg-[#E8F5EE] text-[#1A6B4A]';
      case 'delivered': return 'bg-[#1A6B4A] text-surface';
      default: return 'bg-background text-text-primary';
    }
  };

  const getStatusText = () => {
    switch(currentStatus) {
      case 'confirmed': return 'Order Confirmed';
      case 'packing': return 'Pharmacist Reviewing & Packing';
      case 'dispatched': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Pending';
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Status Hero */}
        <div className={`p-6 md:p-8 rounded-xl mb-8 flex flex-col items-center justify-center text-center shadow-sm ${getStatusColor()}`}>
          <h1 className="text-3xl font-serif mb-2">{getStatusText()}</h1>
          <p className="font-medium opacity-90">Estimated delivery: Today, 2:45 PM</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left - Timeline */}
          <div className="flex-1">
            <h2 className="text-xl font-serif text-text-primary mb-6">Tracking status</h2>
            
            <div className="relative pl-6 space-y-12">
              <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-border -z-10"></div>
              
              {/* Confirmed */}
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-green text-surface flex items-center justify-center shrink-0 absolute -left-[14px]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Order confirmed</h4>
                  <p className="text-sm text-text-secondary">We have received your order.</p>
                  <span className="text-xs font-mono text-text-muted mt-1 block">9:41 AM</span>
                </div>
              </div>

              {/* Packing */}
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-green text-surface flex items-center justify-center shrink-0 absolute -left-[14px]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Pharmacist reviewing</h4>
                  <p className="text-sm text-text-secondary">Your order is being prepared and packed securely.</p>
                  <span className="text-xs font-mono text-text-muted mt-1 block">10:15 AM</span>
                </div>
              </div>

              {/* Dispatched (Current) */}
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-green ring-4 ring-primary-light text-surface flex items-center justify-center shrink-0 absolute -left-[14px] animate-[pulse_2s_ease-in-out_infinite]">
                  <Truck className="w-3 h-3" />
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-text-primary">Out for delivery</h4>
                  <p className="text-sm text-text-secondary mb-3">Your rider is on the way.</p>
                  
                  {currentStatus === 'dispatched' && (
                    <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary-green font-bold">
                          D
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">David Mukasa</p>
                          <p className="text-xs text-text-muted">Dash Care Rider</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0">
                        <Phone className="w-4 h-4 mr-2" />
                        Call rider
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivered (Pending) */}
              <div className="relative z-10 flex gap-4 opacity-50">
                <div className="w-6 h-6 rounded-full bg-background border-2 border-border text-text-muted flex items-center justify-center shrink-0 absolute -left-[14px]">
                  <Home className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">Delivered</h4>
                  <p className="text-sm text-text-secondary">Package arrived at destination.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-surface rounded-xl border border-border overflow-hidden sticky top-24">
              <div className="p-5 border-b border-border bg-background/50">
                <h2 className="text-lg font-bold text-text-primary mb-1">Order {orderId}</h2>
                <div className="text-sm text-text-muted">Placed on 12 May 2025</div>
              </div>
              
              <div className="p-5 divide-y divide-border">
                <div className="pb-4">
                  <h3 className="text-sm font-bold text-text-primary mb-3">Items</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">2x Paracetamol 500mg</span>
                      <span className="font-mono text-text-primary font-medium">UGX 5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">1x Vitamin C 1000mg</span>
                      <span className="font-mono text-text-primary font-medium">UGX 18,000</span>
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <h3 className="text-sm font-bold text-text-primary mb-2">Delivery address</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Sarah Namukasa<br/>
                    Plot 12, Kololo<br/>
                    Kampala Central<br/>
                    +256 772 123 456
                  </p>
                </div>

                <div className="py-4 flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Total paid</span>
                  <span className="font-mono font-bold text-primary-green">UGX 28,000</span>
                </div>
              </div>

              <div className="p-5 bg-background border-t border-border">
                <h3 className="text-sm font-bold text-text-primary mb-2">Need help?</h3>
                <p className="text-xs text-text-secondary mb-4">Having issues with your order? Contact our pharmacy support.</p>
                <Button variant="secondary" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact pharmacy
                </Button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
