'use client';

interface StatBoxProps {
  icon: string;
  label: string;
  value: number | undefined;
  color: string;
  variant?: 'light' | 'dark';
}

export function StatBox({ icon, label, value, color, variant = 'light' }: StatBoxProps) {
  const bg = variant === 'light' ? 'bg-white/50' : 'bg-dark-card/80';
  const labelColor = variant === 'light' ? 'text-dark-bg/50' : 'text-white/50';

  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className={`text-xs font-[family-name:var(--font-cinzel)] font-bold ${labelColor} uppercase`}>{label}</div>
    </div>
  );
}
