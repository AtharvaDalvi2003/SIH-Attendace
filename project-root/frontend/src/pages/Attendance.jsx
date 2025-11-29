// src/pages/Attendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance({ user }) {
  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/attendance/").then((res) => setRecords(res.data || [])).catch(()=>{});
  }, []);

  const filtered = records.filter((r) => (r.timestamp || "").slice(0,4) === String(year));
  const byDate = {};
  filtered.forEach((r) => {
    const d = (r.timestamp || "").slice(0,10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(r);
  });
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div className="page">
      <h2>Attendance - {year}</h2>
      <div style={{ marginBottom: 12 }}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {Array.from({ length: 5 }).map((_, i) => {
            const y = new Date().getFullYear() - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
      </div>

      <div className="card">
        <h3>Marked Dates</h3>
        <ul>
          {dates.length === 0 && <li>No attendance recorded this year</li>}
          {dates.map((d) => (
            <li key={d}><strong>{d}</strong> — {byDate[d].map((x) => (x.student ? x.student.name : "Unknown")).join(", ")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
