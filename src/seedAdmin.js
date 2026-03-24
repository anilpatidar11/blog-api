const config = require("./config/env");
const User = require("./models/user.model");
const { hashPassword } = require("./utils/hashPassword");

const seedAdmin = async () => {
  try {
    const adminEmail = config.ADMIN_EMAIL;
    const adminPassword = config.ADMIN_PASSWORD;
    const adminName = config.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.log("Admin env not set, skipping seed...");
      return;
    }

    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: await hashPassword(adminPassword),
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Admin created:", admin.email);
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};

module.exports = seedAdmin;