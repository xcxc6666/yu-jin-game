// src/components/Camera.tsx
import React, { useEffect, useRef } from "react";

export default function Camera({ targetX, targetY, width = 900, height = 520, children }: { targetX: number; targetY: number; width?: number; height?: number; children: React.ReactNode; }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const step = () => {
      last.current.x += (targetX - last.current.x) * 0.12;
      last.current.y += (targetY - last.current.y) * 0.12;
      const cx = Math.round(last.current.x - width / 2 + 60);
      const cy = Math.round(last.current.y - height / 2 + 120);
      el.style.transform = `translate3d(${-cx}px, ${-cy}px, 0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetX, targetY, width, height]);

  return (
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>
      <div ref={wrapRef} style={{ position: "absolute", left: 0, top: 0, willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
