const likeService = require("../services/like.service");

exports.toggleLike = async (req, res, next) => {
  try {
    const result = await likeService.toggleLike(req.params.blogId, req.user.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.liked ? "Blog liked" : "Blog unliked",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLikesByBlog = async (req, res, next) => {
  try {
    const result = await likeService.getLikesByBlog(req.params.blogId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
