const { spawn } = require("child_process");
const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const caseRoutes = require("./routes/caseRoutes");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("🟢 Frontend Connected");

  socket.on("disconnect", () => {
    console.log("🔴 Frontend Disconnected");
  });
});

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve camera videos
app.use("/cameras", express.static(path.join(__dirname, "cameras")));

const upload = multer({ dest: "uploads/" });

// ================= ROUTES =================
app.use("/api/cases", caseRoutes);

app.get("/", (req, res) => {
  res.send("AI Missing Person Tracker API Running");
});

// ======================================================
// 🔥 REGISTER MISSING PERSON
// ======================================================

app.post("/api/register-missing", upload.single("photo"), (req, res) => {

  try {
    const imagePath = req.file.path;
    const personId = Date.now().toString();
    const name = req.body.name;

    const python = spawn("py", [
      "-3.10",
      path.join(__dirname, "python/register_face.py"),
      imagePath,
      personId,
      name
    ]);

    python.stdout.on("data", (data) => {
      console.log("PYTHON:", data.toString());
    });

    python.stderr.on("data", (data) => {
      console.error("PYTHON ERROR:", data.toString());
    });

    python.on("close", (code) => {
      if (code === 0) {
        res.json({ message: "Face Registered Successfully" });
      } else {
        res.status(500).json({ error: "Face Registration Failed" });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }

});


// ======================================================
// 🔥 START VIDEO DETECTION
// ======================================================

app.post("/api/start-detection", (req, res) => {

  try {

    const { videoPath, cameraId, location } = req.body;

    const python = spawn("py", [
      "-3.10",
      path.join(__dirname, "python/detect_video.py"),
      videoPath,
      cameraId,
      location
    ]);

    python.stdout.on("data", (data) => {

      const result = data.toString().trim();
      console.log("PYTHON:", result);

      if (result.startsWith("MATCH")) {

        const parts = result.split("|");

        // 🔥 Zone Alertness Logic
        let zoneAlertness = "MEDIUM";

        if (location.toLowerCase().includes("gate")) {
          zoneAlertness = "HIGH";
        } else if (location.toLowerCase().includes("parking")) {
          zoneAlertness = "LOW";
        }

        const matchData = {
          name: parts[1],
          camera: parts[2],
          location: parts[3],
          screenshot: parts[4],
          video: parts[5],
          time: parts[6],
          zoneAlertness: zoneAlertness
        };

        console.log("🔥 MATCH FOUND:", matchData);

        // Send realtime event to frontend
        io.emit("matchFound", matchData);
      }

    });

    python.stderr.on("data", (data) => {
      console.error("PYTHON ERROR:", data.toString());
    });

    python.on("close", (code) => {
      console.log("Detection process ended with code:", code);
    });

    res.json({ message: "Detection Started" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Detection Failed" });
  }

});


// ======================================================
// 🔥 SIMPLE FACE SCAN (for dashboard demo button)
// ======================================================

app.get("/api/scan", (req, res) => {

  // Optional: accept a video path via query param, e.g. /api/scan?video=cameras/cam1.mp4
  // Falls back to a default test video if none provided
  const videoPath = req.query.video
    ? path.join(__dirname, req.query.video)
    : path.join(__dirname, "ai_module/cam01.mp4");

  const scriptPath = path.join(__dirname, "ai_module/detect.py");

  const python = spawn("py", ["-3.10", scriptPath, videoPath]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
    console.log("SCAN PYTHON:", data.toString());
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
    console.error("SCAN PYTHON ERROR:", data.toString());
  });

  python.on("close", (code) => {
    if (output.includes("FACE_DETECTED")) {
      return res.json({ detected: true, message: "Face detected in video feed!" });
    } else {
      return res.json({ detected: false, message: "No face detected." });
    }
  });

  python.on("error", (err) => {
    return res.status(500).json({ error: "Failed to run AI script: " + err.message });
  });

});


const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});