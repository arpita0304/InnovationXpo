import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CCTVMonitor from "./pages/CCTVMonitor";

export default function App() {
  return (
      <div className="min-h-screen bg-gray-100">

        {/* PAGE CONTENT */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cctv" element={<CCTVMonitor />} />
          </Routes>
        </div>
      </div>
  );
}