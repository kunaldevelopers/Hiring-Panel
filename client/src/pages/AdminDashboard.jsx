import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { adminAPI, authAPI, jobPositionAPI } from "../utils/api";
import CandidateBiodataModal from "../components/CandidateBiodataModal";
import JobPositionManager from "../components/JobPositionManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("applications");
  const [scheduleData, setScheduleData] = useState({
    interviewDate: "",
    interviewTime: "",
    immediate: false,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    const loadData = async () => {
      await fetchApplications();
      await fetchStats();
    };
    loadData();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApplications = async () => {
    try {
      const response = await adminAPI.getApplications(filters);
      setApplications(response.data.applications);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Fetch applications error:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await adminAPI.updateStatus(applicationId, newStatus);
      toast.success("Status updated successfully");
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.scheduleInterview(selectedApplication._id, scheduleData);
      toast.success("Interview scheduled successfully");
      setShowScheduleModal(false);
      setSelectedApplication(null);
      setScheduleData({
        interviewDate: "",
        interviewTime: "",
        immediate: false,
      });
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Schedule interview error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to schedule interview";
      toast.error(errorMessage);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await adminAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Export CSV error:", error);
      toast.error("Failed to export CSV");
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
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1, // Only reset to page 1 for non-pagination changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleViewBiodata = (application) => {
    setSelectedApplication(application);
    setShowBiodataModal(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      await authAPI.changeAdminPassword({
        username: localStorage.getItem("username"),
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");
      setShowPasswordModal(false);
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

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplications(applications.map((app) => app._id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications((prev) => {
      if (prev.includes(applicationId)) {
        return prev.filter((id) => id !== applicationId);
      } else {
        return [...prev, applicationId];
      }
    });
  };

  // Delete handlers
  const handleDeleteApplication = (application) => {
    setApplicationToDelete(application);
    setShowDeleteModal(true);
  };

  const confirmDeleteApplication = async () => {
    try {
      await adminAPI.deleteApplication(applicationToDelete._id);
      toast.success(
        `Application for "${applicationToDelete.name}" deleted successfully`
      );
      setShowDeleteModal(false);
      setApplicationToDelete(null);
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Delete application error:", error);
      toast.error("Failed to delete application");
    }
  };

  const handleBulkDelete = () => {
    if (selectedApplications.length === 0) {
      toast.error("Please select applications to delete");
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const response = await adminAPI.bulkDeleteApplications(
        selectedApplications
      );
      toast.success(response.data.message);
      setShowBulkDeleteModal(false);
      setSelectedApplications([]);
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete applications");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setApplicationToDelete(null);
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteModal(false);
  };

  const AddJobRoleForm = () => {
    // Predefined list of 50 FontAwesome icons
    const predefinedIcons = [
      { name: "briefcase", icon: solidIcons.faBriefcase, label: "Briefcase" },
      { name: "code", icon: solidIcons.faCode, label: "Code" },
      { name: "desktop", icon: solidIcons.faDesktop, label: "Desktop" },
      { name: "mobile-alt", icon: solidIcons.faMobileAlt, label: "Mobile" },
      { name: "globe", icon: solidIcons.faGlobe, label: "Globe" },
      { name: "chart-line", icon: solidIcons.faChartLine, label: "Chart" },
      { name: "shield-alt", icon: solidIcons.faShieldAlt, label: "Shield" },
      { name: "robot", icon: solidIcons.faRobot, label: "Robot" },
      { name: "bolt", icon: solidIcons.faBolt, label: "Bolt" },
      { name: "lightbulb", icon: solidIcons.faLightbulb, label: "Lightbulb" },
      { name: "camera", icon: solidIcons.faCamera, label: "Camera" },
      { name: "video", icon: solidIcons.faVideo, label: "Video" },
      { name: "pen", icon: solidIcons.faPen, label: "Pen" },
      { name: "bullseye", icon: solidIcons.faBullseye, label: "Target" },
      { name: "dollar-sign", icon: solidIcons.faDollarSign, label: "Dollar" },
      { name: "wrench", icon: solidIcons.faWrench, label: "Wrench" },
      { name: "heart", icon: solidIcons.faHeart, label: "Heart" },
      { name: "users", icon: solidIcons.faUsers, label: "Users" },
      { name: "cog", icon: solidIcons.faCog, label: "Settings" },
      { name: "search", icon: solidIcons.faSearch, label: "Search" },
      { name: "envelope", icon: solidIcons.faEnvelope, label: "Mail" },
      { name: "phone", icon: solidIcons.faPhone, label: "Phone" },
      { name: "print", icon: solidIcons.faPrint, label: "Print" },
      { name: "file-alt", icon: solidIcons.faFileAlt, label: "File" },
      { name: "home", icon: solidIcons.faHome, label: "Home" },
      { name: "car", icon: solidIcons.faCar, label: "Car" },
      { name: "plane", icon: solidIcons.faPlane, label: "Plane" },
      { name: "ship", icon: solidIcons.faShip, label: "Ship" },
      { name: "truck", icon: solidIcons.faTruck, label: "Truck" },
      { name: "gamepad", icon: solidIcons.faGamepad, label: "Gaming" },
      { name: "music", icon: solidIcons.faMusic, label: "Music" },
      { name: "film", icon: solidIcons.faFilm, label: "Film" },
      { name: "palette", icon: solidIcons.faPalette, label: "Art" },
      { name: "magic", icon: solidIcons.faMagic, label: "Magic" },
      { name: "flask", icon: solidIcons.faFlask, label: "Science" },
      { name: "microscope", icon: solidIcons.faMicroscope, label: "Research" },
      {
        name: "calculator",
        icon: solidIcons.faCalculator,
        label: "Calculator",
      },
      { name: "book", icon: solidIcons.faBook, label: "Book" },
      {
        name: "graduation-cap",
        icon: solidIcons.faGraduationCap,
        label: "Education",
      },
      {
        name: "university",
        icon: solidIcons.faUniversity,
        label: "University",
      },
      { name: "hospital", icon: solidIcons.faHospital, label: "Hospital" },
      { name: "pills", icon: solidIcons.faPills, label: "Medicine" },
      { name: "stethoscope", icon: solidIcons.faStethoscope, label: "Medical" },
      { name: "user-md", icon: solidIcons.faUserMd, label: "Doctor" },
      { name: "building", icon: solidIcons.faBuilding, label: "Building" },
      { name: "industry", icon: solidIcons.faIndustry, label: "Industry" },
      { name: "leaf", icon: solidIcons.faLeaf, label: "Nature" },
      { name: "recycle", icon: solidIcons.faRecycle, label: "Recycle" },
      { name: "coffee", icon: solidIcons.faCoffee, label: "Coffee" },
      { name: "store", icon: solidIcons.faStore, label: "Store" },
    ];

    const [formData, setFormData] = useState({
      title: "",
      description: "",
      icon: "briefcase", // Default FontAwesome icon name
      requirements: [""],
      totalPositions: 1,
      isActive: true,
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleRequirementChange = (index, value) => {
      const newRequirements = [...formData.requirements];
      newRequirements[index] = value;
      setFormData((prev) => ({
        ...prev,
        requirements: newRequirements,
      }));
    };

    const addRequirement = () => {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, ""],
      }));
    };

    const removeRequirement = (index) => {
      if (formData.requirements.length > 1) {
        const newRequirements = formData.requirements.filter(
          (_, i) => i !== index
        );
        setFormData((prev) => ({
          ...prev,
          requirements: newRequirements,
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      // Filter out empty requirements
      const cleanRequirements = formData.requirements.filter(
        (req) => req.trim() !== ""
      );

      if (cleanRequirements.length === 0) {
        toast.error("At least one requirement is needed");
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        requirements: cleanRequirements,
      };

      try {
        await jobPositionAPI.createPosition(submitData);
        toast.success("Job role created successfully!"); // Reset form
        setFormData({
          title: "",
          description: "",
          icon: "briefcase",
          requirements: [""],
          totalPositions: 1,
          isActive: true,
        });
      } catch (error) {
        console.error("Create job role error:", error);
        toast.error(
          error.response?.data?.message || "Failed to create job role"
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Job Role
              </h2>
              <p className="text-gray-600">
                Add a custom job position that candidates can apply for
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Role Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Video Editor, Content Writer, UI/UX Designer, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter any custom job role title. You can create roles like
                "Photographer", "Video Editor", "Content Writer", etc.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Describe the role, responsibilities, and expectations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Positions Available{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalPositions"
                value={formData.totalPositions}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements <span className="text-red-500">*</span>
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) =>
                      handleRequirementChange(index, e.target.value)
                    }
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="mt-2 px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition duration-200"
              >
                Add Another Requirement
              </button>
            </div>{" "}
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Icon <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <FontAwesomeIcon
                      icon={
                        predefinedIcons.find(
                          (iconObj) => iconObj.name === formData.icon
                        )?.icon || solidIcons.faBriefcase
                      }
                      className="text-xl text-gray-600"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">
                      Selected:{" "}
                      {predefinedIcons.find(
                        (iconObj) => iconObj.name === formData.icon
                      )?.label || "Briefcase"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-10 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {predefinedIcons.map((iconObj) => (
                    <button
                      key={iconObj.name}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: iconObj.name }))
                      }
                      className={`w-10 h-10 rounded-lg border-2 hover:bg-gray-50 transition-colors flex items-center justify-center ${
                        formData.icon === iconObj.name
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                      title={iconObj.label}
                    >
                      <FontAwesomeIcon
                        icon={iconObj.icon}
                        className="text-lg text-gray-600"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Select an icon from the collection above. Icons are organized
                  for easy browsing.
                </p>
              </div>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Make this position active immediately
                </span>
              </label>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-300 font-medium"
              >
                {loading ? "Creating..." : "Create Job Role"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    icon: "briefcase",
                    requirements: [""],
                    totalPositions: 1,
                    isActive: true,
                  });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300 font-medium"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage job applications</p>
            </div>{" "}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
              >
                Change Password
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>{" "}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("applications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "applications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Applications Management
              </button>
              <button
                onClick={() => setActiveTab("positions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "positions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Job Positions
              </button>
              <button
                onClick={() => setActiveTab("addRole")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "addRole"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Add Job Role
              </button>
            </nav>
          </div>
        </div>
        {/* Tab Content */}
        {activeTab === "applications" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Total</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Accepted</h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.accepted || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rejected || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900">Scheduled</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.scheduled || 0}
                </p>
              </div>
            </div>
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Filter
                  </label>{" "}
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>{" "}
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search by name, email, or phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Page
                  </label>{" "}
                  <select
                    value={filters.limit}
                    onChange={(e) =>
                      handleFilterChange("limit", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>{" "}
            {/* Bulk Actions */}
            {selectedApplications.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">
                    {selectedApplications.length} application(s) selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>
            )}
            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={
                            selectedApplications.length ===
                              applications.length && applications.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>{" "}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(
                              application._id
                            )}
                            onChange={() =>
                              handleSelectApplication(application._id)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.department === "Other"
                            ? application.otherDepartment
                            : application.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                          {application.status === "Scheduled" &&
                            application.interviewDate && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  application.interviewDate
                                ).toLocaleDateString()}{" "}
                                at {application.interviewTime}
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </td>{" "}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {" "}
                            <select
                              value={application.status}
                              onChange={(e) =>
                                handleStatusUpdate(
                                  application._id,
                                  e.target.value
                                )
                              }
                              className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-900"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Scheduled">Scheduled</option>
                            </select>{" "}
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                // Set default values for tomorrow at 10:00 AM
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const tomorrowDate = tomorrow
                                  .toISOString()
                                  .split("T")[0];
                                setScheduleData({
                                  interviewDate: tomorrowDate,
                                  interviewTime: "10:00",
                                  immediate: false,
                                });
                                setShowScheduleModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 text-xs"
                            >
                              Schedule
                            </button>
                            <button
                              onClick={() => handleViewBiodata(application)}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              View Biodata
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteApplication(application)
                              }
                              className="text-red-600 hover:text-red-900 text-xs"
                              title="Delete Application"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>{" "}
              {/* Pagination */}
              {pagination.total > 1 && (
                <div className="card-surface px-6 py-4 flex items-center justify-between border-t border-gray-700/20">
                  <div className="text-sm text-textSecondary">
                    Showing page {pagination.current} of {pagination.total} (
                    {pagination.count} total applications)
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, filters.page - 1))
                      }
                      disabled={filters.page === 1}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                        ${
                          filters.page === 1
                            ? "border-gray-600 text-gray-500 cursor-not-allowed bg-gray-800/50"
                            : "border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 bg-transparent"
                        }
                      `}
                    >
                      ← Previous
                    </button>{" "}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-textSecondary">Page</span>
                      <input
                        type="number"
                        min="1"
                        max={pagination.total}
                        value={pagination.current}
                        onChange={(e) => {
                          const newPage = parseInt(e.target.value);
                          if (newPage >= 1 && newPage <= pagination.total) {
                            handlePageChange(newPage);
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm text-center text-gray-900 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-sm text-textSecondary">
                        of {pagination.total}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.min(pagination.total, filters.page + 1)
                        )
                      }
                      disabled={filters.page === pagination.total}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                        ${
                          filters.page === pagination.total
                            ? "border-gray-600 text-gray-500 cursor-not-allowed bg-gray-800/50"
                            : "border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 bg-transparent"
                        }
                      `}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}{" "}
        {/* Job Positions Tab */}
        {activeTab === "positions" && <JobPositionManager />}
        {/* Add Job Role Tab */}
        {activeTab === "addRole" && <AddJobRoleForm />}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Schedule Interview for {selectedApplication?.name}
            </h3>

            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scheduleData.immediate}
                    onChange={(e) =>
                      setScheduleData((prev) => ({
                        ...prev,
                        immediate: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  Schedule for instant interview (within 1 hour)
                </label>
              </div>

              {!scheduleData.immediate && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Date
                    </label>{" "}
                    <input
                      type="date"
                      value={scheduleData.interviewDate}
                      min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                      onChange={(e) =>
                        setScheduleData((prev) => ({
                          ...prev,
                          interviewDate: e.target.value,
                        }))
                      }
                      required={!scheduleData.immediate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Time
                    </label>{" "}
                    <input
                      type="time"
                      value={scheduleData.interviewTime}
                      onChange={(e) =>
                        setScheduleData((prev) => ({
                          ...prev,
                          interviewTime: e.target.value,
                        }))
                      }
                      required={!scheduleData.immediate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Schedule Interview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedApplication(null);
                    setScheduleData({
                      interviewDate: "",
                      interviewTime: "",
                      immediate: false,
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Biodata Modal */}
      <CandidateBiodataModal
        candidate={selectedApplication}
        isOpen={showBiodataModal}
        onClose={() => {
          setShowBiodataModal(false);
          setSelectedApplication(null);
        }}
      />

      {/* Admin Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Change Admin Password
            </h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>{" "}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && applicationToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Application
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete the application for{" "}
                <strong>{applicationToDelete.name}</strong>? This action cannot
                be undone and will also prevent the candidate from logging in.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmDeleteApplication}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Multiple Applications
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedApplications.length}</strong> selected
                application(s)? This action cannot be undone and will also
                prevent the candidates from logging in.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmBulkDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete All
                </button>
                <button
                  onClick={cancelBulkDelete}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
