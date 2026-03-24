// const jwt = require("jsonwebtoken");
// const config = require("../config/env");

// const generateToken = (user) => {
//   return jwt.sign(
//       { id: user._id, role: user.role },
//     config.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// module.exports = generateToken;

const jwt = require("jsonwebtoken");
const config = require("../config/env");

// name bhi payload mein — comment controller mein req.user.name se userName milta hai
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    config.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;