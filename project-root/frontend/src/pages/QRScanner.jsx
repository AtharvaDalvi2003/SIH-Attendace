// src/pages/QRScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function QRScanner({ user }) {
  const qrRegionId = "html5qr-region";
  const [status, setStatus] = useState("Idle");
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const startScanner = async () => {
      try {
        const html5Qrcode = new Html5Qrcode(qrRegionId);
        html5QrcodeRef.current = html5Qrcode;
        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (!mounted) return;
            setStatus("Scanned: " + decodedText);
            // decodedText should be the token UUID string
            try {
              const res = await axios.post("http://127.0.0.1:8000/api/token/scan/", {
                token: decodedText,
                student_name: user ? user.name : prompt("Enter your name")
              });
              setStatus("Attendance marked: " + (res.data.student ? res.data.student.name : "OK"));
              // stop scanner
              await html5Qrcode.stop();
            } catch (err) {
              setStatus("Scan failed: " + (err.response?.data?.detail || err.message || err));
            }
          },
          (error) => {
            // decode errors - ignore or show small feedback
          }
        );
      } catch (e) {
        setStatus("Camera not available or permission denied: " + (e.message || e));
      }
    };

    startScanner();
    return () => {
      mounted = false;
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop().catch(()=>{});
      }
    };
  }, [user]);

  return (
    <div className="page">
      <h2>Scan QR to mark attendance</h2>
      <div className="card">
        <div id={qrRegionId} style={{ width: 320 }}></div>
        <div style={{ marginTop: 10, fontWeight: 700 }}>{status}</div>
      </div>
    </div>
  );
}
