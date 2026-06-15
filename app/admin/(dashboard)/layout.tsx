import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart2, Settings, UserPlus } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import ActiveLink from '@/components/admin/ActiveLink';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminLayout({
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let adminName = "Administrator";
  let adminTitle = "Admin";
  let adminImage = null;

  if (session?.user?.email) {
    const userDb = await prisma.customer.findUnique({
      where: { email: session.user.email },
      select: { image: true, name: true, title: true }
    });
    if (userDb) {
      adminImage = userDb.image;
      if (userDb.name) adminName = userDb.name;
      if (userDb.title) adminTitle = userDb.title;
    }
  }

  const adminInitials = adminName.substring(0, 2).toUpperCase();

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  };

  const formattedName = toTitleCase(adminName);
  const formattedTitle = toTitleCase(adminTitle);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#F7F9F8] overflow-hidden">
      
      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <aside className="fixed bottom-0 left-0 right-0 md:static md:w-[240px] shrink-0 bg-[#0F3D29] text-white z-50 md:h-screen flex md:flex-col md:items-stretch overflow-hidden">
        
        {/* Logo */}
        <div className="hidden md:flex p-6 border-b border-white/10 items-center justify-center bg-white/5 m-4 rounded-xl">
          <Link href="/admin" className="flex flex-col items-center gap-2">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-18 w-auto object-contain" />
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Admin Portal</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex md:flex-col items-center md:items-stretch justify-around md:justify-start p-2 md:p-4 gap-1 md:gap-2">
          <ActiveLink 
            href="/admin" 
            exact={true}
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg transition-colors"
            inactiveClassName="text-white/70 hover:bg-white/10 hover:text-white font-medium"
            activeClassName="bg-primary-green text-white font-bold shadow-md border border-white/20"
          >
            <LayoutDashboard className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm">Dashboard</span>
          </ActiveLink>
          <ActiveLink 
            href="/admin/orders" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg transition-colors"
            inactiveClassName="text-white/70 hover:bg-white/10 hover:text-white font-medium"
            activeClassName="bg-primary-green text-white font-bold shadow-md border border-white/20"
          >
            <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm">Orders</span>
          </ActiveLink>
          <ActiveLink 
            href="/admin/products" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg transition-colors"
            inactiveClassName="text-white/70 hover:bg-white/10 hover:text-white font-medium"
            activeClassName="bg-primary-green text-white font-bold shadow-md border border-white/20"
          >
            <Package className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm">Products</span>
          </ActiveLink>
          <ActiveLink 
            href="/admin/customers" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg transition-colors"
            inactiveClassName="text-white/70 hover:bg-white/10 hover:text-white font-medium"
            activeClassName="bg-primary-green text-white font-bold shadow-md border border-white/20"
          >
            <Users className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm">Customers</span>
          </ActiveLink>
          <ActiveLink 
            href="/admin/invitations" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg transition-colors"
            inactiveClassName="text-white/70 hover:bg-white/10 hover:text-white font-medium"
            activeClassName="bg-primary-green text-white font-bold shadow-md border border-white/20"
          >
            <UserPlus className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm">Team</span>
          </ActiveLink>
          <div className="hidden md:flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 rounded-lg text-white/40 cursor-not-allowed">
            <BarChart2 className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm font-medium">Reports</span>
          </div>
        </nav>

        {/* Profile / Logout */}
        <div className="hidden md:flex flex-col items-center p-6 border-t border-white/10 mt-auto bg-black/10">
          <div className="flex flex-col items-center text-center gap-3 mb-5 w-full">
            {adminImage ? (
              <img src={adminImage} alt={formattedName} className="w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl shadow-lg">{adminInitials}</div>
            )}
            <div className="w-full min-w-0 px-2">
              <p className="text-lg font-bold truncate tracking-tight">{formattedName}</p>
              <p className="text-xs font-medium text-white/50 truncate uppercase tracking-widest mt-1">{formattedTitle}</p>
            </div>
          </div>
          <div className="w-full space-y-1">
            <ActiveLink 
              href="/admin/settings" 
              className="flex items-center justify-center gap-2 text-sm rounded-lg transition-colors w-full p-2.5"
              inactiveClassName="text-white/80 hover:bg-white/10 hover:text-white font-medium"
              activeClassName="bg-primary-green text-white font-bold shadow-inner"
            >
              <Settings className="w-4 h-4" />
              Settings
            </ActiveLink>
            <div className="hover:bg-danger/10 rounded-lg transition-colors">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full h-full overflow-y-auto pb-[70px] md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-surface border-b border-border p-4 flex justify-between items-center sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/dash_pharmacy_logo.png" alt="Dash Pharmacy Logo" className="h-16 w-auto object-contain" />
            <span className="ml-1 text-[10px] uppercase text-text-muted">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-text-primary leading-tight">{formattedName}</span>
              <span className="text-[10px] text-text-secondary">{formattedTitle}</span>
            </div>
            {adminImage ? (
              <img src={adminImage} alt={formattedName} className="w-10 h-10 rounded-full object-cover border-2 border-primary-light shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary-green text-sm">{adminInitials}</div>
            )}
          </div>
        </div>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}
