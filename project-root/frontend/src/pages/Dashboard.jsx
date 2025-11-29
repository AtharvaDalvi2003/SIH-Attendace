// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ user, onGo }) {
  const [records, setRecords] = useState([]);
  const [todayMarked, setTodayMarked] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/attendance/").then((res) => {
      const data = res.data || [];
      setRecords(data);
      if (user) {
        const today = new Date().toISOString().slice(0, 10);
        const found = data.some((r) => r.student && r.student.name === user.name && (r.timestamp || "").slice(0, 10) === today);
        setTodayMarked(found);
      }
    }).catch(() => {});
  }, [user]);

  return (
    <div className="page">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div>
          <h3>Today's Attendance</h3>
          <div style={{ fontSize: 20, display:"flex", alignItems:"center", gap:8 }}>
            <div>{todayMarked ? "Marked ✅" : "Not marked ❌"}</div>
          </div>
        </div>

        <div>
          <button className="btn" onClick={() => window.location.reload()}>Refresh</button>
          <button className="btn" style={{ marginLeft: 8 }} onClick={() => { /* optional export */ alert("Export soon") }}>Export CSV</button>
        </div>
      </div>

      <div style={{ display:"flex", gap:20, marginBottom: 20 }}>
        <div className="card" style={{ flex:1 }}>
          <h4>Quick Actions</h4>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button className="btn" onClick={() => onGo("Attendance")}>Attendance</button>
            <button className="btn" onClick={() => onGo("Timetable")}>Timetable</button>
            <button className="btn" onClick={() => onGo("LiveAttendance")}>Start Live</button>
          </div>
        </div>

        <div className="card" style={{ width: 360 }}>
          <h4>Recent Attendance</h4>
          <div style={{ maxHeight:220, overflow:"auto" }}>
            <table>
              <tbody>
                {records.slice(0,6).map(r => (
                  <tr key={r.id}><td style={{padding:8}}>{r.student ? r.student.name : "Unknown"}</td><td style={{padding:8}}>{new Date(r.timestamp).toLocaleString()}</td></tr>
                ))}
                {records.length === 0 && <tr><td colSpan={2} style={{padding:8,color:'#64748b'}}>No records yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <h4>Timetable (Sample)</h4>
        <table>
          <thead><tr><th>Day</th><th>9:00</th><th>11:00</th><th>14:00</th></tr></thead>
          <tbody>
            <tr><td>Mon</td><td>Maths</td><td>DSA</td><td>Cloud</td></tr>
            <tr><td>Tue</td><td>OS</td><td>Networks</td><td>Lab</td></tr>
            <tr><td>Wed</td><td>Security</td><td>DBMS</td><td>Project</td></tr>
            <tr><td>Thu</td><td>Maths</td><td>Lab</td><td>Revision</td></tr>
            <tr><td>Fri</td><td>Tests</td><td>Project</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
