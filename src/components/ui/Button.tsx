import React from 'react';

type ButtonVariant = 'gold' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'pill' | 'form';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer font-sans';

    const variants = {
      gold: 'bg-secondary text-white hover:opacity-90 shadow-soft hover:shadow-glow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      outline: 'border-2 border-secondary text-secondary hover:bg-secondary-container active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'text-on-surface hover:bg-surface-container-low active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-lg',
      lg: 'px-8 py-4 text-lg rounded-lg',
      pill: 'px-8 py-4 text-xs rounded-full uppercase tracking-widest font-semibold',
      form: 'px-6 py-4 text-sm rounded-xl uppercase tracking-widest font-semibold shadow-[0_10px_40px_rgba(115,87,88,0.15)] hover:scale-[1.01] active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
