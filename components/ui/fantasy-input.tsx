'use client';

interface FantasyInputProps {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  maxLength?: number;
  min?: number;
  max?: number;
  className?: string;
}

export function FantasyInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  min,
  max,
  className = '',
}: FantasyInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block font-[family-name:var(--font-cinzel)] text-gold text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        className="w-full px-4 py-3 rounded-xl bg-dark-card border-2 border-gold/30 text-white text-lg focus:border-gold focus:outline-none transition-all placeholder:text-white/30"
      />
      {hint && <p className="text-white/40 text-sm mt-1">{hint}</p>}
    </div>
  );
}
