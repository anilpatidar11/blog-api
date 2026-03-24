const Comment = require("../models/comment.model");
const Blog = require("../models/blog.model");
const AppError = require("../errors/AppError");

exports.addComment = async (blogId, userId, userName, text) => {

  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError("Blog not found", 404);

  const comment = await Comment.create({
    blog: blogId,
    user: userId,
    userName,
    text,
  });

  return comment;
};

exports.getCommentsByBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError("Blog not found", 404);

  const comments = await Comment.find({ blog: blogId })
    .populate("user", "name profilePic")
    .sort({ createdAt: -1 });

  return comments;
};

exports.deleteComment = async (commentId, userId, userRole) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError("Comment not found", 404);


  if (comment.user.toString() !== userId && userRole !== "admin") {
    throw new AppError("Not authorized to delete this comment", 403);
  }

  await Comment.findByIdAndDelete(commentId);
};
