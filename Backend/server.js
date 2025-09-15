import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB connection error ❌", err));

const SerialSchema = new mongoose.Schema({
  SNo: Number,
  SerialNumber: String,
  IsAssigned: { type: Boolean, default: false },
  assignedTo: { type: String, default: null },
});

const Serial = mongoose.model("Serial", SerialSchema);

// Route: Scan QR and assign
app.post("/api/scan", async (req, res) => {
  const { serialNumber, assignedTo } = req.body;

  try {
    const entry = await Serial.findOne({ SerialNumber: serialNumber });

    // 🔴 If serial not found in DB
    if (!entry) {
      return res.status(404).json({
        status: "not_found",
        message: "❌ Serial number not found",
      });
    }

    // 🟡 If serial already assigned
    if (entry.IsAssigned) {
      return res.status(200).json({
        status: "already_assigned",
        message: "⚠️ Serial already assigned",
        data: entry,
      });
    }

    // 🟢 If serial is valid and not assigned → assign now
    entry.IsAssigned = true;
    entry.assignedTo = assignedTo || "Guest";
    await entry.save();

    res.json({
      status: "registered",
      message: "✅ Assigned successfully",
      data: entry,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
});

// Route: Admin view all
app.get("/api/admin/all", async (req, res) => {
  try {
    const entries = await Serial.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
