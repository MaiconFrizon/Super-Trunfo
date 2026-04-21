import React from 'react';

// ============================================================================
// FloralCorner — decorative watercolor-like leaves painted in invitation blues
// and gold. Positioned absolutely by parent via className.
//
// Props:
//   position: 'tl' | 'tr' | 'bl' | 'br' (applies rotation/mirror)
//   size:     px (default 260)
// ============================================================================

const TRANSFORMS = {
  tl: 'rotate(0deg)',
  tr: 'scaleX(-1)',
  bl: 'scaleY(-1)',
  br: 'scale(-1,-1)'
};

export default function FloralCorner({ position = 'tl', size = 260, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 260 260"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ transform: TRANSFORMS[position] }}
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <radialGradient id="leafBlue" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#6A8BAD" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#4A6AA6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#344E8A" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="leafMist" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#C7D5E6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#C7D5E6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft watercolor wash blobs */}
      <ellipse cx="70" cy="70" rx="70" ry="55" fill="url(#leafMist)" />
      <ellipse cx="120" cy="40" rx="55" ry="35" fill="url(#leafMist)" />

      {/* Leaves — dusty blue */}
      <g fill="url(#leafBlue)" stroke="#4A6AA6" strokeWidth="0.6" opacity="0.9">
        <path d="M20 30 C 60 10, 100 20, 130 55 C 110 75, 70 70, 40 55 C 28 48, 22 40, 20 30 Z" />
        <path d="M10 90 C 50 70, 85 80, 115 110 C 95 130, 55 120, 25 105 Z" opacity="0.75" />
        <path d="M60 10 C 100 0, 150 20, 170 70 C 150 85, 110 75, 80 55 Z" opacity="0.65" />
      </g>

      {/* Leaves — lighter slate */}
      <g fill="#B6C5D9" opacity="0.55" stroke="#6A8BAD" strokeWidth="0.4">
        <path d="M0 60 C 40 45, 80 55, 105 85 C 85 100, 45 90, 15 75 Z" />
        <path d="M90 5 C 130 0, 170 20, 185 55 C 160 65, 125 55, 100 40 Z" />
      </g>

      {/* Gold twigs */}
      <g stroke="#C0A971" strokeWidth="1" fill="none" opacity="0.85">
        <path d="M35 40 C 60 30, 90 35, 120 55" />
        <path d="M35 40 l 6 -6 M 55 36 l 5 -7 M 75 35 l 4 -8 M 95 40 l 4 -9" strokeLinecap="round" />
        <path d="M15 80 C 40 70, 70 75, 100 95" />
        <path d="M15 80 l 5 -6 M 35 76 l 4 -7 M 60 75 l 4 -7" strokeLinecap="round" />
      </g>

      {/* Cotton boll (fluffy white bulbs) */}
      <g>
        <circle cx="135" cy="58" r="10" fill="#FAF8F3" stroke="#E2D7BE" strokeWidth="0.6" />
        <circle cx="148" cy="50" r="8" fill="#FAF8F3" stroke="#E2D7BE" strokeWidth="0.6" />
        <circle cx="142" cy="68" r="7" fill="#FAF8F3" stroke="#E2D7BE" strokeWidth="0.6" />
      </g>
    </svg>
  );
}
