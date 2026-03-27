import { Shield, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export default function CCTVMonitor() {

  const cameras = [
  {
    name: "CAM01",
    location: "College",
    online: true,
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/CAM1.mp4"
  },
  {
    name: "CAM02",
    location: "Shopping Mall",
    online: true,
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/CAM2.mp4"
  },
  {
    name: "CAM03",
    location: "Bus Stand",
    online: false,
    video: ""
  },
  {
    name: "CAM04",
    location: "Railway Station",
    online: true,
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/CAM3.mp4"
  },
  {
    name: "CAM05",
    location: "Highway",
    online: true,
    video: "https://guardianai-videos.s3.ap-south-1.amazonaws.com/cam4.mp4"
  },
  {
    name: "CAM06",
    location: "Bhaji Market",
    online: false,
    video: ""
  },
];

  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectedPerson, setDetectedPerson] = useState<any>(null);

  // ================= SOCKET LISTENER =================
  useEffect(() => {

    socket.connect();

    socket.on("matchFound", (data) => {

      console.log("🔥 MATCH RECEIVED:", data);

      setSelectedCamera({
        name: data.camera,
        location: data.location,
        online: true,
        video: `http://localhost:5000/${data.video}`
      });

      setIsPlaying(true);

      setDetectedPerson({
        name: data.name,
        location: data.location,
        time: data.time,
        zoneAlertness: data.zoneAlertness,
        screenshot: `http://localhost:5000/${data.screenshot.replace(/\\/g, "/")}`
      });

    });

    return () => {
      socket.off("matchFound");
      socket.disconnect();
    };

  }, []);

  const getZoneColor = (zone: string) => {
    if (zone === "HIGH") return "bg-red-600";
    if (zone === "MEDIUM") return "bg-yellow-500";
    return "bg-green-600";
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

          <div className="flex items-center gap-4">

            <Link to="/" className="text-sm text-gray-500 hover:text-black">Home</Link>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-black">Dashboard</Link>
            <Link to="/cctv" className="text-sm font-medium text-blue-600">CCTV Monitor</Link>

          </div>
        </div>
      </nav>

      <div className="px-10 py-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          CCTV Surveillance Monitor
        </h2>

        <div className="grid grid-cols-2 gap-8">

          {/* VIDEO PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b text-sm font-medium text-gray-600">
              {selectedCamera.name} — {selectedCamera.location}
            </div>

            <div className="h-80 bg-black flex items-center justify-center">
              {isPlaying && selectedCamera.video ? (
                <video
                  key={selectedCamera.video}
                  src={selectedCamera.video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Live Feed</span>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => {

                  setDetectedPerson(null);   // clear old result
                  setIsPlaying(true);

                  fetch("http://localhost:5000/api/start-detection", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      videoPath: selectedCamera.video,
                      cameraId: selectedCamera.name,
                      location: selectedCamera.location
                    })
                  });

                }}
                disabled={!selectedCamera.online}
                className="w-full py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Start Detection
              </button>
            </div>
          </div>

          {/* MATCH RESULTS PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">
              MATCH RESULTS
            </h3>

            {detectedPerson ? (
              <div className="flex flex-col items-center text-center">

                <img
                  src={detectedPerson.screenshot}
                  alt="Match"
                  className="w-64 h-48 object-cover rounded-lg border"
                />

                <p className="mt-4 text-lg font-semibold text-green-600">
                  {detectedPerson.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  📍 Last Seen: {detectedPerson.location}
                </p>

                <p className="text-sm text-gray-500">
                  🕒 Time: {detectedPerson.time}
                </p>

                <div className={`mt-4 px-4 py-2 rounded-full text-white text-sm font-medium ${getZoneColor(detectedPerson.zoneAlertness || "MEDIUM")}`}>
                  🚨 Zone Alertness: {detectedPerson.zoneAlertness || "MEDIUM"}
                </div>

              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
                No match detected yet
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}