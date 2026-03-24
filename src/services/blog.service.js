const Blog = require("../models/blog.model");
const Like = require("../models/like.model");
const Comment = require("../models/comment.model");
const AppError = require("../errors/AppError");

exports.createBlog = async (data, authorId) => {
  const blog = await Blog.create({ ...data, author: authorId });
  await blog.populate("author", "name profilePic");
  return blog;
};

exports.getAllBlogs = async () => {
  const blogs = await Blog.find()
    .populate("author", "name profilePic")
    .sort({ createdAt: -1 });

  return blogs;
};

exports.getBlogById = async (id) => {
  const blog = await Blog.findById(id).populate("author", "name profilePic");
  if (!blog) throw new AppError("Blog not found", 404);
  return blog;
};

exports.updateBlog = async (blogId, userId, userRole, data) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError("Blog not found", 404);

 
  if (blog.author.toString() !== userId && userRole !== "admin") {
    throw new AppError("Not authorized to update this blog", 403);
  }

  const allowedFields = ["title", "content", "image"];
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) filteredData[field] = data[field];
  });

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, filteredData, {
    new: true,
    runValidators: true,
  }).populate("author", "name profilePic");

  return updatedBlog;
};

exports.deleteBlog = async (blogId, userId, userRole) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new AppError("Blog not found", 404);


  if (blog.author.toString() !== userId && userRole !== "admin") {
    throw new AppError("Not authorized to delete this blog", 403);
  }

  await Promise.all([
    Blog.findByIdAndDelete(blogId),
    Like.deleteMany({ blog: blogId }),
    Comment.deleteMany({ blog: blogId }),
  ]);
};
