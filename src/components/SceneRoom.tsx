// src/components/SceneRoom.tsx
import { useGameStore } from "../store";

export default function SceneRoom({ onDoor }: { onDoor: () => void }) {
  const shards = useGameStore((s: { shards: any; }) => s.shards);

  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#070406,#0b0508)" }} />
      <div style={{ position: "absolute", left: 220, bottom: 160, width: 12, height: 30, background: "#ffb", boxShadow: "0 0 24px rgba(255,200,120,0.6)" }} />
      <div style={{ position: "absolute", left: 260, bottom: 24, width: 40, height: 28, background: "#6b4", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 360, bottom: 12, width: 80, height: 120, background: "#332", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffd" }}>
        <div style={{ cursor: "pointer" }} onClick={onDoor}>门（E）</div>
      </div>

      {!shards["s_room"] && <div style={{ position: "absolute", left: 120 - 14, bottom: 16, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle,#9df,#2ed)", boxShadow: "0 8px 20px rgba(46,200,255,0.25)" }} />}
    </div>
  );
}
