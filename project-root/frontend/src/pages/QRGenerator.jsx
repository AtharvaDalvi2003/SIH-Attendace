// src/pages/QRGenerator.jsx
import React, { useState } from "react";
import axios from "axios";

export default function QRGenerator({ user }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(10);

  const createToken = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/create/", {
        created_by: user ? user.name : "Teacher",
        duration_minutes: minutes
      });
      setQrData(res.data);
    } catch (err) {
      alert("Failed to create token: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Generate QR for Attendance</h2>
      <div className="card" style={{ maxWidth: 520 }}>
        <label>Valid for (minutes)</label>
        <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} min={1} />
        <button className="btn" onClick={createToken} disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Creating..." : "Create QR"}
        </button>

        {qrData && (
          <div style={{ marginTop: 12 }}>
            <h4>QR Token</h4>
            <img alt="QR" src={qrData.qr_base64} style={{ width: 220, height: 220, border: "1px solid #e6eefb" }} />
            <p><strong>Token:</strong> {qrData.token}</p>
            <p><strong>Expires:</strong> {new Date(qrData.expires_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
