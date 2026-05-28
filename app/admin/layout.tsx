import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart2, Settings } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminLayout({
  children,
}: {
}) {
  const session = await getServerSession(authOptions);
  const adminName = session?.user?.name || "Administrator";
  const adminTitle = (session?.user as any)?.title || "Admin";
  const adminImage = (session?.user as any)?.image;
  const adminInitials = adminName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F9F8]">
      
      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <aside className="fixed bottom-0 left-0 right-0 md:static md:w-[240px] shrink-0 bg-[#0F3D29] text-white z-50 md:min-h-screen flex md:flex-col md:items-stretch overflow-y-auto overflow-x-hidden md:overflow-y-auto hide-scrollbar">
        
        {/* Logo */}
        <div className="hidden md:flex p-6 border-b border-white/10 items-center">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-20 w-auto object-contain brightness-0 invert" />
            <span className="ml-2 text-[10px] uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex md:flex-col items-center md:items-stretch justify-around md:justify-start p-2 md:p-4 gap-1 md:gap-2">
          <Link href="/admin" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium">Orders</span>
          </Link>
          <Link href="/admin/products" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <Package className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium">Products</span>
          </Link>
          <Link href="/admin/customers" className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <Users className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium">Customers</span>
          </Link>
          <div className="hidden md:flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg text-white/40 cursor-not-allowed">
            <BarChart2 className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium">Reports</span>
          </div>
        </nav>

        {/* Profile / Logout */}
        <div className="hidden md:block p-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            {adminImage ? (
              <img src={adminImage} alt={adminName} className="w-8 h-8 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">{adminInitials}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminName}</p>
              <p className="text-xs text-white/50 truncate">{adminTitle}</p>
            </div>
          </div>
          <Link href="/admin/settings" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-full p-2 mb-1">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-surface border-b border-border p-4 flex justify-between items-center sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-16 w-auto object-contain" />
            <span className="ml-1 text-[10px] uppercase text-text-muted">Admin</span>
          </Link>
          {adminImage ? (
            <img src={adminImage} alt={adminName} className="w-8 h-8 rounded-full object-cover border border-primary-light" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary-green text-sm">{adminInitials}</div>
          )}
        </div>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}
