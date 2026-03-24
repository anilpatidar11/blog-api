const blogService = require("../services/blog.service");
const cloudinary = require("../config/cloudinary");
const AppError = require("../errors/AppError");

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

exports.createBlog = async (req, res, next) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const blogData = {
      title: req.body.title,
      content: req.body.content,
      ...(imageUrl && { image: imageUrl }),
    };

    const blog = await blogService.createBlog(blogData, req.user.id);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Blog created successfully",
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json({
      success: true,
      statusCode: 200,
      results: blogs.length,
      data: { blogs },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    let imageUrl = undefined;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updateData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    };

    const blog = await blogService.updateBlog(
      req.params.id,
      req.user.id,
      req.user.role,
      updateData
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog updated successfully",
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id, req.user.id, req.user.role);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
