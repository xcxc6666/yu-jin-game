import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Characters from "./pages/Characters";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * App routes:
 *  - /login (public)
 *  - /register (public)
 *  - protected: /home, /game, /characters, /settings
 *  - root "/" redirects to /login or /home depending on auth
 */

const App: React.FC = () => {
  const current = localStorage.getItem("yj_current");
  return (
    <Routes>
      <Route path="/" element={<Navigate to={current ? "/login" : "/home"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/characters"
        element={
          <ProtectedRoute>
            <Characters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
