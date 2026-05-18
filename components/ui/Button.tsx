import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-green text-surface hover:bg-opacity-90 active:bg-opacity-100',
  secondary: 'bg-primary-light text-primary-green hover:bg-[#d6ebd9]',
  outline: 'bg-transparent border border-primary-green text-primary-green hover:bg-primary-light',
  ghost: 'bg-transparent text-text-muted hover:bg-primary-light hover:text-text-primary',
  danger: 'bg-danger text-surface hover:bg-opacity-90',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg font-medium',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
