import { Shield, Circle, Play, Bell } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Guardian AI</h1>
              <p className="text-xs text-muted-foreground">Missing Person Surveillance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground"> Home </Link>
            <Link to="/cctv" className="text-sm font-medium text-primary"> CCTV Monitor </Link>

          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="px-10 py-8">

        {/* PAGE TITLE */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            CCTV Surveillance Monitor
          </h2>
          <p className="text-sm text-gray-500">
            Live feed capture & AI face matching system
          </p>
        </div>

        {/* CAMERA NETWORK */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            CAMERA NETWORK
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {cameras.map((cam) => (
              <CameraCard
                key={cam.name}
                name={cam.name}
                location={cam.location}
                online={cam.online}
                isSelected={selectedCamera.name === cam.name}
                onClick={() => {
                  setSelectedCamera(cam);
                  setIsPlaying(false);
                }}
              />
            ))}
          </div>
        </div>

        {/* MAIN PANELS */}
        <div className="grid grid-cols-2 gap-8">

          {/* VIDEO FEED */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b text-sm font-medium text-gray-600">
              {selectedCamera.name} — {selectedCamera.location}
            </div>

            <div className="h-80 bg-gray-200 flex items-center justify-center text-gray-400">
              {isPlaying && selectedCamera.video ? (
                <video
                  key={selectedCamera.video}
                  src={selectedCamera.video}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                "No Live Feed"
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setIsPlaying(true)}
                disabled={!selectedCamera.online}
                className={`w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2
                  ${selectedCamera.online
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <Play size={16} />
                {selectedCamera.online ? "Start Camera" : "Camera Offline"}
              </button>
            </div>
          </div>

          {/* MATCH RESULTS */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">
              MATCH RESULTS
            </h3>

            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
              Capture a frame to begin analysis
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


/* CAMERA CARD COMPONENT */

function CameraCard({ name, location, online, onClick, isSelected }: any) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-4 flex justify-between items-start transition hover:shadow-md
        ${online ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}
        ${isSelected ? "ring-2 ring-blue-500" : ""}
      `}
    >
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{location}</p>
      </div>

      <Circle
        size={10}
        className={
          online
            ? "text-green-500 fill-green-500"
            : "text-red-500 fill-red-500"
        }
      />
    </div>
  );
}