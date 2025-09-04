
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const user = localStorage.getItem("yj_current") || "旅者";

  return (
    <div className="home-bg">
      <div className="home-box">
        <h2 className="home-title">欢迎，{user} — 余烬 世界大厅</h2>
        <p className="muted">选择你的下一步 — 新手教程推荐先体验初级关卡</p>
        <div className="home-buttons">
          <button className="home-btn" onClick={() => navigate("/game")}>🎮 进入游戏（新手教程）</button>
          <button className="home-btn" onClick={() => navigate("/characters")}>🧙 角色管理</button>
          <button className="home-btn" onClick={() => navigate("/settings")}>⚙️ 设置</button>
          <button
            className="home-btn danger"
            onClick={() => {
              localStorage.removeItem("yj_current");
              navigate("/login");
            }}
          >
            🚪 退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
