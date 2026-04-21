import React from 'react';

// ============================================================================
// Monogram — ornate "T & M" mark in the wedding navy-blue style.
// Pure SVG, scales via `size` prop, uses currentColor for theming.
// ============================================================================

export default function Monogram({ size = 96, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Monograma Thalita & Maicon"
      role="img"
      className={className}
      {...rest}
    >
      <defs>
        <linearGradient id="monoStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2C3E77" />
          <stop offset="100%" stopColor="#4A6AA6" />
        </linearGradient>
      </defs>

      {/* Outer ornate flourish — hand-drawn curls */}
      <g fill="none" stroke="url(#monoStroke)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M40 50 C 55 30, 75 30, 90 45 C 95 50, 95 58, 90 62" />
        <path d="M160 50 C 145 30, 125 30, 110 45 C 105 50, 105 58, 110 62" />
        <path d="M40 150 C 55 170, 75 170, 90 155 C 95 150, 95 142, 90 138" />
        <path d="M160 150 C 145 170, 125 170, 110 155 C 105 150, 105 142, 110 138" />
        <path d="M100 25 C 90 32, 90 40, 100 46 C 110 40, 110 32, 100 25 Z" />
        <path d="M100 175 C 90 168, 90 160, 100 154 C 110 160, 110 168, 100 175 Z" />
      </g>

      {/* T */}
      <g fill="url(#monoStroke)">
        <path d="M58 78 C 58 76, 60 74, 62 74 L 92 74 C 94 74, 96 76, 96 78 L 96 82 C 96 84, 94 86, 92 86 L 82 86 L 82 128 C 82 130, 80 132, 78 132 L 75 132 C 73 132, 71 130, 71 128 L 71 86 L 62 86 C 60 86, 58 84, 58 82 Z" />
      </g>

      {/* Ampersand (cursive &) */}
      <g fill="none" stroke="url(#monoStroke)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M95 105 C 98 98, 106 98, 108 104 C 110 110, 100 115, 100 120 C 100 127, 108 130, 113 125 L 118 118" />
      </g>

      {/* M */}
      <g fill="url(#monoStroke)">
        <path d="M108 78 C 108 76, 110 74, 112 74 L 115 74 C 116.5 74, 118 75, 118.5 76.5 L 126 102 L 133.5 76.5 C 134 75, 135.5 74, 137 74 L 140 74 C 142 74, 144 76, 144 78 L 144 128 C 144 130, 142 132, 140 132 L 137 132 C 135 132, 133 130, 133 128 L 133 98 L 128 116 C 127.5 117.5, 126.8 118, 126 118 C 125.2 118, 124.5 117.5, 124 116 L 119 98 L 119 128 C 119 130, 117 132, 115 132 L 112 132 C 110 132, 108 130, 108 128 Z" />
      </g>

      {/* Small gold dots for balance */}
      <circle cx="100" cy="60" r="2" fill="#C0A971" />
      <circle cx="100" cy="140" r="2" fill="#C0A971" />
    </svg>
  );
}
