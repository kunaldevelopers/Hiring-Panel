import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jobPositionAPI } from "../utils/api";

const JobPositionManager = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPosition, setEditingPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [""],
    totalPositions: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await jobPositionAPI.getAllPositions();
      setPositions(response.data);
    } catch (error) {
      console.error("Fetch positions error:", error);
      toast.error("Failed to load job positions");
    } finally {
      setLoading(false);
    }
  };

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

    // Filter out empty requirements
    const cleanRequirements = formData.requirements.filter(
      (req) => req.trim() !== ""
    );

    if (cleanRequirements.length === 0) {
      toast.error("At least one requirement is needed");
      return;
    }

    const submitData = {
      ...formData,
      requirements: cleanRequirements,
    };
    try {
      if (editingPosition) {
        await jobPositionAPI.updatePosition(editingPosition._id, submitData);
        toast.success("Job position updated successfully");
        setEditingPosition(null);
        setFormData({
          title: "",
          description: "",
          requirements: [""],
          totalPositions: 1,
          isActive: true,
        });
        fetchPositions();
      } else {
        toast.error("This modal is only for editing existing positions");
      }
    } catch (error) {
      console.error("Submit position error:", error);
      toast.error(
        error.response?.data?.message || "Failed to save job position"
      );
    }
  };
  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({
      title: position.title,
      description: position.description,
      requirements:
        position.requirements.length > 0 ? position.requirements : [""],
      totalPositions: position.totalPositions,
      isActive: position.isActive,
    });
    // Modal will open automatically when editingPosition is set
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job position?")) {
      try {
        await jobPositionAPI.deletePosition(id);
        toast.success("Job position deleted successfully");
        fetchPositions();
      } catch (error) {
        console.error("Delete position error:", error);
        toast.error("Failed to delete job position");
      }
    }
  };
  const closeModal = () => {
    setEditingPosition(null);
    setFormData({
      title: "",
      description: "",
      requirements: [""],
      totalPositions: 1,
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Existing Job Positions
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            View, edit, and delete existing job positions. Use the "Add Job
            Role" tab to create new positions.
          </p>
        </div>
      </div>
      {/* Positions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Positions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Filled Positions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>{" "}
          <tbody className="bg-white divide-y divide-gray-200">
            {positions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6m8 0h2m-2 0v8a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                      />
                    </svg>{" "}
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No job positions yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Use the "Add Job Role" tab to create your first job
                      position.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              positions.map((position) => (
                <tr key={position._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {position.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {position.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {position.totalPositions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {position.filledPositions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`font-medium ${
                        position.availablePositions > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {position.availablePositions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        position.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {position.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(position)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(position._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
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
                        </svg>{" "}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>{" "}
      {/* Edit Modal */}
      {editingPosition && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {" "}
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Job Position
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {" "}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900 cursor-not-allowed"
                  placeholder="Position title"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Position title cannot be changed when editing. Use "Add Job
                  Role" tab to create new positions.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>{" "}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Brief description of the position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Positions Available
                </label>{" "}
                <input
                  type="number"
                  name="totalPositions"
                  value={formData.totalPositions}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    {" "}
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="mt-2 px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                >
                  Add Requirement
                </button>
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
                  Active Position
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                {" "}
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Update Position
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPositionManager;
