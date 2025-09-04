import { useEffect, useState } from "react";

type SettingsState = { theme: "dark" | "retro"; music: boolean; volume: number };

const defaultSettings: SettingsState = { theme: "dark", music: true, volume: 0.6 };

function loadSettings(): SettingsState {
  try {
    return JSON.parse(localStorage.getItem("yj_settings") || "null") || defaultSettings;
  } catch {
    return defaultSettings;
  }
}
function saveSettings(s: SettingsState) {
  localStorage.setItem("yj_settings", JSON.stringify(s));
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
    // apply theme live
    if (settings.theme === "retro") {
      document.body.style.background = "#081018";
    } else {
      document.body.style.background = "#000";
    }
  }, [settings]);

  return (
    <div className="page-bg">
      <div className="home-box" style={{ maxWidth: 640 }}>
        <h2 className="home-title">⚙️ 游戏设置</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>主题</label>
            <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })} style={{ padding: 8 }}>
              <option value="dark">暗黑（默认）</option>
              <option value="retro">怀旧（复古绿色）</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6 }}>背景音乐</label>
            <label style={{ marginRight: 12 }}>
              <input type="checkbox" checked={settings.music} onChange={(e) => setSettings({ ...settings, music: e.target.checked })} /> 开启音乐
            </label>
            <label>
              音量：
              <input type="range" min={0} max={1} step={0.01} value={settings.volume} onChange={(e) => setSettings({ ...settings, volume: Number(e.target.value) })} />
            </label>
          </div>

          <div>
            <button className="home-btn" onClick={() => { saveSettings(defaultSettings); setSettings(defaultSettings); }}>恢复默认</button>
          </div>
        </div>
      </div>
    </div>
  );
}
