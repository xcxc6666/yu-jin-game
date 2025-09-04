// src/components/SceneRuin.tsx


export default function SceneRuin({ disappearing, bossAlive }: { disappearing: Record<number, boolean>, bossAlive: boolean }) {
  const platforms = [
    { x: 120, y: 0, w: 220, h: 60 },
    { x: 300, y: 120, w: 120, h: 20 },
    { x: 480, y: 200, w: 120, h: 20 },
    { x: 660, y: 160, w: 100, h: 20 },
  ];
  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#071018,#021014)" }} />
      {platforms.map((p, idx) => {
        if ((idx === 2 || idx === 3) && disappearing[idx]) return null;
        return <div key={idx} style={{ position: "absolute", left: p.x, bottom: p.y, width: p.w, height: p.h, background: idx === 0 ? "linear-gradient(#083,#0a5)" : "#6a4e33", borderRadius: 6 }} />;
      })}
      {bossAlive && <div style={{ position: "absolute", left: 420, bottom: 0, width: 120, height: 160, background: "linear-gradient(180deg,#444,#222)", borderRadius: 8 }} />}
      {/* ruin shards */}
      <div style={{ position: "absolute", left: 320 - 14, bottom: 140, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle,#9df,#2ed)" }} />
      <div style={{ position: "absolute", left: 620 - 14, bottom: 180, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle,#9df,#2ed)" }} />
    </div>
  );
}
