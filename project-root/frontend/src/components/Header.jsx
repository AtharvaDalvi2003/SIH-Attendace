// src/components/Header.jsx
import React from "react";

export default function Header({ title, user, onLogout, onShowLogin }) {
  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!user ? (
          <button className="profile-btn" onClick={onShowLogin}>🔐 Login</button>
        ) : (
          <>
            <div style={{ fontSize: 14, color: "#475569", marginRight: 8 }}>
              <strong>{user.name}</strong> ({user.role})
            </div>
            <button className="profile-btn" onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
