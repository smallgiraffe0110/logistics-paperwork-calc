'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gradient?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, gradient, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-200',
          hover && 'hover:-translate-y-0.5 hover:shadow-lg',
          gradient,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
