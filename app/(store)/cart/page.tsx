'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
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

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-6">
          <ShoppingCart className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif text-text-primary mb-2">Your cart is empty.</h1>
        <p className="text-text-secondary mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button size="lg">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
      </div>
    </div>
  );
}
