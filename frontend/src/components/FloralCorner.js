import React from 'react';

// ============================================================================
// FloralCorner — renders watercolor floral PNGs (AI-generated) positioned
// at the 4 corners of a section. Each position has its own dedicated image
// (flor1=TL, flor2=TR, flor3=BL, flor4=BR) to preserve natural bouquet flow.
// ============================================================================

const POSITION_TO_FILE = {
  tl: 'flor1.png',
  tr: 'flor2.png',
  bl: 'flor3.png',
  br: 'flor4.png'
};

export default function FloralCorner({ position = 'tl', size = 380, className = '', style = {} }) {
  const src = `${process.env.PUBLIC_URL || ''}/assets/${POSITION_TO_FILE[position]}`;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      style={{ width: size, height: size, objectFit: 'contain', ...style }}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
