// Input validation middleware
const JobPosition = require("../models/JobPosition");

const validateApplicationInput = async (req, res, next) => {
  const { name, email, phone, department } = req.body;
  const errors = [];

  // Name validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (!/^[a-zA-Z\s]{2,50}$/.test(name.trim())) {
    errors.push(
      "Name must be 2-50 characters and contain only letters and spaces"
    );
  }

  // Email validation
  if (!email || typeof email !== "string") {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please provide a valid email address");
  }

  // Phone validation
  if (!phone || typeof phone !== "string") {
    errors.push("Phone number is required");
  } else if (!/^[0-9]{10}$/.test(phone)) {
    errors.push("Phone number must be exactly 10 digits");
  }

  // Department validation - Check against active job positions in database
  try {
    const activePositions = await JobPosition.find({
      isActive: true,
      $expr: { $gt: ["$totalPositions", "$filledPositions"] },
    });

    const validDepartments = activePositions.map((pos) => pos.title);

    if (!department || !validDepartments.includes(department)) {
      errors.push("Please select a valid job position");
    }
  } catch (error) {
    console.error("Error validating department:", error);
    // Fallback validation - allow any non-empty string if database check fails
    if (
      !department ||
      typeof department !== "string" ||
      department.trim().length === 0
    ) {
      errors.push("Department is required");
    }
  }
  // Remove the "Other" department validation since we're using dynamic positions now

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (
    !username ||
    typeof username !== "string" ||
    username.trim().length === 0
  ) {
    errors.push("Username is required");
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

const validatePasswordChange = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const errors = [];

  if (!oldPassword || typeof oldPassword !== "string") {
    errors.push("Current password is required");
  }

  if (!newPassword || typeof newPassword !== "string") {
    errors.push("New password is required");
  } else if (newPassword.length < 6) {
    errors.push("New password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

module.exports = {
  validateApplicationInput,
  validateLoginInput,
  validatePasswordChange,
};
