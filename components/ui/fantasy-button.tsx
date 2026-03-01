'use client';

interface FantasyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  glow?: boolean;
}

export function FantasyButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  glow = false,
}: FantasyButtonProps) {
  const base = 'rounded-xl font-[family-name:var(--font-cinzel)] font-bold transition-all';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  const variants = {
    primary: 'bg-gold text-dark-bg hover:bg-gold-dark disabled:opacity-30 disabled:cursor-default',
    secondary: 'bg-dark-border text-gold border-2 border-gold/30 hover:bg-gold/10 disabled:opacity-30 disabled:cursor-default',
    outline: 'border-2 border-gold/50 text-gold/70 hover:bg-gold/10 disabled:opacity-30 disabled:cursor-default',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${glow ? 'glow-pulse' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
