import React from 'react';

// ============================================================================
// Monogram — renders the official "T & M" wedding mark.
// Uses the uploaded logo PNG located at /assets/monogram.png (public folder).
// `size` controls the rendered height (width auto for aspect preservation).
// ============================================================================

export default function Monogram({ size = 96, className = '', alt = 'Monograma Thalita & Maicon', ...rest }) {
  return (
    <img
      src={`${process.env.PUBLIC_URL || ''}/assets/monogram.png`}
      alt={alt}
      width={size}
      height={size}
      style={{ height: size, width: 'auto', objectFit: 'contain' }}
      className={`select-none ${className}`}
      draggable="false"
      {...rest}
    />
  );
}
