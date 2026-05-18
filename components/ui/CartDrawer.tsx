'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '@/lib/formatters';
import { Button } from './Button';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={closeCart}
      />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-surface shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl font-serif text-text-primary">Your cart ({itemCount})</h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-background rounded-full transition-colors text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary-green">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-text-primary mb-1">Your cart is empty</h3>
                <p className="text-text-muted text-sm">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <Button onClick={closeCart} className="mt-4">
                Shop now
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background flex-shrink-0 border border-border">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary line-clamp-1">{item.product.name}</h4>
                      <div className="font-mono text-sm text-primary-green mt-1">
                        {formatPrice(item.product.price)}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-text-muted hover:text-danger p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button 
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-text-muted hover:text-primary-green transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono w-6 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-text-muted hover:text-primary-green transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-mono text-sm font-bold text-text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 md:p-6 border-t border-border bg-background">
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-secondary font-medium">Subtotal</span>
              <span className="font-mono text-lg font-bold text-primary-green">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/cart" onClick={closeCart}>
              <Button className="w-full mb-3" size="lg">
                Proceed to checkout
              </Button>
            </Link>
            <div className="text-center">
              <button onClick={closeCart} className="text-primary-green text-sm hover:underline font-medium">
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
