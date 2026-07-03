const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./modules/auth/auth.routes");
const errorHandler = require("./middleware/error.middleware");
const interviewRoutes = require("./modules/interview/interview.routes");
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "InterviewAI API is running ",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use(errorHandler);


module.exports = app;