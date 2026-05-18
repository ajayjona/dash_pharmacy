'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
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

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-1 text-xs text-text-muted">{category}</div>
        <Link href={`/shop/${slug}`} className="flex-1">
          <h3 className="text-text-primary font-medium line-clamp-2 leading-snug mb-3 hover:text-primary-green transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-4 mt-auto">
          <div>
            <span className="font-mono font-bold text-primary-green text-lg">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-[10px] bg-warning text-surface px-1.5 py-0.5 rounded font-bold">
                  SALE
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant={inStock ? (requiresPrescription ? 'outline' : 'primary') : 'ghost'}
          disabled={!inStock}
          className="w-full"
          onClick={() => {
            if (requiresPrescription) {
              window.location.href = `/shop/${slug}`;
            } else {
              addItem(product);
            }
          }}
        >
          {requiresPrescription ? (
            'View details'
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
