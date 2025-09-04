// src/components/SceneBoundary.tsx
import { useGameStore } from "../store";

export default function SceneBoundary({ enemies }: { enemies: any[] }) {
  const shards = useGameStore((s: { shards: any; }) => s.shards);
  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#051014,#011012)" }} />
      {/* voids */}
      <div style={{ position: "absolute", left: 360, bottom: 0, width: 120, height: 120, background: "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.95))", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 560, bottom: 0, width: 140, height: 160, background: "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.95))", borderRadius: 8 }} />
      {!shards["s_event"] && <div style={{ position: "absolute", left: 520 - 14, bottom: 8, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle,#ff9,#ff3)" }} />}
      {enemies.map(e => <div key={e.id} style={{ position: "absolute", left: e.x - 18, bottom: e.y, width: 36, height: 36, borderRadius: 18, background: e.big ? "linear-gradient(180deg,#600,#300)" : "#3a1" }} />)}
    </div>
  );
}
