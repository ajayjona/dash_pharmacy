'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  // Calculate password strength (0 to 3)
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsSuccess(true);
      // Wait a moment then redirect to login
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center font-medium mb-6">
          Invalid or missing reset token. Please request a new password reset.
        </div>
        <Link href="/auth/forgot-password">
          <Button>Request Password Reset</Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 animate-in fade-in">
        <h3 className="text-xl font-bold text-text-primary mb-2">Password reset successful!</h3>
        <p className="text-text-secondary text-sm text-center mb-6">
          Your password has been successfully updated. Redirecting to login...
        </p>
        <Link href="/auth/login" className="w-full">
          <Button className="w-full">
            Log in now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors"
          />
          <button 
            type="button" 
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="mt-2 flex gap-1 h-1.5 w-full">
            <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-danger' : 'bg-border'}`}></div>
            <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-warning' : 'bg-border'}`}></div>
            <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-primary-green' : 'bg-border'}`}></div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Confirm New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-text-muted" />
          </div>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            placeholder="Confirm new password" 
            required 
            className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" 
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-6" disabled={isLoading || password.length < 6}>
        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
        Reset password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-sm border border-border p-8 animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <Link href="/" className="mb-2 flex items-center justify-center gap-2 group">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-serif text-text-primary mb-1 mt-4">Create new password</h1>
          <p className="text-text-secondary text-sm">Your new password must be different from previous used passwords.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary-green" /></div>}>
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}
