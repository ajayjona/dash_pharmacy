'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addItem, updateQuantity } from '@/store/slices/cartSlice';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => state.cart.items.find(item => item.product.id === product.id));
  const { name, price, originalPrice, image, category, inStock, requiresPrescription, slug } = product;

  return (
    <div className="group relative flex flex-col bg-surface rounded-xl border border-border shadow-sm hover:scale-[1.02] hover:border-primary-green transition-all duration-200">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-background">
        <Link href={`/shop/${slug}`}>
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${!inStock ? 'opacity-50 grayscale' : ''}`}
          />
        </Link>
        
        {requiresPrescription && (
          <div className="absolute top-2 left-2 bg-[#FEF3E8] text-[#B36B00] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Rx Required
          </div>
        )}
        
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-surface text-danger text-sm font-bold px-3 py-1 rounded-full">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-5">
        <div className="mb-1 text-[10px] sm:text-xs text-text-muted">{category}</div>
        <Link href={`/shop/${slug}`} className="flex-1">
          <h3 className="text-sm sm:text-base text-text-primary font-medium line-clamp-2 leading-snug mb-2 sm:mb-3 hover:text-primary-green transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3 sm:mb-4 mt-auto">
          <div>
            <span className="font-mono font-bold text-primary-green text-base sm:text-lg">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                <span className="text-[10px] sm:text-xs text-text-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-[9px] sm:text-[10px] bg-warning text-surface px-1 sm:px-1.5 py-0.5 rounded font-bold">
                  SALE
                </span>
              </div>
            )}
          </div>
        </div>

        {requiresPrescription ? (
          <Button
            variant="outline"
            disabled={!inStock}
            className="w-full text-xs sm:text-sm py-2 sm:py-2.5 h-auto"
            onClick={() => window.location.href = `/shop/${slug}`}
          >
            View details
          </Button>
        ) : cartItem ? (
          <div className="flex items-center justify-between border-2 border-primary-green rounded-lg text-primary-green overflow-hidden">
            <button 
              className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-primary-green/10 transition-colors"
              onClick={() => dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity - 1 }))}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm sm:text-base">
              {cartItem.quantity}
            </span>
            <button 
              className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-primary-green/10 transition-colors"
              onClick={() => dispatch(updateQuantity({ id: product.id, quantity: cartItem.quantity + 1 }))}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button
            variant={inStock ? 'primary' : 'ghost'}
            disabled={!inStock}
            className="w-full text-xs sm:text-sm py-2 sm:py-2.5 h-auto"
            onClick={() => dispatch(addItem(product))}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
};
