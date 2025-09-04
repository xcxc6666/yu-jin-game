// src/components/SceneEldra.tsx

import { NPCDialog } from "../data/npcData";

export default function SceneEldra({ onPickup }: { onPickup: () => void }) {
  const text = NPCDialog.Eldra.stages[0][0];
  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#041,#012)" }} />
      <div style={{ position: "absolute", left: 380, bottom: 40, width: 200, height: 200, borderRadius: 12, background: "linear-gradient(180deg,#041,#012)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
        <div style={{ color: "#cff", fontWeight: 700 }}>遗迹入口</div>
      </div>

      <div style={{ position: "absolute", left: 160, bottom: 180, width: 420, padding: 12, borderRadius: 10, background: "rgba(0,0,0,0.7)" }}>
        <div style={{ fontWeight: 800, color: "#ffd" }}>埃尔德拉</div>
        <div style={{ color: "#cfe", marginTop: 6 }}>{text}</div>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onPickup}>吸收残像（E）</button>
        </div>
      </div>
    </div>
  );
}
