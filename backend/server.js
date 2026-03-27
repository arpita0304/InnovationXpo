const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const caseRoutes = require("./routes/caseRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/cases", caseRoutes);

app.get("/", (req, res) => {
  res.send("AI Missing Person Tracker API Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend running",
    time: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});