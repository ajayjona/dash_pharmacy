'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginRequest } from '@/store/slices/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector(state => state.auth);
  
  const router = useRouter();
  // We can't use useSearchParams directly without suspense boundary warning, so we use optional fallback or just redirect to /admin by default if they are admin.
  // Actually Next.js 14 requires Suspense if we use useSearchParams, so we'll just redirect to /admin after success.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get('callbackUrl') || '/';
    
    dispatch(loginRequest({ email, password, callbackUrl }));
  };

  React.useEffect(() => {
    if (authError) {
      setErrors({ general: authError });
    }
  }, [authError]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-sm border border-border p-8 animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <Link href="/" className="mb-2 flex items-center justify-center gap-2 group">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-serif text-text-primary mb-1 mt-4">Welcome back</h1>
          <p className="text-text-secondary text-sm">Log in to your Dash Care account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center font-medium">
              {errors.general}
            </div>
          )}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: undefined}); }}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-background text-sm focus:outline-none transition-colors ${errors.email ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger' : 'border-border focus:border-primary-green focus:ring-1 focus:ring-primary-green'}`}
              />
            </div>
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: undefined}); }}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-background text-sm focus:outline-none transition-colors ${errors.password ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger' : 'border-border focus:border-primary-green focus:ring-1 focus:ring-primary-green'}`}
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
            
            <div className="text-right mt-2">
              <Link href="/auth/forgot-password" className="text-xs font-medium text-primary-green hover:underline">Forgot password?</Link>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            Log in
          </Button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-text-muted uppercase">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <Link href="/checkout">
          <Button variant="outline" className="w-full mb-6">
            Continue as guest
          </Button>
        </Link>

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account? <Link href="/auth/register" className="font-bold text-primary-green hover:underline">Sign up</Link>
        </p>

      </div>
    </div>
  );
}
