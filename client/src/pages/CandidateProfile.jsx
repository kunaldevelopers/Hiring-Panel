import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { applicationAPI, authAPI } from "../utils/api";

const CandidateProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [application, setApplication] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUsernameChange, setShowUsernameChange] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    // Contact Information
    phone: "",
    whatsappNumber: "",
    // Address Information
    currentAddress: "",
    permanentAddress: "",
    // Banking Information
    bankAccountNumber: "",
    ifscCode: "",
    branchName: "",
    // Professional Information
    experience: "",
    pastCompany: "",
    // Documents
    tenthMarksheet: null,
    twelfthMarksheet: null,
    graduationMarksheet: null,
    resume: null,
    aadharCard: null,
    passportPhoto: null,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [usernameData, setUsernameData] = useState({
    newUsername: "",
    password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await applicationAPI.getProfile();
      setApplication(response.data);
      setUpdateData({
        // Contact Information
        phone: response.data.phone || "",
        whatsappNumber: response.data.whatsappNumber || "",
        // Address Information
        currentAddress: response.data.currentAddress || "",
        permanentAddress: response.data.permanentAddress || "",
        // Banking Information
        bankAccountNumber: response.data.bankAccountNumber || "",
        ifscCode: response.data.ifscCode || "",
        branchName: response.data.branchName || "",
        // Professional Information
        experience: response.data.experience || "",
        pastCompany: response.data.pastCompany || "",
        // Documents (reset to null for updates)
        tenthMarksheet: null,
        twelfthMarksheet: null,
        graduationMarksheet: null,
        resume: null,
        aadharCard: null,
        passportPhoto: null,
      });
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value, files } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setUsernameData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // Validate form data
    const isValid = validateUpdateForm();
    if (!isValid) {
      setUpdating(false);
      return;
    }

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("phone", updateData.phone);
      formData.append("whatsappNumber", updateData.whatsappNumber);
      formData.append("currentAddress", updateData.currentAddress);
      formData.append("permanentAddress", updateData.permanentAddress);
      formData.append("bankAccountNumber", updateData.bankAccountNumber);
      formData.append("ifscCode", updateData.ifscCode);
      formData.append("branchName", updateData.branchName);
      formData.append("experience", updateData.experience);
      formData.append("pastCompany", updateData.pastCompany);

      // Add files if they exist
      const documentFields = [
        "tenthMarksheet",
        "twelfthMarksheet",
        "graduationMarksheet",
        "resume",
        "aadharCard",
        "passportPhoto",
      ];

      documentFields.forEach((field) => {
        if (updateData[field]) {
          formData.append(field, updateData[field]);
        }
      });

      await applicationAPI.updateProfile(formData);
      toast.success("Profile updated successfully");
      setShowUpdateForm(false);
      fetchProfile();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      await authAPI.changePassword({
        username: localStorage.getItem("username"),
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");
      setShowPasswordChange(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();

    if (!usernameData.newUsername) {
      toast.error("Please enter a new username");
      return;
    }

    if (usernameData.newUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (!usernameData.password) {
      toast.error("Please enter your current password");
      return;
    }
    try {
      await authAPI.changeUsername({
        currentUsername: localStorage.getItem("username"),
        newUsername: usernameData.newUsername,
        password: usernameData.password,
      });

      // Update localStorage with new username
      localStorage.setItem("username", usernameData.newUsername);

      toast.success("Username changed successfully");
      setShowUsernameChange(false);
      setUsernameData({
        newUsername: "",
        password: "",
      });
      fetchProfile();
    } catch (error) {
      console.error("Change username error:", error);
      toast.error(error.response?.data?.message || "Failed to change username");
    }
  };

  const validateUpdateForm = () => {
    // Phone validation (10 digits) - only if provided
    const phoneRegex = /^[0-9]{10}$/;
    if (updateData.phone && !phoneRegex.test(updateData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    // WhatsApp number validation (10 digits) - only if provided
    if (
      updateData.whatsappNumber &&
      !phoneRegex.test(updateData.whatsappNumber)
    ) {
      toast.error("WhatsApp number must be exactly 10 digits");
      return false;
    }

    // IFSC code validation - only if provided
    if (updateData.ifscCode && updateData.ifscCode.length > 0) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(updateData.ifscCode)) {
        toast.error("Please enter a valid IFSC code");
        return false;
      }
    }

    return true;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load application data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Application
              </h1>
              <p className="text-gray-600">Welcome back, {application.name}</p>
            </div>{" "}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpdateForm(!showUpdateForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Update Profile
              </button>
              <button
                onClick={() => setShowUsernameChange(!showUsernameChange)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                Change Username
              </button>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
        {/* Application Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Application Status
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status}
              </span>
              <p className="text-gray-600 mt-2">
                Applied on:{" "}
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>

            {application.status === "Scheduled" &&
              application.interviewDate && (
                <div className="text-right">
                  <p className="font-medium text-blue-600">
                    Interview Scheduled
                  </p>
                  <p className="text-gray-600">
                    {new Date(application.interviewDate).toLocaleDateString()}{" "}
                    at {application.interviewTime}
                  </p>
                </div>
              )}
          </div>
        </div>{" "}
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-gray-900">{application.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{application.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-gray-900">{application.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{application.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                WhatsApp Number
              </p>
              <p className="text-gray-900">
                {application.whatsappNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-gray-900">
                {application.department === "Other"
                  ? application.otherDepartment
                  : application.department}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Experience</p>
              <p className="text-gray-900">
                {application.experience || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Past Company</p>
              <p className="text-gray-900">
                {application.pastCompany || "Not provided"}
              </p>
            </div>
          </div>
        </div>
        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Address Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Address
              </p>
              <p className="text-gray-900">
                {application.currentAddress || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Permanent Address
              </p>
              <p className="text-gray-900">
                {application.permanentAddress || "Not provided"}
              </p>
            </div>
          </div>
        </div>
        {/* Banking Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Banking Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Bank Account Number
              </p>
              <p className="text-gray-900">
                {application.bankAccountNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">IFSC Code</p>
              <p className="text-gray-900">
                {application.ifscCode || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Branch Name</p>
              <p className="text-gray-900">
                {application.branchName || "Not provided"}
              </p>
            </div>
          </div>
        </div>
        {/* Documents */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Uploaded Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                10th Marksheet
              </p>
              <p className="text-gray-900">
                {application.documents.tenthMarksheet
                  ? "✅ Uploaded"
                  : "❌ Not uploaded"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                12th Marksheet
              </p>
              <p className="text-gray-900">
                {application.documents.twelfthMarksheet
                  ? "✅ Uploaded"
                  : "❌ Not uploaded"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Resume</p>
              <p className="text-gray-900">
                {application.documents.resume
                  ? "✅ Uploaded"
                  : "❌ Not uploaded"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Aadhar Card</p>
              <p className="text-gray-900">
                {application.documents.aadharCard
                  ? "✅ Uploaded"
                  : "❌ Not uploaded"}
              </p>
            </div>
          </div>
        </div>{" "}
        {/* Update Profile Form */}
        {showUpdateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Update Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>{" "}
                    <input
                      type="tel"
                      name="phone"
                      value={updateData.phone}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="10-digit phone number"
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>{" "}
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={updateData.whatsappNumber}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="10-digit WhatsApp number"
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Address Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Address
                    </label>{" "}
                    <textarea
                      name="currentAddress"
                      value={updateData.currentAddress}
                      onChange={handleUpdateChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Enter your current address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permanent Address
                    </label>{" "}
                    <textarea
                      name="permanentAddress"
                      value={updateData.permanentAddress}
                      onChange={handleUpdateChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Enter your permanent address (if different from current)"
                    />
                  </div>
                </div>
              </div>

              {/* Banking Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Banking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Number
                    </label>{" "}
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={updateData.bankAccountNumber}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>{" "}
                    <input
                      type="text"
                      name="ifscCode"
                      value={updateData.ifscCode}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch Name
                    </label>{" "}
                    <input
                      type="text"
                      name="branchName"
                      value={updateData.branchName}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Enter branch name"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>{" "}
                    <textarea
                      name="experience"
                      value={updateData.experience}
                      onChange={handleUpdateChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Describe your experience"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Past Company
                    </label>{" "}
                    <input
                      type="text"
                      name="pastCompany"
                      value={updateData.pastCompany}
                      onChange={handleUpdateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                      placeholder="Previous company name"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Update Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      10th Marksheet (PDF/JPG)
                    </label>
                    <input
                      type="file"
                      name="tenthMarksheet"
                      onChange={handleUpdateChange}
                      accept=".pdf,.jpg,.jpeg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer text-gray-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      12th Marksheet (PDF/JPG)
                    </label>
                    <input
                      type="file"
                      name="twelfthMarksheet"
                      onChange={handleUpdateChange}
                      accept=".pdf,.jpg,.jpeg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer text-gray-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Marksheet (PDF/JPG)
                    </label>
                    <input
                      type="file"
                      name="graduationMarksheet"
                      onChange={handleUpdateChange}
                      accept=".pdf,.jpg,.jpeg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer text-gray-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume (PDF/JPG)
                    </label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleUpdateChange}
                      accept=".pdf,.jpg,.jpeg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer text-gray-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Card (PDF/JPG)
                    </label>
                    <input
                      type="file"
                      name="aadharCard"
                      onChange={handleUpdateChange}
                      accept=".pdf,.jpg,.jpeg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer text-gray-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Photo (JPG)
                    </label>
                    <input
                      type="file"
                      name="passportPhoto"
                      onChange={handleUpdateChange}
                      accept=".jpg,.jpeg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer text-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-300"
                >
                  {updating ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Change Password Form */}
        {showPasswordChange && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Change Username Form */}
        {showUsernameChange && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Change Username
            </h2>
            <form onSubmit={handleUsernameUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Username
                </label>
                <input
                  type="text"
                  value={application?.username || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Username
                </label>
                <input
                  type="text"
                  name="newUsername"
                  value={usernameData.newUsername}
                  onChange={handleUsernameChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Enter new username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={usernameData.password}
                  onChange={handleUsernameChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Enter your current password"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                  Change Username
                </button>
                <button
                  type="button"
                  onClick={() => setShowUsernameChange(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
