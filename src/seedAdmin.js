const config = require("./config/env");
const connectDB = require("./config/db");
const User = require("./models/user.model");
const { hashPassword } = require("./utils/hashPassword");

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = config.ADMIN_EMAIL;
    const adminPassword = config.ADMIN_PASSWORD;
    const adminName = config.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.error("ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME .env mein set karo");
      process.exit(1);
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

      console.log("Admin created:", admin.email);
    } else {
      console.log("Admin already exists:", adminEmail);
    }

    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();

