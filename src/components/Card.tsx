import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  padding = 'lg',
  onClick
}: CardProps) {
  const paddingClasses = {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10'
  };
  
  const baseClasses = `bg-surface rounded-lg border border-neutral-800 shadow-card ${paddingClasses[padding]}`;
  const gradientClasses = gradient ? 'gradient-subtle' : '';
  const hoverClasses = hover ? 'card-hover-effect cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${gradientClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}