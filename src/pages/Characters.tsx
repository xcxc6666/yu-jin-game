import  { useEffect, useState } from "react";

type Character = { id: string; name: string; cls: string; level: number };

function loadChars(): Character[] {
  try {
    return JSON.parse(localStorage.getItem("yj_chars") || "[]");
  } catch {
    return [];
  }
}
function saveChars(chars: Character[]) {
  localStorage.setItem("yj_chars", JSON.stringify(chars));
}

export default function Characters() {
  const [chars, setChars] = useState<Character[]>([]);
  const [name, setName] = useState("");
  const [cls, setCls] = useState("战士");

  useEffect(() => {
    setChars(loadChars());
  }, []);

  const addChar = () => {
    if (!name.trim()) return alert("请输入角色名");
    const c: Character = { id: Date.now().toString(), name: name.trim(), cls, level: 1 };
    const next = [...chars, c];
    setChars(next);
    saveChars(next);
    setName("");
    setCls("战士");
  };

  const delChar = (id: string) => {
    if (!confirm("确定删除该角色吗？")) return;
    const next = chars.filter((c) => c.id !== id);
    setChars(next);
    saveChars(next);
  };

  const levelUp = (id: string) => {
    const next = chars.map((c) => (c.id === id ? { ...c, level: c.level + 1 } : c));
    setChars(next);
    saveChars(next);
  };

  return (
    <div className="page-bg">
      <div className="home-box" style={{ maxWidth: 720 }}>
        <h2 className="home-title">🧙 角色管理</h2>

        <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center", justifyContent: "center" }}>
          <input placeholder="角色名" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 8, borderRadius: 6 }} />
          <select value={cls} onChange={(e) => setCls(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            <option>战士</option>
            <option>法师</option>
            <option>游侠</option>
            <option>牧师</option>
          </select>
          <button className="home-btn" onClick={addChar}>新增角色</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {chars.length === 0 && <div className="muted">还没有角色 — 新建一个吧。</div>}
          {chars.map((c) => (
            <div key={c.id} style={{ background: "rgba(20,20,20,0.9)", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div className="muted">{c.cls} · 等级 {c.level}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="home-btn" onClick={() => levelUp(c.id)} style={{ padding: "6px 10px", fontSize: 14 }}>升级</button>
                  <button className="home-btn danger" onClick={() => delChar(c.id)} style={{ padding: "6px 10px", fontSize: 14, background: "#ef4444", color: "#fff" }}>删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
