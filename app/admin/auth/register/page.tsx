'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone, Briefcase, Image as ImageIcon, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminRegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name || !title || !image) {
      setError("Name, Job Title, and Profile Picture are mandatory for Admin Profiles.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, title, image })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register admin');
      }

      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-center items-center px-4 py-12">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg border border-border p-8 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-border">
          <div className={`h-full bg-primary-green transition-all duration-500 ease-in-out ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
        </div>

        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl font-serif text-text-primary mb-1 mt-2">Admin Setup</h1>
          <p className="text-text-secondary text-sm">
            {step === 1 ? "Step 1: Security Credentials" : "Step 2: Professional Profile"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center font-medium">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-6">
              Continue to Profile <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Job Title / Post</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-text-muted" />
                </div>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Lead Pharmacist" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Profile Picture URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-text-muted" />
                </div>
                <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/avatar.jpg" required className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" />
              </div>
              {image && (
                <div className="mt-3 flex justify-center">
                  <img src={image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-border shadow-sm" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-text-muted" />
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" size="lg" className="px-4" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                Complete Setup
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
