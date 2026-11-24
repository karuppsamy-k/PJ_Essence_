import React from 'react';

export function IntensityMeter({ value = 5, label = 'Intensity', max = 10, variant = 'bronze' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColors = {
    bronze: 'bg-gradient-to-r from-bronze-light via-bronze to-bronze-dark',
    burgundy: 'bg-gradient-to-r from-burgundy-light via-burgundy to-burgundy-dark',
    walnut: 'bg-gradient-to-r from-taupe-dark via-walnut to-walnut-dark',
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-wider text-taupe-dark font-medium">{label}</span>
        <span className="font-serif font-semibold text-charcoal">{value} / {max}</span>
      </div>
      <div className="w-full h-1.5 bg-cream-dark/60 rounded-full overflow-hidden border border-taupe/15">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColors[variant] || barColors.bronze}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function OlfactoryProfileMetrics({ intensity, warmth, freshness, sweetness, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <IntensityMeter label="Warmth" value={warmth} variant="burgundy" />
      <IntensityMeter label="Intensity" value={intensity} variant="bronze" />
      <IntensityMeter label="Freshness" value={freshness} variant="bronze" />
      <IntensityMeter label="Sweetness" value={sweetness} variant="walnut" />
    </div>
  );
}
