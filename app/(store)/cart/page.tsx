'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle2, Lock, Package, Truck, Home, ChevronRight, X, MapPin, Clock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateQuantity, removeItem } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total: subtotal } = useAppSelector(state => state.cart);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const router = useRouter();

  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  const activeOrders = allOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = allOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  React.useEffect(() => {
    const fetchActiveOrders = () => {
      if (isAuthenticated) {
        fetch(`/api/orders?_t=${Date.now()}`, { cache: 'no-store' })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setAllOrders(data);
            }
          })
          .catch(console.error);
      }
    };

    fetchActiveOrders();

    // Aggressively refetch if the user navigates back to this tab or uses the back button
    window.addEventListener('focus', fetchActiveOrders);
    window.addEventListener('popstate', fetchActiveOrders);
    
    return () => {
      window.removeEventListener('focus', fetchActiveOrders);
      window.removeEventListener('popstate', fetchActiveOrders);
    };
  }, [isAuthenticated]);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'DASHCARE10') {
      setAppliedPromo('DASHCARE10');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const discount = appliedPromo === 'DASHCARE10' ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 50000 ? 0 : 5000;
  const total = subtotal - discount + deliveryFee;

  const renderActiveOrders = () => {
    if (activeOrders.length === 0) return null;
    return (
      <div className="mb-8 space-y-4">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-primary-light/30 border border-primary-green/30 rounded-xl p-4 md:p-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-text-primary text-lg">Active Order <span className="text-primary-green font-mono">#{order.orderNumber}</span></h3>
                <p className="text-sm text-text-secondary">
                  {order.items?.length || 0} items • {formatPrice(order.total)}
                </p>
              </div>
              <div className="flex gap-2">
                {order.paymentStatus === 'pending' && order.total > 0 && (
                  <Button variant="primary" size="sm" onClick={() => router.push(`/checkout/pay?orderId=${order.id}`)}>
                    Complete Payment
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>
                  View Receipt <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="relative pt-2">
              <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-border -z-10"></div>
              <div className="absolute top-7 left-[10%] h-0.5 bg-primary-green -z-10 transition-all duration-1000" 
                   style={{ width: order.status === 'dispatched' || order.status === 'delivered' ? '50%' : '0%' }}></div>
              
              <div className="flex justify-between relative z-10">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary-green text-surface flex items-center justify-center mb-3 ring-4 ring-primary-light/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-primary-green text-center">Order<br/>confirmed</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full ${order.status === 'packing' || order.status === 'dispatched' || order.status === 'delivered' ? 'bg-primary-green text-surface ring-primary-light/30' : 'bg-background border-2 border-border text-text-muted ring-background'} flex items-center justify-center mb-3 ring-4`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <span className={`text-xs ${order.status === 'packing' || order.status === 'dispatched' || order.status === 'delivered' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Being<br/>packed</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full ${order.status === 'dispatched' || order.status === 'delivered' ? 'bg-primary-green text-surface ring-primary-light/30' : 'bg-background border-2 border-border text-text-muted ring-background'} flex items-center justify-center mb-3 ring-4`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className={`text-xs ${order.status === 'dispatched' || order.status === 'delivered' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Out for<br/>delivery</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full ${order.status === 'delivered' ? 'bg-primary-green text-surface ring-primary-light/30' : 'bg-background border-2 border-border text-text-muted ring-background'} flex items-center justify-center mb-3 ring-4`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <span className={`text-xs ${order.status === 'delivered' ? 'font-bold text-primary-green' : 'font-medium text-text-muted'} text-center`}>Delivered</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOrderHistory = () => {
    if (pastOrders.length === 0) return null;
    return (
      <div className="mt-16 pt-12 border-t border-border">
        <h2 className="text-2xl font-serif text-text-primary mb-8">Order History</h2>
        <div className="space-y-6">
          {pastOrders.map(order => (
            <div key={order.id} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 md:p-6 border-b bg-background/50 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          ))}
        </div>
      </div>
    );
  };

  const renderViewingOrderModal = () => {
    if (!viewingOrder) return null;
    return (
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
    );
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {renderActiveOrders()}
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface rounded-xl border border-border mt-4">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-6">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-serif text-text-primary mb-2">Your cart is empty.</h1>
            <p className="text-text-secondary mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop">
              <Button size="lg">Start shopping</Button>
            </Link>
          </div>
          {renderOrderHistory()}
          {renderViewingOrderModal()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderActiveOrders()}
        
        <h1 className="text-3xl font-serif text-text-primary mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left - Cart Items */}
          <div className="flex-1">
            <div className="bg-surface rounded-xl border border-border overflow-hidden mb-6">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border text-sm font-medium text-text-secondary bg-background/50">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.product.id} className="p-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4">
                    
                    {/* Product Info */}
                    <div className="md:col-span-6 flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg bg-background border border-border shrink-0 overflow-hidden">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/shop/${item.product.slug}`} className="text-text-primary font-medium hover:text-primary-green transition-colors line-clamp-2 mb-1">
                          {item.product.name}
                        </Link>
                        <span className="text-xs text-text-muted">{item.product.category}</span>
                      </div>
                    </div>
                    
                    {/* Price (Mobile & Desktop) */}
                    <div className="md:col-span-2 md:text-center text-sm font-mono text-text-secondary hidden md:block">
                      {formatPrice(item.product.price)}
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center justify-between md:col-span-4 md:justify-end gap-4 mt-2 md:mt-0">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity - 1 }))}
                          className="p-2 text-text-muted hover:text-primary-green transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => dispatch(updateQuantity({ id: item.product.id, quantity: parseInt(e.target.value) || 1 }))}
                          className="w-12 text-center font-mono font-medium text-sm border-none focus:ring-0 bg-transparent p-0"
                        />
                        <button 
                          onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity + 1 }))}
                          className="p-2 text-text-muted hover:text-primary-green transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="font-mono font-bold text-text-primary md:w-24 md:text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      
                      <button 
                        onClick={() => dispatch(removeItem(item.product.id))}
                        className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Link href="/shop" className="inline-flex items-center text-primary-green hover:underline font-medium text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue shopping
              </Link>
              
              <div className="w-full sm:w-auto flex gap-2">
                <input 
                  type="text" 
                  placeholder="Promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!appliedPromo}
                  className="w-full sm:w-48 px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-50"
                />
                <Button variant="secondary" onClick={handleApplyPromo} disabled={!!appliedPromo || !promoCode}>
                  Apply
                </Button>
              </div>
            </div>
            {promoError && <p className="text-danger text-sm mt-2 text-right">{promoError}</p>}
            {appliedPromo && (
              <p className="text-primary-green text-sm mt-2 text-right flex items-center justify-end gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Code {appliedPromo} applied
              </p>
            )}
          </div>

          {/* Right - Order Summary */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-surface rounded-xl border border-border p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-serif text-text-primary mb-6">Order summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-mono text-text-primary">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-primary-green">
                    <span>Discount ({appliedPromo})</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery fee</span>
                  <span className="font-mono">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-xs text-text-muted mt-1">
                    Free delivery for orders over UGX 50,000
                  </div>
                )}
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-text-primary">Total</span>
                  <span className="text-2xl font-mono font-bold text-primary-green">{formatPrice(total)}</span>
                </div>
              </div>
              
              <Button size="lg" className="w-full mb-6" onClick={() => router.push('/checkout')}>
                Proceed to checkout
              </Button>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-1 bg-background text-xs font-bold text-text-secondary rounded border border-border">MTN MoMo</span>
                  <span className="px-2 py-1 bg-background text-xs font-bold text-text-secondary rounded border border-border">Airtel Money</span>
                  <span className="px-2 py-1 bg-background text-xs font-bold text-text-secondary rounded border border-border">VISA</span>
                </div>
                <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Secure checkout powered by Flutterwave
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {renderOrderHistory()}
        {renderViewingOrderModal()}
      </div>
    </div>
  );
}
