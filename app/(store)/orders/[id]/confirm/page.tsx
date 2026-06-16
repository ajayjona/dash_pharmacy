'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Home, CheckCircle2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/formatters';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = React.use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading receipt...</div>;
  }

  if (!order || order.error || !Array.isArray(order.items)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-text-primary mb-2">Order Not Found</h2>
        <p className="text-text-secondary mb-6">{order?.error || "We couldn't retrieve your receipt details."}</p>
        <Link href="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24 print:pt-0 print:pb-0 print:bg-white">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Above the fold */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-6">
            <CheckCircle2 className="w-10 h-10 animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4 print:text-2xl">Order confirmed!</h1>
          <div className="inline-block bg-surface border border-border px-4 py-2 rounded-lg font-mono font-bold text-lg text-primary-green mb-4 shadow-sm print:shadow-none print:border-none print:p-0">
            #{order.orderNumber}
          </div>
          <p className="text-text-secondary text-lg max-w-lg mx-auto print:hidden">
            Thank you. We&apos;ve received your order and it is being prepared for delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 print:hidden">
            <Button size="lg" className="w-full sm:w-auto" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" /> Download Receipt
            </Button>
            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Continue shopping</Button>
            </Link>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="bg-surface rounded-xl border border-border p-6 md:p-8 mb-8 print:hidden">
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
                <div className={`w-10 h-10 rounded-full ${order.status !== 'pending' ? 'bg-primary-green text-surface' : 'bg-background border-2 border-border text-text-muted'} flex items-center justify-center mb-3 ring-4 ring-surface`}>
                  <Package className="w-5 h-5" />
                </div>
                <span className={`text-xs ${order.status !== 'pending' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Being<br/>packed</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full ${order.status === 'delivering' || order.status === 'completed' ? 'bg-primary-green text-surface' : 'bg-background border-2 border-border text-text-muted'} flex items-center justify-center mb-3 ring-4 ring-surface`}>
                  <Truck className="w-5 h-5" />
                </div>
                <span className={`text-xs ${order.status === 'delivering' || order.status === 'completed' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Out for<br/>delivery</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full ${order.status === 'completed' ? 'bg-primary-green text-surface' : 'bg-background border-2 border-border text-text-muted'} flex items-center justify-center mb-3 ring-4 ring-surface`}>
                  <Home className="w-5 h-5" />
                </div>
                <span className={`text-xs ${order.status === 'completed' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Delivered</span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-text-secondary mt-8 pt-6 border-t border-border">
            You&apos;ll receive an SMS update at each stage.
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 md:p-6 border-b border-border bg-background/50 print:bg-transparent print:px-0">
            <h2 className="text-lg font-bold text-text-primary">Order details</h2>
          </div>
          
          <div className="p-4 md:p-6 divide-y divide-border print:px-0">
            <div className="pb-4 mb-4">
              <div className="text-sm text-text-secondary mb-2">Items</div>
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-medium text-text-primary">{item.quantity}x {item.name}</span>
                    <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="py-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-text-secondary mb-1">Delivery address</div>
                <p className="text-sm font-medium text-text-primary">{order.deliveryAddress?.name}</p>
                <p className="text-sm text-text-primary">{order.deliveryAddress?.street}</p>
                <p className="text-sm text-text-primary">{order.deliveryAddress?.district}</p>
                <p className="text-sm text-text-primary">{order.deliveryAddress?.phone}</p>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Date</div>
                <p className="text-sm font-medium text-text-primary">
                  {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-text-secondary">Delivery</span>
                <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-text-secondary">Payment method</span>
                <span className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-text-secondary">Payment status</span>
                <span className={`font-medium uppercase ${order.paymentStatus === 'paid' ? 'text-primary-green' : 'text-[#F4A820]'}`}>{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="font-bold text-text-primary">{order.paymentStatus === 'paid' ? 'Total paid' : 'Total due'}</span>
                <span className="font-mono font-bold text-primary-green text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
