const mongoose = require("mongoose");
const JobPosition = require("./models/JobPosition");

// Update existing job positions with color schemes
async function updateExistingPositionsWithColors() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/job-portal", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Define color mapping for existing positions
    const legacyColorMap = {
      "Cyber Security": "red",
      "Web Dev": "blue",
      "App Dev": "green",
      "Full Stack": "purple",
      "Digital Marketing": "pink",
      "AI & Automation": "indigo",
      "Sales Executive": "yellow",
      "Wild Life": "emerald",
      ui: "violet",
      "Data Science": "cyan",
      DevOps: "orange",
      "QA Testing": "teal",
      "UI/UX Design": "rose",
      "Business Analyst": "amber",
      "Project Manager": "lime",
    };

    // Available color schemes for new positions
    const colorSchemes = [
      "red",
      "blue",
      "green",
      "purple",
      "pink",
      "indigo",
      "yellow",
      "emerald",
      "cyan",
      "orange",
      "teal",
      "rose",
      "violet",
      "amber",
      "lime",
    ];

    // Get all positions without colorScheme
    const positions = await JobPosition.find({
      $or: [
        { colorScheme: { $exists: false } },
        { colorScheme: null },
        { colorScheme: "" },
      ],
    });

    console.log(`Found ${positions.length} positions to update`);

    for (const position of positions) {
      let colorScheme = legacyColorMap[position.title];

      // If no predefined color for this title, assign a random one
      if (!colorScheme) {
        colorScheme =
          colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      }

      await JobPosition.findByIdAndUpdate(position._id, {
        colorScheme: colorScheme,
      });

      console.log(
        `Updated ${position.title} with color scheme: ${colorScheme}`
      );
    }

    console.log("✅ Successfully updated all job positions with color schemes");
  } catch (error) {
    console.error("❌ Error updating positions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the update
updateExistingPositionsWithColors();
