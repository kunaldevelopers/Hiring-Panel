const express = require("express");
const Application = require("../models/Application");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all applications (admin only)
router.get(
  "/applications",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status, search, page = 1, limit = 10 } = req.query;

      // Build filter object
      const filter = {};

      if (status && status !== "all") {
        filter.status = status;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get applications
      const applications = await Application.find(filter)
        .select("-password")
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Application.countDocuments(filter);

      res.json({
        applications,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: total,
          perPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get single application details (admin only)
router.get(
  "/applications/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.id).select(
        "-password"
      );
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Get application details error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update application status (admin only)
router.patch(
  "/applications/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const validStatuses = ["Pending", "Accepted", "Rejected", "Scheduled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      application.status = status;
      await application.save();

      res.json({
        message: "Status updated successfully",
        application: {
          id: application._id,
          name: application.name,
          status: application.status,
        },
      });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Schedule interview (admin only)
router.patch(
  "/applications/:id/schedule",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { interviewDate, interviewTime, immediate } = req.body;

      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (immediate) {
        // Schedule for next 1 hour (instant interview)
        const now = new Date();
        const scheduledTime = new Date(now.getTime() + 60 * 60000); // 1 hour from now

        application.interviewDate = scheduledTime;
        application.interviewTime = scheduledTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        application.status = "Scheduled";
        application.isInstantInterview = true;
      } else {
        if (!interviewDate || !interviewTime) {
          return res.status(400).json({
            message:
              "Interview date and time are required for scheduled interviews",
          });
        } // Combine date and time
        const combinedDateTime = new Date(`${interviewDate}T${interviewTime}`);

        // Validate that the date is valid
        if (isNaN(combinedDateTime.getTime())) {
          return res.status(400).json({
            message: "Invalid date or time format",
          });
        }

        // Validate that the interview is scheduled for future (with a small buffer for current day)
        const now = new Date();
        const currentTimeBuffer = new Date(now.getTime() - 5 * 60000); // 5 minutes buffer

        if (combinedDateTime <= currentTimeBuffer) {
          return res.status(400).json({
            message: `Interview must be scheduled for a future date and time. Current time: ${now.toLocaleString()}`,
          });
        }

        application.interviewDate = combinedDateTime;
        application.interviewTime = interviewTime;
        application.status = "Scheduled";
        application.isInstantInterview = false;
      }

      application.status = "Scheduled";
      await application.save();

      res.json({
        message: "Interview scheduled successfully",
        application: {
          id: application._id,
          name: application.name,
          status: application.status,
          interviewDate: application.interviewDate,
          interviewTime: application.interviewTime,
        },
      });
    } catch (error) {
      console.error("Schedule interview error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get application statistics (admin only)
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Application.countDocuments();

    const formattedStats = {
      total,
      pending: 0,
      accepted: 0,
      rejected: 0,
      scheduled: 0,
    };

    stats.forEach((stat) => {
      const status = stat._id.toLowerCase();
      formattedStats[status] = stat.count;
    });

    // Get recent applications
    const recentApplications = await Application.find()
      .select("name email appliedAt status")
      .sort({ appliedAt: -1 })
      .limit(5);

    res.json({
      stats: formattedStats,
      recentApplications,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export applications to CSV (admin only)
router.get("/export", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const applications = await Application.find()
      .select("-password -__v")
      .sort({ appliedAt: -1 });

    // Create CSV header
    let csv =
      "Name,Email,Phone,Department,Status,Applied Date,Interview Date,Interview Time\n";

    // Add data rows
    applications.forEach((app) => {
      const row = [
        app.name,
        app.email,
        app.phone,
        app.department === "Other" ? app.otherDepartment : app.department,
        app.status,
        app.appliedAt.toLocaleDateString(),
        app.interviewDate ? app.interviewDate.toLocaleDateString() : "",
        app.interviewTime || "",
      ]
        .map((field) => `"${field}"`)
        .join(",");

      csv += row + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
