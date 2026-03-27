const Case = require("../models/Case");
const { calculateZoneStatus } = require("../services/zoneService");
const { runFaceMatch } = require("../services/faceMatchService");

const registerCase = async (req, res) => {
  try {
    const { name, age, gender, area } = req.body;

    // Basic validation
    if (!name || !age || !gender || !area) {
      return res.status(400).json({
        message: "All fields (name, age, gender, area) are required"
      });
    }

    const photoPath = req.file ? req.file.path : null;

    let matchResult = {
      matched: false,
      camera: null,
      time: null
    };

    if (photoPath) {
      try {
        matchResult = await runFaceMatch(photoPath);
      } catch (err) {
        console.log("Face match error:", err.message);
      }
    }

    const zoneStatus = await calculateZoneStatus(area);

    const newCase = await Case.create({
      name,
      age,
      gender,
      area,
      photo: photoPath,
      lastSeenLocation: matchResult.camera,
      lastSeenTime: matchResult.time,
      cameraMatched: matchResult.camera,
      zoneStatus
    });

    console.log("Case registered:", newCase._id);

    res.status(201).json(newCase);

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getZoneStats = async (req, res) => {
  try {
    const { area } = req.params;

    const count = await Case.countDocuments({ area });
    const zoneStatus = await calculateZoneStatus(area);

    res.json({ area, count, zoneStatus });
  } catch (error) {
    console.error("Zone error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCase,
  getAllCases,
  getZoneStats
};