import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-0.5 ${className || ''}`}>
      {children}
    </div>
  );
}
