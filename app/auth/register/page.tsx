'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  // Calculate password strength (0 to 3)
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-sm border border-border p-8 animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif tracking-tight mb-2 inline-block">
            <span className="text-text-primary font-bold">Med</span>
            <span className="text-primary-green">Run</span>
          </Link>
          <h1 className="text-2xl font-serif text-text-primary mb-1 mt-4">Create your account</h1>
          <p className="text-text-secondary text-sm">Join MedRun for faster checkouts and easy refills.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = '/shop'; }}>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-text-muted" />
              </div>
              <input type="text" placeholder="Full name" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input type="email" placeholder="Email address" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-text-muted" />
              </div>
              <input type="tel" placeholder="Phone number" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
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
              <input type={showPassword ? 'text' : 'password'} placeholder="Confirm password" required className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-colors" />
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2 pt-2">
            <input type="checkbox" required className="mt-1 w-4 h-4 text-primary-green focus:ring-primary-green border-border rounded" />
            <p className="text-xs text-text-secondary leading-snug">
              I agree to the <Link href="#" className="text-primary-green hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary-green hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full mt-6">
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
