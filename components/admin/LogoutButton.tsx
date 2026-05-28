'use client';

import React, { useState } from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)} 
        className="flex items-center justify-center gap-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors w-full p-2.5 rounded-lg"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-xl font-serif text-text-primary mb-2">Confirm Logout</h3>
              <p className="text-sm text-text-secondary mb-6">
                Are you sure you want to securely end your administrative session? You will need to sign in again.
              </p>
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  className="flex-1" 
                  onClick={() => signOut({ callbackUrl: '/admin/auth/login' })}
                >
                  Yes, Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
