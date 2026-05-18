import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-[#E8F5EE] text-[#1A6B4A]',
  warning: 'bg-[#FEF3E8] text-[#B36B00]',
  danger: 'bg-[#FBE8E8] text-[#D63B3B]',
  info: 'bg-[#E8F0FE] text-[#1A56DB]',
  neutral: 'bg-[#F7F9F8] text-[#4D6358]',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'neutral', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
