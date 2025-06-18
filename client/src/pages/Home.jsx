import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobPositionAPI } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

const Home = () => {
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
    { name: "calculator", icon: solidIcons.faCalculator, label: "Calculator" },
    { name: "book", icon: solidIcons.faBook, label: "Book" },
    {
      name: "graduation-cap",
      icon: solidIcons.faGraduationCap,
      label: "Education",
    },
    { name: "university", icon: solidIcons.faUniversity, label: "University" },
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

  const [jobPositions, setJobPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const response = await jobPositionAPI.getPositions();
        setJobPositions(response.data);
      } catch (error) {
        console.error("Failed to fetch job positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPositions();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-professional">
      {" "}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                  Now Hiring Across All Departments
                </div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-text leading-tight">
                  Build Your Future with{" "}
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Enegix Web Solutions
                  </span>
                </h1>
                <p className="text-xl text-textSecondary leading-relaxed max-w-2xl">
                  Join our innovative team of web development experts. We create
                  cutting-edge digital solutions and help businesses transform
                  their online presence with modern technology and creative
                  excellence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/apply"
                  className="group btn-primary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Apply Now
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
                </Link>
                <Link
                  to="/login"
                  className="group btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Track Application
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-textSecondary">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-textSecondary">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-textSecondary">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-primary to-accent rounded-3xl p-8 shadow-glow">
                <div className="text-center text-white space-y-6">
                  <div className="w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Start Your Career Journey
                    </h3>
                    <p className="text-lg opacity-90">
                      Join thousands of successful candidates who built their
                      careers with us
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="font-semibold">Remote Work</div>
                      <div className="opacity-80">Available</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="font-semibold">Growth</div>
                      <div className="opacity-80">Unlimited</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Available Positions Section */}
      <div className="py-20 bg-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              Open Positions
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-text">
              Available Departments
            </h2>
            <p className="text-xl text-textSecondary max-w-3xl mx-auto">
              We're hiring across multiple departments. Find the perfect role
              for your skills and interests in our growing team.
            </p>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="card-surface rounded-2xl p-8 animate-pulse"
                >
                  <div className="h-12 w-12 bg-gray-300 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))
            ) : jobPositions.length > 0 ? (
              jobPositions.map((position) => {
                // Fallback FontAwesome icon names for existing positions without stored icons
                const fallbackIconMap = {
                  "Cyber Security": "shield-alt",
                  "Web Dev": "globe",
                  "App Dev": "mobile-alt",
                  "Full Stack": "bolt",
                  "Digital Marketing": "chart-line",
                  "AI & Automation": "robot",
                  "Sales Executive": "dollar-sign",
                  "Wild Life": "leaf",
                  ui: "palette",
                  Other: "briefcase",
                };

                const gradientMap = {
                  "Cyber Security": "from-red-500/20 to-orange-500/20",
                  "Web Dev": "from-blue-500/20 to-cyan-500/20",
                  "App Dev": "from-green-500/20 to-emerald-500/20",
                  "Full Stack": "from-purple-500/20 to-violet-500/20",
                  "Digital Marketing": "from-pink-500/20 to-rose-500/20",
                  "AI & Automation": "from-indigo-500/20 to-blue-500/20",
                  "Sales Executive": "from-yellow-500/20 to-amber-500/20",
                  "Wild Life": "from-green-600/20 to-emerald-600/20",
                  ui: "from-purple-600/20 to-indigo-600/20",
                  Other: "from-gray-500/20 to-slate-500/20",
                };

                const iconBgMap = {
                  "Cyber Security": "bg-red-500/10 text-red-400",
                  "Web Dev": "bg-blue-500/10 text-blue-400",
                  "App Dev": "bg-green-500/10 text-green-400",
                  "Full Stack": "bg-purple-500/10 text-purple-400",
                  "Digital Marketing": "bg-pink-500/10 text-pink-400",
                  "AI & Automation": "bg-indigo-500/10 text-indigo-400",
                  "Sales Executive": "bg-yellow-500/10 text-yellow-400",
                  "Wild Life": "bg-green-600/10 text-green-400",
                  ui: "bg-purple-600/10 text-purple-400",
                  Other: "bg-gray-500/10 text-gray-400",
                }; // Use stored icon if available, otherwise use fallback based on title, otherwise default
                const iconName =
                  position.icon ||
                  fallbackIconMap[position.title] ||
                  fallbackIconMap["Other"];
                const iconObj = predefinedIcons.find(
                  (icon) => icon.name === iconName
                );
                const displayIcon = iconObj?.icon || solidIcons.faBriefcase;

                return (
                  <div
                    key={position._id}
                    className={`group card-surface rounded-2xl p-8 hover-lift cursor-pointer transition-all duration-300 bg-gradient-to-br ${
                      gradientMap[position.title] || gradientMap["Other"]
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${
                        iconBgMap[position.title] || iconBgMap["Other"]
                      } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <FontAwesomeIcon
                        icon={displayIcon}
                        className="text-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-text group-hover:text-primary transition-colors duration-300">
                          {position.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              position.availablePositions > 0
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {position.availablePositions > 0
                              ? `${position.availablePositions} available`
                              : "Full"}
                          </span>
                        </div>
                      </div>
                      <p className="text-textSecondary leading-relaxed">
                        {position.description}
                      </p>
                      {position.requirements.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-text">
                            Key Requirements:
                          </h4>
                          <ul className="text-sm text-textSecondary space-y-1">
                            {position.requirements
                              .slice(0, 2)
                              .map((req, reqIndex) => (
                                <li key={reqIndex} className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  {req}
                                </li>
                              ))}
                            {position.requirements.length > 2 && (
                              <li className="text-primary text-xs">
                                +{position.requirements.length - 2} more
                                requirements
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      <div className="pt-4 border-t border-border">
                        <Link
                          to="/apply"
                          className="inline-flex items-center text-primary hover:text-accent font-medium text-sm group-hover:translate-x-1 transition-all duration-300"
                        >
                          Apply Now
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // No positions available
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  No Positions Available
                </h3>
                <p className="text-textSecondary">
                  Check back later for new opportunities!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Ready to join our team?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Take the first step towards an exciting career with our
                innovative company. Your journey to success starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apply"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Application
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
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Check Status
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
