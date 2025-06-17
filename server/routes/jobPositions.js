const express = require("express");
const JobPosition = require("../models/JobPosition");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all active job positions (public route)
router.get("/", async (req, res) => {
  try {
    const positions = await JobPosition.find({
      isActive: true,
      $expr: { $gt: ["$totalPositions", "$filledPositions"] },
    }).sort({
      createdAt: -1,
    });

    res.json(positions);
  } catch (error) {
    console.error("Get job positions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all job positions (admin only)
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const positions = await JobPosition.find().sort({ createdAt: -1 });

    res.json(positions);
  } catch (error) {
    console.error("Get all job positions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new job position (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, requirements, totalPositions } = req.body;

    // Validate required fields
    if (!title || !description || !requirements || !totalPositions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(requirements) || requirements.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one requirement is needed" });
    }

    const position = new JobPosition({
      title,
      description,
      requirements,
      totalPositions: parseInt(totalPositions),
    });

    await position.save();

    res.status(201).json({
      message: "Job position created successfully",
      position,
    });
  } catch (error) {
    console.error("Create job position error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update job position (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, requirements, totalPositions, isActive } =
      req.body;

    const position = await JobPosition.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Job position not found" });
    }

    // Update fields
    if (title !== undefined) position.title = title;
    if (description !== undefined) position.description = description;
    if (requirements !== undefined) position.requirements = requirements;
    if (totalPositions !== undefined)
      position.totalPositions = parseInt(totalPositions);
    if (isActive !== undefined) position.isActive = isActive;

    await position.save();

    res.json({
      message: "Job position updated successfully",
      position,
    });
  } catch (error) {
    console.error("Update job position error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete job position (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const position = await JobPosition.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Job position not found" });
    }

    await JobPosition.findByIdAndDelete(req.params.id);

    res.json({ message: "Job position deleted successfully" });
  } catch (error) {
    console.error("Delete job position error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
