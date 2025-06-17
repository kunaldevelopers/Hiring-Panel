import React from "react";

const CandidateBiodataModal = ({ candidate, isOpen, onClose }) => {
  if (!isOpen || !candidate) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const downloadDocument = (filename, docType) => {
    if (filename) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000/uploads/${filename}`;
      link.download = `${candidate.name}_${docType}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Candidate Biodata
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Application Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {candidate.name}
                </h3>
                <p className="text-gray-600">Application ID: {candidate._id}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    candidate.status
                  )}`}
                >
                  {candidate.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Applied: {formatDate(candidate.appliedAt)}
                </p>
              </div>
            </div>

            {/* Interview Information */}
            {candidate.status === "Scheduled" && candidate.interviewDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-1">
                  Interview Scheduled
                </h4>
                <div className="text-sm text-blue-800">
                  <p>Date: {formatDate(candidate.interviewDate)}</p>
                  <p>Time: {candidate.interviewTime}</p>
                  {candidate.isInstantInterview && (
                    <p className="font-medium text-red-600">
                      🚨 Instant Interview (1 hour notice)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-gray-900">{candidate.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{candidate.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Department
                  </label>
                  <p className="text-gray-900">
                    {candidate.department === "Other"
                      ? candidate.otherDepartment
                      : candidate.department}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Professional Information
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Experience
                  </label>
                  <p className="text-gray-900">
                    {candidate.experience || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Past Company
                  </label>
                  <p className="text-gray-900">
                    {candidate.pastCompany || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Username
                  </label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {candidate.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Uploaded Documents
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 10th Marksheet */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      10th Marksheet
                    </h5>
                    <p className="text-sm text-gray-500">
                      {candidate.documents.tenthMarksheet
                        ? "✅ Uploaded"
                        : "❌ Not uploaded"}
                    </p>
                  </div>
                  {candidate.documents.tenthMarksheet && (
                    <button
                      onClick={() =>
                        downloadDocument(
                          candidate.documents.tenthMarksheet,
                          "10th_Marksheet"
                        )
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>

              {/* 12th Marksheet */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      12th Marksheet
                    </h5>
                    <p className="text-sm text-gray-500">
                      {candidate.documents.twelfthMarksheet
                        ? "✅ Uploaded"
                        : "❌ Not uploaded"}
                    </p>
                  </div>
                  {candidate.documents.twelfthMarksheet && (
                    <button
                      onClick={() =>
                        downloadDocument(
                          candidate.documents.twelfthMarksheet,
                          "12th_Marksheet"
                        )
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>

              {/* Resume */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">Resume</h5>
                    <p className="text-sm text-gray-500">
                      {candidate.documents.resume
                        ? "✅ Uploaded"
                        : "❌ Not uploaded"}
                    </p>
                  </div>
                  {candidate.documents.resume && (
                    <button
                      onClick={() =>
                        downloadDocument(candidate.documents.resume, "Resume")
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>

              {/* Aadhar Card */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">Aadhar Card</h5>
                    <p className="text-sm text-gray-500">
                      {candidate.documents.aadharCard
                        ? "✅ Uploaded"
                        : "❌ Not uploaded"}
                    </p>
                  </div>
                  {candidate.documents.aadharCard && (
                    <button
                      onClick={() =>
                        downloadDocument(
                          candidate.documents.aadharCard,
                          "Aadhar_Card"
                        )
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateBiodataModal;
