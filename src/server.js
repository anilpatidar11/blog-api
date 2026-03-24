const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/env");

connectDB();

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});