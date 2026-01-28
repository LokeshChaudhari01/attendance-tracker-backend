const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute");
const studentRouter = require("./routes/studentRoute");
const adminRouter = require("./routes/adminRoute");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
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
