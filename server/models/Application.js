const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  whatsappNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },

  // Address Information
  currentAddress: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  permanentAddress: {
    type: String,
    default: "",
    trim: true,
    maxlength: 500,
  },

  // Banking Information
  bankAccountNumber: {
    type: String,
    default: "",
    trim: true,
  },
  ifscCode: {
    type: String,
    default: "",
    trim: true,
    uppercase: true,
  },
  branchName: {
    type: String,
    default: "",
    trim: true,
  },

  // Authentication
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }, // Documents (file paths)
  documents: {
    tenthMarksheet: String,
    twelfthMarksheet: String,
    graduationMarksheet: String,
    resume: {
      type: String,
      required: true,
    },
    aadharCard: String,
    passportPhoto: {
      type: String,
      required: true,
    },
  },

  // Professional Information
  experience: {
    type: String,
    default: "",
  },
  pastCompany: {
    type: String,
    default: "",
  },
  department: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  otherDepartment: {
    type: String,
    default: "",
  },

  // Application Status
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Scheduled"],
    default: "Pending",
  },
  // Interview Information
  interviewDate: Date,
  interviewTime: String,
  isInstantInterview: {
    type: Boolean,
    default: false,
  },

  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
applicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Application", applicationSchema);
