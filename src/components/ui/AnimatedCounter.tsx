"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;        // e.g. "48", "100", "0"
  suffix?: string;      // e.g. "h", "%", ""
  prefix?: string;      // e.g. "+"
  duration?: number;    // ms
};

/**
 * Counts up to a numeric target when the element scrolls into view.
 * Non-numeric values are displayed as-is.
 */
export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1200 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  const numericTarget = parseInt(value, 10);
  const isNumeric = !isNaN(numericTarget);

  useEffect(() => {
    if (!isNumeric || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasAnimated(true);
        observer.disconnect();

        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * numericTarget).toString());
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isNumeric, numericTarget, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      {isNumeric ? display : value}
      {suffix}
    </span>
  );
}
