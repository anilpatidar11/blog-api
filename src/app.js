const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const likeRoutes = require("./routes/like.routes");
const commentRoutes = require("./routes/comment.routes");
const errorHandler = require("./middlewares/error.middleware");

app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs/:blogId/likes", likeRoutes);
app.use("/api/blogs/:blogId/comments", commentRoutes);

app.use(errorHandler);

module.exports = app;