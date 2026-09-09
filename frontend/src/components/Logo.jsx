import React from 'react';

export default function ShopSphereLogo({ size = 38, showText = true, textColor = '#0f172a' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Background Green Sphere */}
        <circle cx="100" cy="85" r="62" fill="#a8e05f" stroke="#111827" strokeWidth="2.5" />

        {/* Orbit Ring (Back Segment - dashed) */}
        <path
          d="M 28 102 C 55 135 145 110 176 55"
          stroke="#111827"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Blue Shopping Bag - Left Dark Fold */}
        <path
          d="M 68 45 L 80 40 L 76 132 L 64 128 Z"
          fill="#1d4ed8"
          stroke="#111827"
          strokeWidth="1"
        />

        {/* Blue Shopping Bag - Front Main Body */}
        <path
          d="M 80 40 L 138 44 L 140 135 L 76 132 Z"
          fill="#3b82f6"
          stroke="#111827"
          strokeWidth="1.5"
        />

        {/* Bag Handles */}
        <path
          d="M 92 42 C 92 18, 106 18, 106 42"
          fill="none"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 110 42 C 110 18, 124 18, 124 42"
          fill="none"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Handle Eyelets / Rivets */}
        <circle cx="92" cy="42" r="3" fill="#1d4ed8" />
        <circle cx="106" cy="42" r="3" fill="#1d4ed8" />
        <circle cx="110" cy="42" r="3" fill="#1d4ed8" />
        <circle cx="124" cy="42" r="3" fill="#1d4ed8" />

        {/* Orbit Ring (Front Segment - solid) */}
        <path
          d="M 28 102 C 35 125 135 120 176 55"
          fill="none"
          stroke="#111827"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: `${size * 0.55}px`,
            fontWeight: 700,
            color: textColor,
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}
        >
          ShopSphere
        </span>
      )}
    </div>
  );
}
