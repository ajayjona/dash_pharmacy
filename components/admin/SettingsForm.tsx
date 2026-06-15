'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import { User, Mail, Lock, Loader2, Briefcase, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    title: string | null;
    image: string | null;
  }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Profile State prefilled from live database
  const [name, setName] = useState(initialData.name || '');
  const [title, setTitle] = useState(initialData.title || '');
  const [image, setImage] = useState(initialData.image || '');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Security State
  const [email, setEmail] = useState(initialData.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'profile', name, title, image })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      
      // Update local session to trigger client re-renders if necessary
      dispatch(initializeAuth());
      // Force the server to refetch layouts
      router.refresh();
      
    } catch (err: any) {
      setProfileMsg({ text: err.message, type: 'error' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSecurityLoading(true);
    setSecurityMsg(null);

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'security', email, currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update security credentials');

      setSecurityMsg({ text: 'Security credentials updated securely.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      router.refresh();
    } catch (err: any) {
      setSecurityMsg({ text: err.message, type: 'error' });
    } finally {
      setIsSecurityLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Account Settings</h1>
        <p className="text-text-secondary text-base mt-2">Manage your administrative profile and security preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Section */}
        <section className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-border bg-background/50 px-6 py-4 flex items-center gap-3">
            <User className="w-5 h-5 text-primary-green" />
            <h2 className="font-semibold text-text-primary">Public Profile</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6 flex-1 flex flex-col">
            {profileMsg && (
              <div className={`p-3 rounded-lg text-sm font-medium ${profileMsg.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                {profileMsg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Profile Picture</label>
              <ImageUploader value={image} onChange={setImage} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-muted" />
                  </div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-base focus:outline-none focus:border-primary-green transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Job Title / Post</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-text-muted" />
                  </div>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-base focus:outline-none focus:border-primary-green transition-colors" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Button type="submit" size="lg" className="w-full text-base font-medium" disabled={isProfileLoading}>
                {isProfileLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Profile Changes
              </Button>
            </div>
          </form>
        </section>

        {/* Security Section */}
        <section className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-border bg-danger/5 px-6 py-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-danger" />
            <h2 className="font-semibold text-text-primary">Login & Security</h2>
          </div>
          
          <form onSubmit={handleSecurityUpdate} className="p-6 space-y-6 flex-1 flex flex-col">
            {securityMsg && (
              <div className={`p-3 rounded-lg text-sm font-medium ${securityMsg.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                {securityMsg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address (Login ID)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-base focus:outline-none focus:border-danger transition-colors" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
                <Key className="w-5 h-5 text-danger" /> Change Password
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-muted" />
                    </div>
                    <input 
                      type="password" 
                      value={currentPassword} 
                      onChange={e => setCurrentPassword(e.target.value)} 
                      required
                      placeholder="Required for any security changes"
                      className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-base focus:outline-none focus:border-danger transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-muted" />
                    </div>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      placeholder="Leave blank to keep current password"
                      className="block w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-background text-base focus:outline-none focus:border-danger transition-colors" 
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-2">Must be at least 6 characters long.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Button type="submit" variant="danger" size="lg" className="w-full text-base font-medium" disabled={isSecurityLoading || !currentPassword}>
                {isSecurityLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Security Settings
              </Button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
}
