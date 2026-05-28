'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/admin/auth/login' })} className="flex items-center gap-2 text-sm text-danger hover:text-[#ff6b6b] transition-colors w-full p-2">
      <LogOut className="w-4 h-4" />
      Log out
    </button>
  );
}
