// src/pages/LiveAttendance.jsx
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

export default function LiveAttendance({ user }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("");
  const [matchedName, setMatchedName] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const captureIntervalRef = useRef(null);

  // start camera and return true/false
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      return true;
    } catch (err) {
      console.error("camera error", err);
      setStatus("Camera permission denied or no camera available.");
      return false;
    }
  };

  const stopCamera = () => {
    try {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch (e) {
      console.warn("stopCamera error", e);
    }
  };

  // captures a single frame and returns base64 string
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  const sendSnapshot = async (dataUrl) => {
    // check network quickly
    if (!navigator.onLine) {
      setStatus("Offline — will retry when network returns.");
      return { ok: false, offline: true };
    }
    setStatus("Uploading snapshot...");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/recognize/", { image_base64: dataUrl }, { timeout: 10000 });
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("upload error", err);
      // network or CORS or server error
      setStatus("Network/server error while uploading. Will retry.");
      return { ok: false, offline: false, error: err };
    }
  };

  // a full cycle: countdown -> capture -> upload
  const doCaptureCycle = async () => {
    // if already matched, skip
    if (matchedName) return;
    // show countdown 4..1
    for (let i = 4; i >= 1; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 700)); // 700ms step for quicker UX
    }
    setCountdown(null);

    const dataUrl = captureFrame();
    if (!dataUrl) {
      setStatus("Unable to capture frame.");
      return;
    }

    const result = await sendSnapshot(dataUrl);
    if (result.ok && result.data) {
      if (result.data.matched) {
        setMatchedName(result.data.matched.name);
        setStatus(`Matched: ${result.data.matched.name} — attendance marked`);
        // stop auto-capture once matched
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
      } else {
        setStatus("No match yet — continuing captures");
      }
    } else if (result.offline) {
      // offline: wait for network and resume automatically
      const onOnline = () => {
        setStatus("Back online — resuming captures");
        window.removeEventListener("online", onOnline);
        // immediate capture attempt after online
        setTimeout(() => doCaptureCycle(), 800);
      };
      window.addEventListener("online", onOnline);
    } else {
      // server/network error: will retry next interval
      // nothing more to do here
    }
  };

  // lifecycle: auto-start camera when user exists and start interval cycles
  useEffect(() => {
    let active = true;
    if (user) {
      startCamera().then((ok) => {
        if (!ok || !active) return;
        // do one immediate capture cycle after a short delay for permission
        setTimeout(() => {
          if (active) doCaptureCycle();
        }, 900);
        // then repeat every 6 seconds (countdown ~2.8s + send time)
        captureIntervalRef.current = setInterval(() => {
          if (active) doCaptureCycle();
        }, 6000);
      });
    }
    return () => {
      active = false;
      if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, matchedName]);

  return (
    <div className="page">
      <h2>Live Camera Attendance</h2>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ position: "relative" }}>
          <video ref={videoRef} width="640" height="480" style={{ background: "#000", borderRadius: 8 }} />
          {/* Countdown overlay */}
          {countdown && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              display: "flex", justifyContent: "center", alignItems: "center",
              fontSize: 72, color: "white", fontWeight: 700, pointerEvents: "none",
              textShadow: "0 3px 10px rgba(0,0,0,0.6)"
            }}>
              {countdown}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700 }}>{status}</div>
            {matchedName && <div style={{ color: "green", marginTop: 8 }}>Attendance marked for: {matchedName}</div>}
          </div>
        </div>

        <div style={{ minWidth: 260 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Session Info</h3>
            <p><strong>User:</strong> {user ? `${user.name} (${user.role})` : "Not logged in"}</p>
            <p><strong>Auto-capture:</strong> Enabled — captures every ~6s (countdown + upload)</p>
            <p style={{ fontSize: 13, color: "#64748b" }}>Captured snapshots are saved on the server at <code>/media/snapshots/</code>.</p>
            <p style={{ fontSize: 13, color: "#64748b" }}>If you are offline or the server is unreachable, captures are paused and will retry when online.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
