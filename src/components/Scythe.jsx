// The scythe — the recurring signature motif, echoing the reaper in the logo.
export function ScytheRule({ className = 'scythe-rule' }) {
  return (
    <svg className={className} viewBox="0 0 1080 24" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 12 H470" stroke="currentColor" strokeWidth="1.4" />
      <path d="M610 12 H1080" stroke="currentColor" strokeWidth="1.4" />
      {/* the blade */}
      <path d="M470 12 C 512 12, 524 2, 540 2 C 568 2, 584 12, 610 12"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="540" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}

// A small scythe blade used as an inline bullet / accent
export function Blade({ size = 18, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path d="M4 19 C 9 18, 17 14, 20 5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 5 C 16 6, 13 8, 12 12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="4" cy="19" r="1.6" fill={color} />
    </svg>
  );
}
