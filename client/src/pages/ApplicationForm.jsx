import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { applicationAPI, jobPositionAPI } from "../utils/api";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [jobPositions, setJobPositions] = useState([]);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    pastCompany: "",
    department: "",
    otherDepartment: "",
  });

  const [files, setFiles] = useState({
    tenthMarksheet: null,
    twelfthMarksheet: null,
    resume: null,
    aadharCard: null,
  });

  // Fetch active job positions on component mount
  useEffect(() => {
    fetchJobPositions();
  }, []);

  const fetchJobPositions = async () => {
    try {
      const response = await jobPositionAPI.getAllPositions();
      const activePositions = response.data.filter(
        (position) => position.isActive && position.availablePositions > 0
      );
      setJobPositions(activePositions);
    } catch (error) {
      console.error("Fetch job positions error:", error);
      // Fallback to default departments if API fails
      setJobPositions([]);
    }
  };

  const departments = [
    "Cyber Security",
    "Web Dev",
    "App Dev",
    "Full Stack",
    "Digital Marketing",
    "AI & Automation",
    "Sales Executive",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  const validateForm = () => {
    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      toast.error("Name can only contain letters and spaces");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    // Required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.department
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Resume is required
    if (!files.resume) {
      toast.error("Resume is required");
      return false;
    }

    // Other department field required if "Other" is selected
    if (formData.department === "Other" && !formData.otherDepartment) {
      toast.error('Please specify the department when selecting "Other"');
      return false;
    }

    // File type validation
    if (files.resume && files.resume.type !== "application/pdf") {
      toast.error("Resume must be a PDF file");
      return false;
    }

    // Validate other files if uploaded
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
    for (const [key, file] of Object.entries(files)) {
      if (file && key !== "resume" && !allowedTypes.includes(file.type)) {
        toast.error(`${key} must be a PDF or JPG file`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // Add files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      const response = await applicationAPI.submit(submitData);

      setCredentials(response.data.credentials);
      setShowCredentials(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error.response?.data?.message || "Error submitting application";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (showCredentials) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full card-surface rounded-2xl p-8 shadow-glow">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-text mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-textSecondary mb-8 leading-relaxed">
              Your application has been received. Please save these login
              credentials to track your application status.
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.74 5.74L9 10.26A6 6 0 1115 7z"
                  />
                </svg>
                Your Login Credentials
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-surface/50 rounded-lg p-3">
                  <span className="text-textSecondary font-medium">
                    Username:
                  </span>
                  <span className="font-mono text-text bg-background px-3 py-1 rounded-md text-sm">
                    {credentials.username}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface/50 rounded-lg p-3">
                  <span className="text-textSecondary font-medium">
                    Password:
                  </span>
                  <span className="font-mono text-text bg-background px-3 py-1 rounded-md text-sm">
                    {credentials.password}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full btn-primary py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Login Now
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full btn-secondary py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card-surface rounded-2xl p-8 shadow-glow">
          {" "}
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-lg">
              <img
                src="https://enegixwebsolutions.com/wp-content/uploads/2025/03/ews.png.webp"
                alt="Enegix Web Solutions"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Application Form
            </div>
            <h2 className="text-4xl font-bold text-text mb-4">Join Our Team</h2>
            <p className="text-xl text-textSecondary max-w-2xl mx-auto">
              Take the first step towards your dream career. Fill out the form
              below to apply for a position with us.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-xl font-semibold text-text flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    maxLength="10"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="10-digit phone number"
                  />
                </div>{" "}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Department</option>

                    {/* Dynamic Job Positions (with available positions) */}
                    {jobPositions.length > 0 && (
                      <optgroup label="Available Positions">
                        {jobPositions.map((position) => (
                          <option
                            key={position._id}
                            value={position.title}
                            className="bg-background text-text"
                          >
                            {position.title} ({position.availablePositions}{" "}
                            available)
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* Fallback to default departments if no positions loaded */}
                    {jobPositions.length === 0 && (
                      <>
                        {departments.map((dept) => (
                          <option
                            key={dept}
                            value={dept}
                            className="bg-background text-text"
                          >
                            {dept}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Other Department Field */}
              {formData.department === "Other" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-text mb-2">
                    Specify Department <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="otherDepartment"
                    value={formData.otherDepartment}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter department name"
                  />
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-xl font-semibold text-text flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                    />
                  </svg>
                  Experience (Optional)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Experience Details
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe your experience, skills, and achievements"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Previous Company
                  </label>
                  <input
                    type="text"
                    name="pastCompany"
                    value={formData.pastCompany}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Previous company name"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-xl font-semibold text-text flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Document Uploads
                </h3>
                <p className="text-textSecondary text-sm mt-2">
                  Upload your documents in PDF or JPG format. Resume is
                  required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "tenthMarksheet",
                    label: "10th Marksheet",
                    required: false,
                    accept: ".pdf,.jpg,.jpeg",
                  },
                  {
                    name: "twelfthMarksheet",
                    label: "12th Marksheet",
                    required: false,
                    accept: ".pdf,.jpg,.jpeg",
                  },
                  {
                    name: "resume",
                    label: "Resume",
                    required: true,
                    accept: ".pdf",
                  },
                  {
                    name: "aadharCard",
                    label: "Aadhar Card",
                    required: false,
                    accept: ".pdf,.jpg,.jpeg",
                  },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-text">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-400">*</span>
                      )}
                      <span className="text-textSecondary text-xs ml-1">
                        ({field.accept.replace(/\./g, "").toUpperCase()})
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name={field.name}
                        onChange={handleFileChange}
                        accept={field.accept}
                        required={field.required}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-border">
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="group btn-primary px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg
                        className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
