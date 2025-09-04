import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type User = { username: string; password: string };

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem("yj_users") || "[]");
  } catch {
    return [];
  }
}
function saveUsers(users: User[]) {
  localStorage.setItem("yj_users", JSON.stringify(users));
}

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("请输入完整信息");
      return;
    }
    if (password !== confirm) {
      alert("两次输入的密码不一致");
      return;
    }
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      alert("该用户名已存在");
      return;
    }
    users.push({ username, password });
    saveUsers(users);
    alert("注册成功，请使用账号登录！");
    navigate("/login");
  };

  return (
    <div className="login-bg">
      <div className="login-box">
        <h1 className="login-title">注册新账号</h1>
        <p className="muted">创建你的旅者身份 — 谨慎前行</p>
        <form onSubmit={handleRegister} className="login-form">
          <input className="login-input" type="text" placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="login-input" type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input className="login-input" type="password" placeholder="确认密码" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button className="login-btn" type="submit">注册</button>
        </form>
        <p className="switch-text">
          已有账号？ <Link to="/login">返回登录</Link>
        </p>
      </div>
    </div>
  );
}
