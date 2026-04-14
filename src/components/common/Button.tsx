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
    'font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 relative overflow-hidden';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:shadow-lg hover:scale-105 shadow-md',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 hover:shadow-md hover:scale-105',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}
