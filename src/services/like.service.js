const Like = require("../models/like.model");
const Blog = require("../models/blog.model");
const AppError = require("../errors/AppError");

exports.toggleLike = async (blogId, userId) => {

  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError("Blog not found", 404);

  const existingLike = await Like.findOne({ blog: blogId, user: userId });

  if (existingLike) {

    await Like.findByIdAndDelete(existingLike._id);
    const likeCount = await Like.countDocuments({ blog: blogId });
    return { liked: false, likeCount };
  } else {
 
    await Like.create({ blog: blogId, user: userId });
    const likeCount = await Like.countDocuments({ blog: blogId });
    return { liked: true, likeCount };
  }
};

exports.getLikesByBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError("Blog not found", 404);

  const likeCount = await Like.countDocuments({ blog: blogId });
  return { blogId, likeCount };
};
