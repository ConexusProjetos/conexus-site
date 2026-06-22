"use client";

import { useEffect, useRef } from "react";

/**
 * Animated SVG circuit board background.
 * Ported from repo B (Conexus-Tecnologia) main.js + CSS animations.
 * Used in HeroSection as a decorative background element.
 */
export function CircuitBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Animate paths sequentially on mount
    const paths = svg.querySelectorAll(".circuit-path");
    paths.forEach((path, i) => {
      const el = path as SVGPathElement;
      const length = el.getTotalLength?.() ?? 500;
      el.style.strokeDasharray = String(length);
      el.style.strokeDashoffset = String(length);
      el.style.transition = `stroke-dashoffset 2s ease ${i * 0.25}s`;
      setTimeout(() => { el.style.strokeDashoffset = "0"; }, 50);
    });

    // Animate dots (nodes)
    const dots = svg.querySelectorAll(".circuit-dot");
    dots.forEach((dot, i) => {
      const el = dot as SVGCircleElement;
      el.style.opacity = "0";
      el.style.transition = `opacity 0.4s ease ${0.5 + i * 0.15}s`;
      setTimeout(() => { el.style.opacity = "1"; }, 50);
    });
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 700"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-full h-full opacity-20"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal circuit lines */}
        <path
          className="circuit-path"
          d="M 0 120 H 200 L 240 160 H 450 L 490 120 H 700"
          stroke="#00A5B7" strokeWidth="1.5" fill="none" filter="url(#glow)"
        />
        <path
          className="circuit-path"
          d="M 500 0 V 80 L 540 120 V 250 L 580 290 V 400"
          stroke="#00A5B7" strokeWidth="1.5" fill="none" filter="url(#glow)"
        />
        <path
          className="circuit-path"
          d="M 700 120 H 900 L 940 80 H 1200"
          stroke="#00A5B7" strokeWidth="1" fill="none"
        />
        <path
          className="circuit-path"
          d="M 0 300 H 150 L 190 340 H 380 L 420 300 H 540"
          stroke="#00A5B7" strokeWidth="1" fill="none"
        />
        <path
          className="circuit-path"
          d="M 800 200 H 1000 L 1040 240 V 400 L 1080 440 H 1200"
          stroke="#00A5B7" strokeWidth="1.5" fill="none" filter="url(#glow)"
        />
        <path
          className="circuit-path"
          d="M 200 500 H 400 L 440 460 H 600 L 640 500 H 900"
          stroke="#00A5B7" strokeWidth="1" fill="none"
        />
        <path
          className="circuit-path"
          d="M 100 600 H 300 L 340 560 V 400 L 380 360 H 500"
          stroke="#00A5B7" strokeWidth="1" fill="none"
        />
        <path
          className="circuit-path"
          d="M 900 500 H 1100 L 1140 540 V 700"
          stroke="#00A5B7" strokeWidth="1" fill="none"
        />

        {/* Circuit nodes (dots) */}
        {[
          [200, 120], [450, 120], [490, 120], [540, 120],
          [500, 80], [540, 120], [580, 290],
          [900, 80], [940, 80],
          [150, 300], [380, 300], [420, 300],
          [800, 200], [1000, 200], [1040, 240],
          [400, 500], [600, 500], [640, 500],
          [300, 560], [340, 560],
          [1100, 500], [1140, 540],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            className="circuit-dot"
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#00A5B7"
            filter="url(#glow)"
          />
        ))}

        {/* Larger accent nodes */}
        {[
          [540, 120], [1040, 240], [340, 560],
        ].map(([cx, cy], i) => (
          <circle
            key={`accent-${i}`}
            className="circuit-dot"
            cx={cx}
            cy={cy}
            r="6"
            fill="none"
            stroke="#00A5B7"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
        ))}
      </svg>

      {/* Radial gradient overlay to fade edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, var(--color-bg-primary) 100%)",
        }}
      />
    </div>
  );
}
