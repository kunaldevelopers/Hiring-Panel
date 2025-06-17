const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Application = require("../models/Application");
const Admin = require("../models/Admin");
const {
  validateLoginInput,
  validatePasswordChange,
} = require("../middleware/validation");

const router = express.Router();

// Generate random username and password
function generateCredentials() {
  const username = "user" + Math.random().toString(36).substr(2, 6);
  const password = Math.random().toString(36).substr(2, 8);
  return { username, password };
}

// Candidate login
router.post("/login", validateLoginInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find candidate
    const candidate = await Application.findOne({ username });
    if (!candidate) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, candidate.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: candidate._id,
        username: candidate.username,
        type: "candidate",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: candidate._id,
        username: candidate.username,
        name: candidate.name,
        email: candidate.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin login
router.post("/admin/login", validateLoginInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        type: "admin",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change password
router.post("/change-password", validatePasswordChange, async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Find candidate
    const candidate = await Application.findOne({ username });
    if (!candidate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      candidate.password
    );
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    candidate.password = hashedNewPassword;
    await candidate.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change admin password
router.post(
  "/admin/change-password",
  validatePasswordChange,
  async (req, res) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      // Find admin
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Check old password
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        admin.password
      );
      if (!isOldPasswordValid) {
        return res.status(401).json({ message: "Invalid old password" });
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      admin.password = hashedNewPassword;
      await admin.save();

      res.json({ message: "Admin password changed successfully" });
    } catch (error) {
      console.error("Change admin password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Change username
router.post("/change-username", async (req, res) => {
  try {
    const { currentUsername, newUsername, password } = req.body;

    // Validate required fields
    if (!currentUsername || !newUsername || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate new username length
    if (newUsername.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    // Find current candidate
    const candidate = await Application.findOne({ username: currentUsername });
    if (!candidate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, candidate.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Check if new username already exists
    const existingUser = await Application.findOne({
      username: newUsername,
    });
    if (
      existingUser &&
      existingUser._id.toString() !== candidate._id.toString()
    ) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Update username
    candidate.username = newUsername;
    await candidate.save();

    res.json({
      message: "Username changed successfully",
      newUsername: newUsername,
    });
  } catch (error) {
    console.error("Change username error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
