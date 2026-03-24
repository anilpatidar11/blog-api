const express = require("express");
const router = express.Router({ mergeParams: true }); 
const commentController = require("../controllers/comment.controller");
const auth = require("../middlewares/auth.middleware");
const { commentRules, validate } = require("../validators/comment.validator");


router.get("/", auth, commentController.getCommentsByBlog);
router.post("/", auth, commentRules, validate, commentController.addComment);
router.delete("/:commentId", auth, commentController.deleteComment);

module.exports = router;
