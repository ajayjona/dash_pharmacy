'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [title, setTitle] = useState((session?.user as any)?.title || '');
  const [image, setImage] = useState((session?.user as any)?.image || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, title, image, currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

      setMessage({ text: 'Credentials updated successfully. Please log in again if you changed your email or password.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-serif text-text-primary mb-6">Admin Credentials</h1>
      
      <div className="bg-surface rounded-xl border border-border p-6 md:p-8 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-5">
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-text-muted" />
              </div>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Job Title / Post</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Pharmacy Manager"
              className="block w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Profile Picture URL</label>
            <input 
              type="url" 
              value={image} 
              onChange={e => setImage(e.target.value)} 
              placeholder="https://example.com/photo.jpg"
              className="block w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" 
            />
            {image && (
              <div className="mt-3">
                <img src={image} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border border-border" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-6">
            <h3 className="text-sm font-bold text-text-primary mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Current Password (required to change credentials)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-text-muted" />
                  </div>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    placeholder="Enter current password"
                    className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">New Password (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-text-muted" />
                  </div>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Leave blank to keep same"
                    className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary-green" 
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading || !currentPassword}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Credentials
          </Button>
        </form>
      </div>
    </div>
  );
}
