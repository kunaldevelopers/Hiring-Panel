const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const Application = require("../models/Application");
const { authMiddleware } = require("../middleware/auth");
const { validateApplicationInput } = require("../middleware/validation");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  console.log(
    `📁 File upload attempt - Field: ${file.fieldname}, Type: ${file.mimetype}, Name: ${file.originalname}`
  );

  // Allow PDF, JPG, and PNG files for all document types including resume
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    console.log(`✅ File accepted: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    const errorMessage = `${file.fieldname} must be a PDF, JPG, or PNG file. Received: ${file.mimetype}`;
    console.log(`❌ File rejected: ${file.originalname} - ${errorMessage}`);
    cb(new Error(errorMessage), false);
  }
};

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error("🚨 Multer error occurred:", err.message);
    console.error("🔍 Error details:", {
      name: err.name,
      code: err.code,
      field: err.field,
      message: err.message,
    });

    // Clean up any uploaded files
    if (req.files) {
      console.log("🧹 Cleaning up uploaded files due to error...");
      Object.values(req.files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file:", unlinkErr);
            else console.log(`🗑️ Deleted file: ${file.filename}`);
          });
        });
      });
    }

    // Return specific error message
    return res.status(400).json({
      message: err.message,
      error: "File upload validation failed",
    });
  }
  next();
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Generate random username and password
function generateCredentials() {
  const username = "user" + Math.random().toString(36).substr(2, 6);
  const password = Math.random().toString(36).substr(2, 8);
  return { username, password };
}

// Submit application
router.post(
  "/submit",
  (req, res, next) => {
    console.log("🚀 Application submit route hit");
    console.log("📝 Request body fields:", Object.keys(req.body));
    next();
  },
  upload.fields([
    { name: "tenthMarksheet", maxCount: 1 },
    { name: "twelfthMarksheet", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(
      "📎 Files received:",
      req.files ? Object.keys(req.files) : "No files"
    );
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        fileArray.forEach((file) => {
          console.log(
            `📄 ${fieldName}: ${file.originalname} (${file.mimetype})`
          );
        });
      });
    }
    next();
  },
  handleMulterError,
  validateApplicationInput,
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        experience,
        pastCompany,
        department,
        otherDepartment,
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !department) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate phone format (10 digits)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res
          .status(400)
          .json({ message: "Phone number must be 10 digits" });
      }

      // Validate name (only letters and spaces)
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(name)) {
        return res
          .status(400)
          .json({ message: "Name can only contain letters and spaces" });
      }

      // Check if email already exists
      const existingApplication = await Application.findOne({ email });
      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "Application with this email already exists" });
      }

      // Check if resume is uploaded (required)
      if (!req.files || !req.files.resume) {
        return res.status(400).json({ message: "Resume is required" });
      }

      // Generate credentials
      const { username, password } = generateCredentials();

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Prepare documents object
      const documents = {
        resume: req.files.resume[0].filename,
      };

      if (req.files.tenthMarksheet) {
        documents.tenthMarksheet = req.files.tenthMarksheet[0].filename;
      }
      if (req.files.twelfthMarksheet) {
        documents.twelfthMarksheet = req.files.twelfthMarksheet[0].filename;
      }
      if (req.files.aadharCard) {
        documents.aadharCard = req.files.aadharCard[0].filename;
      }

      // Create new application
      const newApplication = new Application({
        name,
        email,
        phone,
        username,
        password: hashedPassword,
        documents,
        experience: experience || "",
        pastCompany: pastCompany || "",
        department,
        otherDepartment: department === "Other" ? otherDepartment : "",
      });

      await newApplication.save();

      res.status(201).json({
        message: "Application submitted successfully",
        credentials: {
          username,
          password, // Return plain password to show user
        },
        applicationId: newApplication._id,
      });
    } catch (error) {
      console.error("Submit application error:", error);

      // Clean up uploaded files if there's an error
      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting file:", err);
            });
          });
        });
      }
      if (
        error.message.includes("must be a PDF, JPG, or PNG file") ||
        error.message.includes("File must be") ||
        error.message.includes("Resume must be")
      ) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get candidate profile (protected route)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const candidate = await Application.findById(req.user.id).select(
      "-password"
    );
    if (!candidate) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(candidate);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update candidate profile (optional fields only)
router.patch(
  "/profile",
  authMiddleware,
  upload.fields([
    { name: "tenthMarksheet", maxCount: 1 },
    { name: "twelfthMarksheet", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  handleMulterError,
  async (req, res) => {
    try {
      const candidate = await Application.findById(req.user.id);
      if (!candidate) {
        return res.status(404).json({ message: "Application not found" });
      }

      const { experience, pastCompany } = req.body;

      // Update optional fields
      if (experience !== undefined) candidate.experience = experience;
      if (pastCompany !== undefined) candidate.pastCompany = pastCompany;

      // Update documents if uploaded
      if (req.files) {
        // Update tenth marksheet if uploaded
        if (req.files.tenthMarksheet) {
          if (candidate.documents.tenthMarksheet) {
            const oldFilePath = path.join(
              uploadsDir,
              candidate.documents.tenthMarksheet
            );
            fs.unlink(oldFilePath, (err) => {
              if (err)
                console.error("Error deleting old tenth marksheet file:", err);
            });
          }
          candidate.documents.tenthMarksheet =
            req.files.tenthMarksheet[0].filename;
        }

        // Update twelfth marksheet if uploaded
        if (req.files.twelfthMarksheet) {
          if (candidate.documents.twelfthMarksheet) {
            const oldFilePath = path.join(
              uploadsDir,
              candidate.documents.twelfthMarksheet
            );
            fs.unlink(oldFilePath, (err) => {
              if (err)
                console.error(
                  "Error deleting old twelfth marksheet file:",
                  err
                );
            });
          }
          candidate.documents.twelfthMarksheet =
            req.files.twelfthMarksheet[0].filename;
        }

        // Update resume if uploaded
        if (req.files.resume) {
          if (candidate.documents.resume) {
            const oldFilePath = path.join(
              uploadsDir,
              candidate.documents.resume
            );
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error("Error deleting old resume file:", err);
            });
          }
          candidate.documents.resume = req.files.resume[0].filename;
        }

        // Update Aadhar card if uploaded
        if (req.files.aadharCard) {
          if (candidate.documents.aadharCard) {
            const oldFilePath = path.join(
              uploadsDir,
              candidate.documents.aadharCard
            );
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error("Error deleting old Aadhar file:", err);
            });
          }
          candidate.documents.aadharCard = req.files.aadharCard[0].filename;
        }
      }

      await candidate.save();

      res.json({
        message: "Profile updated successfully",
        application: candidate,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      // Clean up uploaded files if there's an error
      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting file:", err);
            });
          });
        });
      }

      // Handle file validation errors
      if (
        error.message.includes("must be a PDF, JPG, or PNG file") ||
        error.message.includes("File must be") ||
        error.message.includes("Resume must be")
      ) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
