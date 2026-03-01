'use client';

interface FantasyCardProps {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FantasyCard({
  children,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}: FantasyCardProps) {
  return (
    <button
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      className={`p-6 rounded-2xl border-2 text-left transition-all w-full
        ${disabled ? 'card-disabled' :
          selected ? 'card-selected bg-dark-border/80 cursor-pointer' :
          'bg-dark-card border-gold/20 hover:border-gold/50 cursor-pointer card-glow'}
        ${className}`}
    >
      {children}
    </button>
  );
}
