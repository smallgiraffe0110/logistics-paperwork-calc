'use client';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (n: number) => string;
}

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
}: SliderProps) {
  const sliderId = label.toLowerCase().replace(/\s+/g, '-');
  const displayValue = format ? format(value) : value.toString();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor={sliderId} className="text-sm font-semibold text-gray-900">
          {label}
        </label>
        <span className="text-sm font-semibold text-gray-900 tabular-nums">{displayValue}</span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-track w-full"
        style={{
          background: `linear-gradient(to right, #111 0%, #111 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
        }}
        aria-label={label}
      />
      <style jsx>{`
        .slider-track {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          cursor: pointer;
          outline: none;
        }
        .slider-track::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #111;
          cursor: pointer;
          border: 0;
        }
        .slider-track::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #111;
          cursor: pointer;
          border: 0;
        }
      `}</style>
    </div>
  );
}
