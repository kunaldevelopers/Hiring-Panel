import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    toast.success("Logged out successfully");
    navigate("/");
  };
  return (
    <nav className="navbar-professional">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {" "}
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://enegixwebsolutions.com/wp-content/uploads/2025/03/ews.png.webp"
                  alt="Enegix Web Solutions"
                  className="w-full h-full object-contain bg-white p-1"
                />
              </div>
              <div>
                <Link
                  to="/"
                  className="text-xl font-bold text-professional hover:text-primary transition-colors duration-200"
                >
                  Enegix Web Solutions
                </Link>
                <p className="text-sm text-textSecondary">Job Portal</p>
              </div>
            </div>
          </div>{" "}
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {" "}
            <Link
              to="/"
              className={`navbar-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-primary text-white shadow-lg hover:bg-blue-700"
                  : "text-white hover:bg-black hover:text-white"
              }`}
            >
              Home
            </Link>{" "}
            <Link
              to="/apply"
              className={`navbar-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/apply"
                  ? "bg-primary text-white shadow-lg hover:bg-blue-700"
                  : "text-white hover:bg-black hover:text-white"
              }`}
            >
              Apply Now
            </Link>
            {!token && (
              <>
                {" "}
                <Link
                  to="/login"
                  className={`navbar-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/login"
                      ? "bg-primary text-white shadow-lg hover:bg-blue-700"
                      : "text-white hover:bg-black hover:text-white"
                  }`}
                >
                  Candidate Login
                </Link>
                <Link
                  to="/admin/login"
                  className={`navbar-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/admin/login"
                      ? "bg-primary text-white shadow-lg hover:bg-blue-700"
                      : "text-white hover:bg-black hover:text-white"
                  }`}
                >
                  Admin Login
                </Link>
              </>
            )}{" "}
            {token && userType === "candidate" && (
              <Link
                to="/profile"
                className={`navbar-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/profile"
                    ? "bg-primary text-white shadow-lg hover:bg-blue-700"
                    : "text-white hover:bg-black hover:text-white"
                }`}
              >
                My Profile
              </Link>
            )}
            {token && userType === "admin" && (
              <Link
                to="/admin"
                className={`navbar-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/admin"
                    ? "bg-primary text-white shadow-lg hover:bg-blue-700"
                    : "text-white hover:bg-black hover:text-white"
                }`}
              >
                Admin Dashboard
              </Link>
            )}
            {token && (
              <button
                onClick={handleLogout}
                className="navbar-link px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-black hover:text-white transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-professional hover:text-primary p-2 rounded-lg hover:bg-professional-surfaceHover transition-all duration-200">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
