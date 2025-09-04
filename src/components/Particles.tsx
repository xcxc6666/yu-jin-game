// src/components/Particles.tsx


/* Embers / Starburst simple particles (CSS) */

export function Embers({ count = 12 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const size = 4 + Math.random() * 8;
        const delay = Math.random() * 2;
        return <div key={i} style={{
          position: "absolute",
          left: `${left}%`,
          bottom: Math.random() * 60,
          width: size, height: size,
          borderRadius: size / 2,
          background: "rgba(0,200,255,0.9)",
          boxShadow: "0 0 12px rgba(0,200,255,0.6)",
          animation: `emberRise ${6 + Math.random()*6}s linear ${delay}s infinite`
        }} />;
      })}

      <style>{`
        @keyframes emberRise {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-220px) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function Starburst({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: "absolute", left: x - 40, bottom: y - 40, width: 80, height: 80, zIndex: 40, pointerEvents: "none" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 40, background: "radial-gradient(circle, rgba(0,255,220,0.95), rgba(0,128,128,0.2))", filter: "blur(8px)", animation: "burst 0.6s ease-out" }} />
      <style>{`
        @keyframes burst {
          0% { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
