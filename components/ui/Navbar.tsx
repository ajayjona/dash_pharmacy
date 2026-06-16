'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { openCart } from '@/store/slices/cartSlice';
import { logoutRequest } from '@/store/slices/authSlice';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(state => state.cart.itemCount);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isLoggedIn = mounted ? isAuthenticated : false;
  const displayItemCount = mounted ? itemCount : 0;
  const isAdmin = user?.role === 'ADMIN';

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105" />
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
            onClick={() => dispatch(openCart())}
          >
            <ShoppingCart className="w-5 h-5" />
            {displayItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-surface bg-primary-green rounded-full transform translate-x-1/4 -translate-y-1/4">
                {displayItemCount}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-3 relative">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-primary-light text-primary-green flex items-center justify-center font-bold text-sm cursor-pointer border border-primary-green/20 hover:bg-primary-green hover:text-surface transition-colors"
                >
                  {getInitials(user?.name)}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-background hover:text-primary-green transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      href="/cart" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-background hover:text-primary-green transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      My Orders
                    </Link>
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        dispatch(logoutRequest());
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors border-t border-border mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
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
              <div className="flex items-center gap-2">
                <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-20 w-auto object-contain" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-secondary">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-4">
              <Link href="/shop" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              {isLoggedIn && (
                <Link href="/cart" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
              )}
              <Link href="/about" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="block text-lg font-medium text-text-primary hover:text-primary-green" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </nav>
            <div className="p-4 border-t border-border bg-background flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <div className="px-2 py-1 mb-2">
                    <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-start gap-2" variant="outline">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}

                  <Button 
                    className="w-full justify-start gap-2 text-danger border-danger/20 hover:bg-danger/5" 
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      dispatch(logoutRequest());
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
