'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Truck, Home, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = React.use(params); // e.g. MR-2025-00431

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Above the fold */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-6">
            <CheckCircle2 className="w-10 h-10 animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4">Order confirmed!</h1>
          <div className="inline-block bg-surface border border-border px-4 py-2 rounded-lg font-mono font-bold text-lg text-primary-green mb-4 shadow-sm">
            #{orderId}
          </div>
          <p className="text-text-secondary text-lg max-w-lg mx-auto">
            Thank you. We&apos;ve received your order and it is being prepared for delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href={`/orders/${orderId}`}>
              <Button size="lg" className="w-full sm:w-auto">Track your order</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Continue shopping</Button>
            </Link>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="bg-surface rounded-xl border border-border p-6 md:p-8 mb-8">
          <h3 className="font-bold text-text-primary mb-6 text-center">What happens next?</h3>
          
          <div className="relative">
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border -z-10"></div>
            
            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-primary-green text-surface flex items-center justify-center mb-3 ring-4 ring-surface">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-primary-green text-center">Order<br/>confirmed</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-background border-2 border-border text-text-muted flex items-center justify-center mb-3 ring-4 ring-surface">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-text-muted text-center">Being<br/>packed</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-background border-2 border-border text-text-muted flex items-center justify-center mb-3 ring-4 ring-surface">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-text-muted text-center">Out for<br/>delivery</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-background border-2 border-border text-text-muted flex items-center justify-center mb-3 ring-4 ring-surface">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-text-muted text-center">Delivered</span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-text-secondary mt-8 pt-6 border-t border-border">
            You&apos;ll receive an SMS update at each stage.
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="p-4 md:p-6 border-b border-border bg-background/50">
            <h2 className="text-lg font-bold text-text-primary">Order details</h2>
          </div>
          
          <div className="p-4 md:p-6 divide-y divide-border">
            <div className="pb-4 mb-4">
              <div className="text-sm text-text-secondary mb-2">Items</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text-primary">2x Paracetamol 500mg</span>
                  <span className="font-mono">UGX 5,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text-primary">1x Vitamin C 1000mg</span>
                  <span className="font-mono">UGX 18,000</span>
                </div>
              </div>
            </div>
            
            <div className="py-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-text-secondary mb-1">Delivery address</div>
                <p className="text-sm font-medium text-text-primary">Sarah Namukasa</p>
                <p className="text-sm text-text-primary">Plot 12, Kololo</p>
                <p className="text-sm text-text-primary">Kampala Central</p>
                <p className="text-sm text-text-primary">+256 772 123 456</p>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Estimated delivery time</div>
                <p className="text-sm font-medium text-text-primary">Today, 2:00 PM - 4:00 PM</p>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-text-secondary">Payment method</span>
                <span className="font-medium">MTN MoMo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary">Total paid</span>
                <span className="font-mono font-bold text-primary-green text-lg">UGX 28,000</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
