import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/garba_event", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SerialSchema = new mongoose.Schema({
  SNo: Number,
  SerialNumber: String,
  IsAssigned: Boolean,
  assignedTo: { type: String, default: null },
});

const Serial = mongoose.model("Serial", SerialSchema);

// Route: Scan QR and assign
app.post("/api/scan", async (req, res) => {
  const { serialNumber, assignedTo } = req.body;

  try {
    const entry = await Serial.findOne({ SerialNumber: serialNumber });

    if (!entry) {
      return res.status(404).json({
        status: "not_registered",
        message: "❌ Serial not found",
      });
    }

    if (entry.IsAssigned) {
      return res.status(200).json({
        status: "already_assigned",
        message: "⚠️ Serial already assigned",
        data: entry,
      });
    }

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
