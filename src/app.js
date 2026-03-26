const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const likeRoutes = require("./routes/like.routes");
const commentRoutes = require("./routes/comment.routes");
const errorHandler = require("./middlewares/error.middleware");


// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:3000",
  "https://blog-web-4wi0.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs/:blogId/likes", likeRoutes);
app.use("/api/blogs/:blogId/comments", commentRoutes);

app.use(errorHandler);

module.exports = app;