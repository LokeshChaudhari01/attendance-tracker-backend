const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");

const parseRoll = require("../utils/parseRoll");
const subjectMap = require("../utils/subjectMap");

const createSendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const days = Number(process.env.JWT_COOKIE_EXPIRES_IN || 7);

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  });

  return token;
};

exports.signup = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res
        .status(400)
        .json({ message: "Roll number and password required" });
    }

    // password length check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be minimun 6 characters" });
    }

    const { year, branch, rollInBranch } = parseRoll(rollNumber);

    // Semester rule
    let sem;
    if (year === 24) sem = "sem4";
    else if (year === 25) sem = "sem2";
    else {
      return res.status(400).json({
        message: "Only BT24 and BT25 supported currently",
      });
    }

    // Check if already exists
    const existing = await User.findOne({
      rollNumber: rollNumber.toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const subjects = subjectMap[branch][sem];
    if (!subjects) {
      return res.status(400).json({ message: "No subjects mapped" });
    }

    const user = await User.create({
      rollNumber: rollNumber.toLowerCase(),
      password,
      year,
      branch,
      rollInBranch,
    });

    // Attendance creation
    const attendanceDocs = subjects.map((sub) => ({
      student: user._id,
      subject: sub,
      attendedLecs: 0,
      totalLecs: 0,
    }));

    await Attendance.insertMany(attendanceDocs);

    const token = createSendToken(user, res);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        rollNumber: user.rollNumber,
        branch,
        year,
        rollInBranch,
        semester: sem,
      },
      subjects,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        message: "Roll number and password required",
      });
    }

    const user = await User.findOne({
      rollNumber: rollNumber.toLowerCase(),
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Invalid roll number or password",
      });
    }

    const tokem = createSendToken(user, res);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        rollNumber: user.rollNumber,
        branch: user.branch,
        year: user.year,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out" });
};

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        rollNumber: user.rollNumber,
        branch: user.branch,
        year: user.year,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
