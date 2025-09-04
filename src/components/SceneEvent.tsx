// src/components/SceneEvent.tsx


/**
 * 简化事件场景（哀嚎掠食者 + 教团伏击）
 * 这里主要作为展示容器：Game 页面里面负责 QTE 和逻辑
 */
export default function SceneEvent({ bigVisible }: { bigVisible: boolean }) {
  return (
    <div style={{ width: 1200, height: 800, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(180deg,#021014,#000)" }} />
      {bigVisible && (
        <div style={{ position: "absolute", left: 600, bottom: 0, width: 180, height: 220, background: "linear-gradient(180deg,#220,#000)", borderRadius: 12 }}>
          <div style={{ color: "#fff", textAlign: "center", marginTop: 8 }}>哀嚎掠食者</div>
        </div>
      )}
    </div>
  );
}
