const express = require("express");
const router = express.Router({ mergeParams: true }); 
const likeController = require("../controllers/like.controller");
const auth = require("../middlewares/auth.middleware");


router.get("/", auth, likeController.getLikesByBlog);
router.post("/", auth, likeController.toggleLike);

module.exports = router;
