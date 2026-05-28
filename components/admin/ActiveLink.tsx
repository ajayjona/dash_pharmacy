'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ActiveLinkProps {
  href: string;
  exact?: boolean;
  children: ReactNode;
  className?: string;
  inactiveClassName?: string;
  activeClassName?: string;
}

export default function ActiveLink({ 
  href, 
  exact = false, 
  children, 
  className = '', 
  inactiveClassName = '',
  activeClassName = '' 
}: ActiveLinkProps) {
  const pathname = usePathname();
  
  const isActive = exact 
    ? pathname === href 
    : pathname.startsWith(href);

  return (
    <Link href={href} className={`${className} ${isActive ? activeClassName : inactiveClassName}`}>
      {children}
    </Link>
  );
}
