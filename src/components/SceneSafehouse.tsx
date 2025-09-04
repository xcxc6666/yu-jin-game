// src/components/SceneSafehouse.tsx
import React from "react";
import { NPCDialog } from "../data/npcData";

export default function SceneSafehouse({ onStartEscort }: { onStartEscort: () => void }) {
  const [stage, setStage] = React.useState(0);
  const hom = NPCDialog.Hom;
  const text = hom.stages[Math.min(stage, hom.stages.length - 1)][0];

  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#070812,#061014)" }} />
      <div style={{ position: "absolute", left: 36, bottom: 0, width: 120, height: 160, background: "linear-gradient(180deg,#4b2,#321)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffd" }}>
        <div>
          <div style={{ fontWeight: 700 }}>霍姆（镇长）</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>按 F 与他对话</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 140, bottom: 40, width: 680, padding: 12, background: "rgba(0,0,0,0.6)", borderRadius: 8 }}>
        <div style={{ fontWeight: 800, color: "#ffd" }}>霍姆</div>
        <div style={{ color: "#cff", marginTop: 6 }}>{text}</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setStage(s => Math.max(0, s - 1))}>上句</button>
          <button onClick={() => setStage(s => Math.min(s + 1, hom.stages.length - 1))}>下句</button>
          <button onClick={onStartEscort}>接受护送任务 →</button>
        </div>
      </div>
    </div>
  );
}
