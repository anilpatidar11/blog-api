const commentService = require("../services/comment.service");

exports.addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(
      req.params.blogId,
      req.user.id,
      req.user.name,
      req.body.text
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Comment added successfully",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByBlog = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByBlog(req.params.blogId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      results: comments.length,
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(
      req.params.commentId,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
