'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Truck, Home, CheckCircle2, Loader2, Clock, ChevronRight, ShoppingCart, X, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/orders', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setIsLoading(false);
      })
      .catch(e => {
        console.error(e);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-green" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-background min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-6">
          <Package className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif text-text-primary mb-2">No orders yet</h1>
        <p className="text-text-secondary mb-8">You haven't placed any orders with us yet.</p>
        <Link href="/shop">
          <Button size="lg">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-serif text-text-primary mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map(order => {
            const isActive = order.status !== 'delivered' && order.status !== 'cancelled';
            return (
              <div key={order.id} className={`bg-surface rounded-xl border ${isActive ? 'border-primary-green/30 shadow-md' : 'border-border shadow-sm'} overflow-hidden`}>
                <div className={`p-4 md:p-6 border-b ${isActive ? 'bg-primary-light/10 border-primary-green/20' : 'bg-background/50 border-border'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-text-primary text-lg">Order #{order.orderNumber}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-[#E8F5EE] text-primary-green' : 
                        order.status === 'cancelled' ? 'bg-danger/10 text-danger' : 
                        'bg-[#FFF5E5] text-[#F4A820]'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                    <p className="text-xl font-mono font-bold text-primary-green">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {/* Progress Tracker (only if active) */}
                  {isActive && (
                    <div className="mb-8">
                      <div className="relative pt-2">
                        <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-border -z-10"></div>
                        <div className="absolute top-7 left-[10%] h-0.5 bg-primary-green -z-10 transition-all duration-1000" 
                             style={{ width: order.status === 'dispatched' || order.status === 'delivered' ? '50%' : '0%' }}></div>
                        
                        <div className="flex justify-between relative z-10">
                          <div className="flex flex-col items-center flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary-green text-surface flex items-center justify-center mb-3 ring-4 ring-surface">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-primary-green text-center">Confirmed</span>
                          </div>
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full ${order.status === 'packing' || order.status === 'dispatched' || order.status === 'delivered' ? 'bg-primary-green text-surface' : 'bg-background border-2 border-border text-text-muted'} flex items-center justify-center mb-3 ring-4 ring-surface`}>
                              <Package className="w-5 h-5" />
                            </div>
                            <span className={`text-xs ${order.status === 'packing' || order.status === 'dispatched' || order.status === 'delivered' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Packed</span>
                          </div>
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full ${order.status === 'dispatched' || order.status === 'delivered' ? 'bg-primary-green text-surface' : 'bg-background border-2 border-border text-text-muted'} flex items-center justify-center mb-3 ring-4 ring-surface`}>
                              <Truck className="w-5 h-5" />
                            </div>
                            <span className={`text-xs ${order.status === 'dispatched' || order.status === 'delivered' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Out for delivery</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 bg-background border border-border rounded-lg p-2 pr-4">
                          <div className="w-10 h-10 relative rounded bg-surface border border-border overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-text-primary line-clamp-1 max-w-[120px]">{item.name}</span>
                            <span className="text-xs text-text-secondary">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border text-xs font-bold text-text-secondary self-center">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                      <Button variant="outline" className="w-full" onClick={() => setViewingOrder(order)}>
                        View Receipt <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {viewingOrder && (
        <div className="fixed inset-0 bg-text-primary/50 z-50 backdrop-blur-sm transition-opacity flex items-center justify-center p-4" onClick={() => setViewingOrder(null)}>
          <div 
            className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-background/50">
              <h2 className="text-xl font-serif text-text-primary">Receipt #{viewingOrder.orderNumber}</h2>
              <button onClick={() => setViewingOrder(null)} className="p-2 text-text-secondary hover:text-text-primary bg-surface rounded-full border border-border hover:bg-border transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              <div>
                <h3 className="font-bold text-text-primary mb-3">Order Items</h3>
                <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {viewingOrder.items.map((item: any) => (
                    <div key={item.id} className="p-3 flex items-center gap-3 bg-surface">
                      <div className="w-12 h-12 relative bg-background border border-border rounded overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-secondary">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <div className="font-mono text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-background/50 space-y-2 text-sm">
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatPrice(viewingOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Delivery Fee</span>
                      <span className="font-mono">{formatPrice(viewingOrder.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="font-bold text-text-primary">Total</span>
                      <span className="font-mono font-bold text-lg text-primary-green">{formatPrice(viewingOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-green" /> 
                  Delivery Address
                </h3>
                <div className="p-4 border border-border rounded-xl bg-surface text-sm">
                  <p className="font-medium text-text-primary">{viewingOrder.deliveryAddress?.name}</p>
                  <p className="text-text-secondary mt-1">{viewingOrder.deliveryAddress?.street}, {viewingOrder.deliveryAddress?.district}</p>
                  <p className="text-text-secondary mt-1">{viewingOrder.deliveryAddress?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
