// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import LiveAttendance from "./pages/LiveAttendance";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import LoginModal from "./components/LoginModal";
import "./style.css";

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [user, setUser] = useState(null);

  useEffect(()=> {
    try { const raw = localStorage.getItem("attendance_user"); if (raw) setUser(JSON.parse(raw)); } catch(e){}
  },[]);

  useEffect(()=> {
    if (user) localStorage.setItem("attendance_user", JSON.stringify(user));
    else localStorage.removeItem("attendance_user");
  },[user]);

  const renderPage = () => {
    switch(page){
      case "Dashboard": return <Dashboard user={user} onGo={(p) => setPage(p)} />;
      case "LiveAttendance": return <LiveAttendance user={user} />;
      case "Attendance": return <Attendance user={user} />;
      case "Timetable": return <Timetable />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="app">
      <Sidebar setPage={setPage} current={page} user={user}/>
      <div className="main-content">
        <Header title={page} user={user} onLogout={() => setUser(null)} onShowLogin={() => setUser("__showlogin__")} />
        {user === "__showlogin__" && <LoginModal onClose={() => setUser(null)} onLogin={(u) => setUser(u)} />}
        {renderPage()}
      
      </div>
    </div>
  );
}
