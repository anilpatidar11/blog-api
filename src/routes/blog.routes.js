const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { createBlogRules, updateBlogRules, validate } = require("../validators/blog.validator");

router.get("/", auth, blogController.getAllBlogs);


router.get("/:id", auth, blogController.getBlog);


router.post("/", auth, upload.single("image"), createBlogRules, validate, blogController.createBlog);


router.put("/:id", auth, upload.single("image"), updateBlogRules, validate, blogController.updateBlog);


router.delete("/:id", auth, blogController.deleteBlog);

module.exports = router;
