// src/components/SceneStreet.tsx
import { useGameStore } from "../store";

export default function SceneStreet() {
  const shards = useGameStore((s: { shards: any; }) => s.shards);
  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#0a1112,#031214)" }} />
      <div style={{ position: "absolute", left: 40, bottom: 60, width: 120, height: 160, background: "#261b1a", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 640, bottom: 60, width: 140, height: 180, background: "#2b2628", borderRadius: 6 }} />
      {!shards["s_street"] && <div style={{ position: "absolute", left: 420 - 14, bottom: 16, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle,#9df,#2ed)" }} />}
    </div>
  );
}
