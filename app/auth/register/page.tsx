'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { loginRequest } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Calculate password strength (0 to 3)
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register');
      }

      dispatch(loginRequest({ email, password, callbackUrl: '/' }));
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
          <h1 className="text-2xl font-serif text-text-primary mb-1 mt-4">Create your account</h1>
          <p className="text-text-secondary text-sm">Join Dash Care for faster checkouts and easy refills.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-text-muted" />
              </div>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-text-muted" />
              </div>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2 pt-2">
            <input type="checkbox" required className="mt-1 w-4 h-4 text-primary-green focus:ring-primary-green border-border rounded" />
            <p className="text-xs text-text-secondary leading-snug">
              I agree to the <Link href="#" className="text-primary-green hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary-green hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Already have an account? <Link href="/auth/login" className="font-bold text-primary-green hover:underline">Log in</Link>
        </p>

      </div>
    </div>
  );
}
