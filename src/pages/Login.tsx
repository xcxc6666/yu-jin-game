import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Users stored in localStorage key "yj_users" as array [{username,password}]
 * Current logged in username stored under "yj_current"
 */

type User = { username: string; password: string };

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem("yj_users") || "[]");
  } catch {
    return [];
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const found = users.find((u) => u.username === username && u.password === password);
    if (found) {
      localStorage.setItem("yj_current", username);
      navigate("/home");
    } else {
      alert("账号或密码错误，或尚未注册");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-box">
        <h1 className="login-title">余烬</h1>
        <p className="muted">克苏鲁风 · 新手教程</p>
        <form onSubmit={handleLogin} className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button className="login-btn" type="submit">
            进入深渊
          </button>
        </form>
        <p className="switch-text">
          还没有账号？ <Link to="/register">去注册</Link>
        </p>
      </div>
    </div>
  );
}
