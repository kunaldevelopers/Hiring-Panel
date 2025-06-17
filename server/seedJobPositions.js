const mongoose = require("mongoose");
const JobPosition = require("./models/JobPosition");
require("dotenv").config();

const seedJobPositions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/job-portal"
    );
    console.log("Connected to MongoDB");

    // Clear existing positions
    await JobPosition.deleteMany({});

    // Default job positions for Enegix Web Solutions
    const positions = [
      {
        title: "Full Stack",
        description:
          "Full-stack developers to build end-to-end web applications using modern technologies like React, Node.js, and MongoDB.",
        requirements: [
          "3+ years of experience in full-stack development",
          "Proficiency in React.js, Node.js, and MongoDB",
          "Experience with RESTful APIs and database design",
          "Knowledge of version control (Git)",
          "Strong problem-solving skills",
        ],
        totalPositions: 5,
      },
      {
        title: "Web Dev",
        description:
          "Frontend web developers specializing in creating responsive and interactive user interfaces.",
        requirements: [
          "2+ years of experience in frontend development",
          "Expert knowledge of HTML5, CSS3, and JavaScript",
          "Experience with React.js or similar frameworks",
          "Understanding of responsive design principles",
          "Portfolio showcasing previous web projects",
        ],
        totalPositions: 8,
      },
      {
        title: "Digital Marketing",
        description:
          "Digital marketing specialists to drive online growth and enhance our digital presence.",
        requirements: [
          "2+ years of digital marketing experience",
          "Knowledge of SEO, SEM, and social media marketing",
          "Experience with Google Analytics and marketing tools",
          "Content creation and copywriting skills",
          "Understanding of web technologies",
        ],
        totalPositions: 3,
      },
      {
        title: "App Dev",
        description:
          "Mobile app developers to create innovative iOS and Android applications.",
        requirements: [
          "3+ years of mobile app development experience",
          "Proficiency in React Native or Flutter",
          "Experience with iOS and Android development",
          "Knowledge of mobile UI/UX best practices",
          "Published apps in App Store or Google Play",
        ],
        totalPositions: 4,
      },
      {
        title: "Cyber Security",
        description:
          "Cybersecurity experts to protect our digital infrastructure and client data.",
        requirements: [
          "4+ years of cybersecurity experience",
          "Knowledge of security frameworks and compliance",
          "Experience with penetration testing and vulnerability assessment",
          "Certifications like CISSP, CEH, or similar",
          "Understanding of web application security",
        ],
        totalPositions: 2,
      },
      {
        title: "AI & Automation",
        description:
          "AI specialists to develop intelligent automation solutions and machine learning applications.",
        requirements: [
          "3+ years of AI/ML development experience",
          "Proficiency in Python, TensorFlow, or PyTorch",
          "Experience with automation tools and frameworks",
          "Knowledge of data analysis and algorithms",
          "Portfolio of AI/ML projects",
        ],
        totalPositions: 3,
      },
      {
        title: "Sales Executive",
        description:
          "Dynamic sales professionals to expand our client base and drive business growth.",
        requirements: [
          "2+ years of B2B sales experience",
          "Excellent communication and presentation skills",
          "Understanding of web development and digital services",
          "Proven track record of meeting sales targets",
          "Strong networking and relationship-building abilities",
        ],
        totalPositions: 6,
      },
    ];

    // Insert positions
    await JobPosition.insertMany(positions);
    console.log("Job positions seeded successfully!");
    console.log(`Created ${positions.length} job positions`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding job positions:", error);
    process.exit(1);
  }
};

seedJobPositions();
