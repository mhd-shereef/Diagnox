import React from 'react';
import './PageBackground.css';

/**
 * PageBackground — Renders soft blurred organic SVG shapes behind page content.
 * Positioned absolute within a relative parent.
 * variant: 'cool' (blue) | 'warm' (amber/rose) | 'neutral' (grey)
 */
export default function PageBackground({ variant = 'cool' }) {
  const blobs = {
    cool: [
      { cx: '10%',  cy: '15%',  rx: 380, ry: 280, color: 'rgba(14, 165, 233, 0.15)' },
      { cx: '88%',  cy: '72%',  rx: 320, ry: 240, color: 'rgba(16, 185, 129, 0.12)' },
      { cx: '55%',  cy: '38%',  rx: 200, ry: 160, color: 'rgba(59, 130, 246, 0.08)' },
    ],
    warm: [
      { cx: '12%',  cy: '20%',  rx: 340, ry: 260, color: 'rgba(244, 63, 94, 0.10)' },
      { cx: '82%',  cy: '68%',  rx: 290, ry: 210, color: 'rgba(245, 158, 11, 0.08)' },
    ],
    neutral: [
      { cx: '15%',  cy: '20%',  rx: 300, ry: 220, color: 'rgba(148, 163, 184, 0.15)' },
      { cx: '80%',  cy: '75%',  rx: 260, ry: 200, color: 'rgba(203, 213, 225, 0.12)' },
    ],
  };

  const items = blobs[variant] || blobs.cool;

  return (
    <div className="page-bg" aria-hidden="true">
      <svg className="page-bg-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`pg-blur-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="70" />
          </filter>
        </defs>
        {items.map((b, i) => (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={b.color}
            filter={`url(#pg-blur-${variant})`}
          />
        ))}
      </svg>
    </div>
  );
}
