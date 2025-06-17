import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { applicationAPI, authAPI } from "../utils/api";

const CandidateProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [application, setApplication] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showUsernameChange, setShowUsernameChange] = useState(false);
  const [updateData, setUpdateData] = useState({
    experience: "",
    pastCompany: "",
    tenthMarksheet: null,
    twelfthMarksheet: null,
    resume: null,
    aadharCard: null,
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
        experience: response.data.experience || "",
        pastCompany: response.data.pastCompany || "",
        tenthMarksheet: null,
        twelfthMarksheet: null,
        resume: null,
        aadharCard: null,
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

    try {
      const formData = new FormData();
      formData.append("experience", updateData.experience);
      formData.append("pastCompany", updateData.pastCompany);
      if (updateData.tenthMarksheet) {
        formData.append("tenthMarksheet", updateData.tenthMarksheet);
      }
      if (updateData.twelfthMarksheet) {
        formData.append("twelfthMarksheet", updateData.twelfthMarksheet);
      }
      if (updateData.resume) {
        formData.append("resume", updateData.resume);
      }
      if (updateData.aadharCard) {
        formData.append("aadharCard", updateData.aadharCard);
      }

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

    if (!usernameData.newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (usernameData.newUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (!usernameData.password) {
      toast.error("Password is required to change username");
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

      // Refresh profile to show updated username
      fetchProfile();
    } catch (error) {
      console.error("Change username error:", error);
      toast.error(error.response?.data?.message || "Failed to change username");
    }
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
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-gray-900">{application.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{application.email}</p>
            </div>{" "}
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{application.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <div className="flex items-center space-x-2">
                <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                  {application.username}
                </p>
                <button
                  onClick={() => setShowUsernameChange(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change
                </button>
              </div>
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
        </div>

        {/* Update Profile Form */}
        {showUpdateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Update Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>{" "}
                <textarea
                  name="experience"
                  value={updateData.experience}
                  onChange={handleUpdateChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Previous company name"
                />
              </div>{" "}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  10th Marksheet (PDF/JPG) -{" "}
                  {application.documents.tenthMarksheet
                    ? "Currently uploaded"
                    : "Not uploaded"}
                </label>
                <input
                  type="file"
                  name="tenthMarksheet"
                  onChange={handleUpdateChange}
                  accept=".pdf,.jpg,.jpeg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  12th Marksheet (PDF/JPG) -{" "}
                  {application.documents.twelfthMarksheet
                    ? "Currently uploaded"
                    : "Not uploaded"}
                </label>
                <input
                  type="file"
                  name="twelfthMarksheet"
                  onChange={handleUpdateChange}
                  accept=".pdf,.jpg,.jpeg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF/JPG) -{" "}
                  {application.documents.resume
                    ? "Currently uploaded"
                    : "Not uploaded"}
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleUpdateChange}
                  accept=".pdf,.jpg,.jpeg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card (PDF/JPG) -{" "}
                  {application.documents.aadharCard
                    ? "Currently uploaded"
                    : "Not uploaded"}
                </label>
                <input
                  type="file"
                  name="aadharCard"
                  onChange={handleUpdateChange}
                  accept=".pdf,.jpg,.jpeg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-300"
                >
                  {updating ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Current Username:</strong> {application?.username}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Choose a unique username that will be used for future
                      logins.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Username
                </label>{" "}
                <input
                  type="text"
                  name="newUsername"
                  value={usernameData.newUsername}
                  onChange={handleUsernameChange}
                  required
                  minLength="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter your new username"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username must be at least 3 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password (for verification)
                </label>{" "}
                <input
                  type="password"
                  name="password"
                  value={usernameData.password}
                  onChange={handleUsernameChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter your current password"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Change Username
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUsernameChange(false);
                    setUsernameData({
                      newUsername: "",
                      password: "",
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
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
              {" "}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
      </div>
    </div>
  );
};

export default CandidateProfile;
