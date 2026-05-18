'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { itemCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Mock login state for now
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-30 w-full bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="text-2xl font-serif tracking-tight flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-green flex items-center justify-center text-surface font-sans font-black text-lg shadow-sm transition-transform group-hover:scale-105">
              D
            </div>
            <div>
              <span className="text-text-primary font-bold">Dash</span>
              <span className="text-primary-green font-medium">Care</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-full bg-background text-sm placeholder-text-muted focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors"
            placeholder="Search medicines, vitamins..."
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <button 
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>

          <Link href="/shop" className="hidden md:block text-sm font-medium text-text-secondary hover:text-primary-green transition-colors">
            Shop
          </Link>

          <button 
            className="relative p-2 text-text-secondary hover:text-primary-green transition-colors"
            onClick={openCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-surface bg-primary-green rounded-full transform translate-x-1/4 -translate-y-1/4">
                {itemCount}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary-green flex items-center justify-center font-bold text-sm cursor-pointer border border-primary-green/20">
                JD
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-text-secondary hover:text-primary-green transition-colors">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-surface px-4 flex items-center gap-3 z-50 animate-in slide-in-from-top-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              autoFocus
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-full bg-background text-sm placeholder-text-muted focus:outline-none focus:border-primary-green"
              placeholder="Search..."
            />
          </div>
          <button onClick={() => setIsSearchOpen(false)} className="text-text-secondary">
            Cancel
          </button>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-text-primary/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-sm bg-surface h-full shadow-xl flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="text-xl font-serif tracking-tight flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-green flex items-center justify-center text-surface font-sans font-black text-md">
                  D
                </div>
                <div>
                  <span className="text-text-primary font-bold">Dash</span>
                  <span className="text-primary-green font-medium">Care</span>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-secondary">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-4">
              <Link href="/shop" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link href="/about" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </nav>
            <div className="p-4 border-t border-border bg-background flex flex-col gap-3">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
