const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  registerRules, loginRules, updateRules,
  forgotPasswordRules, resetPasswordRules,
  validate,
} = require("../validators/user.validator");


router.post("/register", registerRules, validate, userController.register);
router.get("/verify-email", userController.verifyEmail);    
router.post("/login", loginRules, validate, userController.login);
router.post("/forgot-password", forgotPasswordRules, validate, userController.forgotPassword);
router.post("/reset-password", resetPasswordRules, validate, userController.resetPassword); 

router.post(
  "/upload-profile-pic",
  auth,
  upload.single("image"),
  userController.uploadProfilePic
);

//Protected Routes 
router.get("/", auth, role("admin"), userController.getUsers);
router.get("/:id", auth, role("admin", "user"), userController.getUser);
router.put("/:id", auth, updateRules, validate, role("admin", "user"), userController.updateUser);
router.delete("/:id", auth, role("admin"), userController.deleteUser);

module.exports = router;