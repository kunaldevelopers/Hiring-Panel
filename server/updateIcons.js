const mongoose = require("mongoose");
const JobPosition = require("./models/JobPosition");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/job-portal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateIconsToFontAwesome() {
  try {
    console.log("Starting icon update process...");

    // Get all job positions
    const positions = await JobPosition.find();
    console.log(`Found ${positions.length} job positions`);

    // Mapping from emoji icons to FontAwesome icon names
    const emojiToFontAwesome = {
      "🔒": "shield-alt",
      "🌐": "globe",
      "📱": "mobile-alt",
      "⚡": "bolt",
      "📊": "chart-line",
      "🤖": "robot",
      "💰": "dollar-sign",
      "💡": "lightbulb",
      "💼": "briefcase",
      "👨‍💻": "code",
      "🎨": "palette",
      "📸": "camera",
      "🎬": "film",
      "✏️": "pen",
      "🎯": "bullseye",
      "🔧": "wrench",
      "🦌": "leaf", // Wildlife -> Nature
    };

    let updateCount = 0;

    for (const position of positions) {
      console.log(
        `Checking position: ${position.title}, current icon: "${position.icon}"`
      );

      // If the icon is an emoji, convert it to FontAwesome
      if (position.icon && emojiToFontAwesome[position.icon]) {
        const newIcon = emojiToFontAwesome[position.icon];
        console.log(`  Updating "${position.icon}" to "${newIcon}"`);

        await JobPosition.updateOne({ _id: position._id }, { icon: newIcon });
        updateCount++;
      } else if (!position.icon || position.icon.trim() === "") {
        // Set default icon for positions without icons
        console.log(
          `  Setting default icon "briefcase" for position without icon`
        );

        await JobPosition.updateOne(
          { _id: position._id },
          { icon: "briefcase" }
        );
        updateCount++;
      } else {
        console.log(
          `  Icon "${position.icon}" is already FontAwesome format, no update needed`
        );
      }
    }

    console.log(`\nIcon update complete! Updated ${updateCount} positions.`);

    // Verify the updates
    console.log("\nVerifying updates...");
    const updatedPositions = await JobPosition.find();
    updatedPositions.forEach((pos) => {
      console.log(`${pos.title}: "${pos.icon}"`);
    });
  } catch (error) {
    console.error("Error updating icons:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

updateIconsToFontAwesome();
