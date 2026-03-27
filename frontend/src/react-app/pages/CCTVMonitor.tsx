import { Shield, Play, Wifi, WifiOff, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CAMERAS = [
  { name: "CAM01", 
    location: "College", 
    online: true, 
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/CAM1.mp4" 
  },
  { name: "CAM02", 
    location: "Shopping Mall", 
    online: true, 
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/CAM2.mp4" 
  },
  { name: "CAM03", 
    location: "Bus Stand", 
    online: false, 
    video: "" 
  },
  { name: "CAM04", 
    location: "Railway Station", 
    online: true, 
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/CAM3.mp4" 
  },
  { name: "CAM05", 
    location: "Highway", 
    online: true, 
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/cam4.mp4" 
  },
  { name: "CAM06", 
    location: "Bhaji Market", 
    online: false, 
    video: "" 
  },
];

type Camera = typeof CAMERAS[0];

type DetectedPerson = {
  name: string;
  location: string;
  time: string;
  zoneAlertness: string;
  screenshot: string;
};

const getZoneColor = (zone: string) => {
  if (zone === "HIGH") return "bg-red-600";
  if (zone === "MEDIUM") return "bg-yellow-500";
  return "bg-green-600";
};

export default function CCTVMonitor() {
  const [selectedCamera, setSelectedCamera] = useState<Camera>(CAMERAS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectedPerson, setDetectedPerson] = useState<DetectedPerson | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // ================= SOCKET SETUP =================
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setSocketConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
      setSocketConnected(false);
    });

    socket.on("matchFound", (data) => {
      console.log("🔥 MATCH RECEIVED:", data);

      // Switch video panel to matched camera feed
      setSelectedCamera({
        name: data.camera,
        location: data.location,
        online: true,
        video: `${BACKEND_URL}/${data.video}`,
      });

      setIsPlaying(true);
      setDetecting(false);

      setDetectedPerson({
        name: data.name,
        location: data.location,
        time: data.time,
        zoneAlertness: data.zoneAlertness || "MEDIUM",
        screenshot: `${BACKEND_URL}/${data.screenshot.replace(/\\/g, "/")}`,
      });
    });

    return () => {
      socket.off("matchFound");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  const handleStartDetection = async () => {
    if (!selectedCamera.online) return;

    setDetectedPerson(null);
    setIsPlaying(true);
    setDetecting(true);

    try {
      await fetch(`${BACKEND_URL}/api/start-detection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoPath: selectedCamera.video,
          cameraId: selectedCamera.name,
          location: selectedCamera.location,
        }),
      });
    } catch (err) {
      console.error("Detection start failed:", err);
      setDetecting(false);
    }
  };

  const handleCameraSelect = (cam: Camera) => {
    setSelectedCamera(cam);
    setIsPlaying(false);
    setDetectedPerson(null);
    setDetecting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Guardian AI</h1>
              <p className="text-xs text-gray-500">Missing Person Surveillance</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-gray-500 hover:text-black">Home</Link>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-black">Dashboard</Link>
            <Link to="/cctv" className="text-sm font-medium text-blue-600">CCTV Monitor</Link>
            {/* Socket status pill */}
            <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${socketConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {socketConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {socketConnected ? "Live" : "Disconnected"}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">CCTV Surveillance Monitor</h2>

        {/* CAMERA SELECTOR GRID */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {CAMERAS.map((cam) => (
            <button
              key={cam.name}
              onClick={() => handleCameraSelect(cam)}
              disabled={!cam.online}
              className={`rounded-xl border p-3 text-left transition-all text-xs
                ${selectedCamera.name === cam.name
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : cam.online
                  ? "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${cam.online ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="font-semibold text-gray-700">{cam.name}</span>
              </div>
              <p className="text-gray-500 truncate">{cam.location}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* VIDEO PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-5 py-3.5 border-b flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedCamera.name} — {selectedCamera.location}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedCamera.online ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {selectedCamera.online ? "Online" : "Offline"}
              </span>
            </div>

            <div className="h-72 bg-black flex items-center justify-center">
              {isPlaying && selectedCamera.video ? (
                <video
                  key={selectedCamera.video}
                  src={selectedCamera.video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  {selectedCamera.online ? "Press Start Detection" : "Camera Offline"}
                </span>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleStartDetection}
                disabled={!selectedCamera.online || detecting}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 transition-colors"
              >
                {detecting ? (
                  <>
                    <Radio className="w-4 h-4 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Start Detection
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MATCH RESULTS PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
              Match Results
            </h3>

            {detectedPerson ? (
              <div className="flex flex-col items-center text-center">
                <img
                  src={detectedPerson.screenshot}
                  alt="Match"
                  className="w-64 h-44 object-cover rounded-xl border-2 border-green-400 shadow"
                />
                <p className="mt-4 text-lg font-bold text-green-600">✅ {detectedPerson.name}</p>
                <p className="text-sm text-gray-500 mt-1">📍 {detectedPerson.location}</p>
                <p className="text-sm text-gray-500">🕒 {detectedPerson.time}</p>
                <div className={`mt-4 px-5 py-2 rounded-full text-white text-sm font-semibold ${getZoneColor(detectedPerson.zoneAlertness)}`}>
                  🚨 Zone Alertness: {detectedPerson.zoneAlertness}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                {detecting ? (
                  <>
                    <Radio className="w-8 h-8 animate-pulse text-blue-400" />
                    <p className="text-sm">AI scanning feed...</p>
                    <p className="text-xs text-gray-300">Waiting for match signal</p>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 opacity-20" />
                    <p className="text-sm">No match detected yet</p>
                    <p className="text-xs text-gray-300">Select a camera and start detection</p>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
