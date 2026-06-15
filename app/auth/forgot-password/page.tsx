'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-sm border border-border p-8 animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <Link href="/" className="mb-2 flex items-center justify-center gap-2 group">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="text-2xl font-serif text-text-primary mb-1 mt-4">Reset Password</h1>
          {!isSuccess && (
            <p className="text-text-secondary text-sm">Enter your email and we'll send you a link to reset your password.</p>
          )}
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-4 animate-in fade-in">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Check your email</h3>
            <p className="text-text-secondary text-sm text-center mb-8">
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link href="/auth/login" className="w-full">
              <Button size="lg" className="w-full">
                Back to log in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center font-medium">
                {error}
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading || !email}>
              {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Send reset link
            </Button>
            
            <div className="text-center mt-6">
              <Link href="/auth/login" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-primary-green transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
