// src/pages/Timetable.jsx
import React from "react";

export default function Timetable(){
  const rows = [
    { day: "Monday", a:"Maths", b:"DSA", c:"Cloud"},
    { day: "Tuesday", a:"OS", b:"Networks", c:"Lab"},
    { day: "Wednesday", a:"Security", b:"DBMS", c:"Project"},
    { day: "Thursday", a:"Maths", b:"Lab", c:"Revision"},
    { day: "Friday", a:"Tests", b:"Project", c:"-" },
  ];
  return (
    <div className="page">
      <h2>Timetable (Mon - Fri)</h2>
      <div className="card">
        <table>
          <thead><tr><th>Day</th><th>9:00</th><th>11:00</th><th>14:00</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.day}><td>{r.day}</td><td>{r.a}</td><td>{r.b}</td><td>{r.c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
