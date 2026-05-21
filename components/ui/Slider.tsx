'use client';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  format?: (n: number) => string;
}

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
  format,
}: SliderProps) {
  const sliderId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;
  const displayValue = format
    ? format(value)
    : `${prefix ?? ''}${value}${suffix ?? ''}`;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={sliderId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <span className="text-sm font-semibold text-purple-700 tabular-nums">{displayValue}</span>
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        aria-label={label}
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
