const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute");
const studentRouter = require("./routes/studentRoute");
const adminRouter = require("./routes/adminRoute");

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://acad96.netlify.app",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

module.exports = app;
