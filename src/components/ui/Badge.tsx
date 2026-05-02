import React from 'react';

type BadgeVariant = 'gold' | 'blush' | 'muted';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'muted',
  children,
  className = '',
  ...props
}) => {
  const variants = {
    gold: 'bg-secondary text-white',
    blush: 'bg-primary-container text-on-primary-container',
    muted: 'bg-surface-container-low text-on-surface-variant',
  };

  return (
    <span
      className={`badge ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
