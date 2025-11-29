// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ setPage, current, user }) {
  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "LiveAttendance", icon: "🎥" },
    { name: "Attendance", icon: "📅" },
    { name: "Timetable", icon: "🗓️" }
  ];

  return (
    <div className="sidebar">
      <h2>Attendance</h2>
      {menuItems.map((item) => (
        <button
          key={item.name}
          className={current === item.name ? "active" : ""}
          onClick={() => setPage(item.name)}
        >
          {item.icon} {item.name}
        </button>
      ))}
      <div style={{ marginTop: "auto", fontSize: 13, color: "#94a3b8" }}>
        {user ? `Logged in: ${user.name} (${user.role})` : "Not logged in"}
      </div>
    </div>
  );
}
