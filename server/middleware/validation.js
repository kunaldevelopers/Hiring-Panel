// Input validation middleware
const validateApplicationInput = (req, res, next) => {
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

  // Department validation
  const validDepartments = [
    "Cyber Security",
    "Web Dev",
    "App Dev",
    "Full Stack",
    "Digital Marketing",
    "AI & Automation",
    "Sales Executive",
    "Other",
  ];

  if (!department || !validDepartments.includes(department)) {
    errors.push("Please select a valid department");
  }

  // Other department validation
  if (
    department === "Other" &&
    (!req.body.otherDepartment || req.body.otherDepartment.trim().length === 0)
  ) {
    errors.push('Please specify the department when selecting "Other"');
  }

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
