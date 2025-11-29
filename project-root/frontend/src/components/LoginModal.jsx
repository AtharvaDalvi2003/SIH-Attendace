// src/components/LoginModal.jsx
import React, { useState } from "react";

export default function LoginModal({ onClose, onLogin }) {
  const [role, setRole] = useState("Teacher");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // fixed demo passwords
    if (role === "Teacher" && password !== "123") {
      setErr("Incorrect teacher password");
      return;
    }
    if (role === "Student" && password !== "1234") {
      setErr("Incorrect student password");
      return;
    }
    const user = { role, name: name.trim() || (role === "Teacher" ? "Teacher" : "Student") };
    onLogin(user);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0 }}>Login</h3>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }}>
              <option>Teacher</option>
              <option>Student</option>
            </select>
          </label>

          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>

          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>

          {err && <div style={{ color: "red" }}>{err}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" style={primaryBtn}>Sign in</button>
            <button type="button" onClick={onClose} style={plainBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* styles */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 60
};
const modalStyle = { background: "#fff", padding: 20, borderRadius: 10, width: 360, boxShadow: "0 6px 30px rgba(2,6,23,0.2)" };
const primaryBtn = { background: "#3b82f6", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" };
const plainBtn = { background: "#eef2ff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" };
