import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border border-slate-300 text-slate-900 hover:bg-slate-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
